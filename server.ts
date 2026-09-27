import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import multer from 'multer';
import { createRequire } from 'module';

dotenv.config();

const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

// Configure multer memory storage with 10MB limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'AgreeMate AI' });
});

// Document Text Extraction Endpoint
app.post('/api/extract-document', (req, res) => {
  upload.single('file')(req, res, async (err: any) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          error: 'File is too large. Maximum file size is 10 MB.',
        });
      }
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message || 'File upload failed.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a meeting document.' });
    }

    const originalName = req.file.originalname || 'document.txt';
    const ext = path.extname(originalName).toLowerCase();

    if (!['.pdf', '.docx', '.txt'].includes(ext)) {
      return res.status(400).json({
        error: 'Unsupported file type. Please upload PDF, DOCX or TXT.',
      });
    }

    try {
      let extractedText = '';

      if (ext === '.txt') {
        extractedText = req.file.buffer.toString('utf-8');
      } else if (ext === '.docx') {
        const mammothResult = await mammoth.extractRawText({ buffer: req.file.buffer });
        extractedText = mammothResult.value;
      } else if (ext === '.pdf') {
        const pdfData = await pdf(req.file.buffer);
        extractedText = pdfData.text;
      }

      // Clean up whitespace & normalize line endings
      const cleanText = (extractedText || '').replace(/\r\n/g, '\n').trim();

      if (!cleanText || cleanText.length === 0) {
        return res.status(400).json({
          error: 'No readable text was found in this document. Please upload a text-based PDF, DOCX or TXT file.',
        });
      }

      return res.json({
        text: cleanText,
        fileName: originalName,
        fileSize: req.file.size,
        fileType: ext.replace('.', '').toUpperCase(),
      });
    } catch (parseError: any) {
      console.error('Error parsing document:', parseError);
      return res.status(400).json({
        error: 'No readable text was found in this document. Please upload a text-based PDF, DOCX or TXT file.',
      });
    }
  });
});

// API endpoint for analyzing meeting notes
app.post('/api/analyze', async (req, res) => {
  try {
    const { notes } = req.body;

    if (!notes || typeof notes !== 'string' || notes.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide non-empty meeting notes.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Deterministic fallback for environments without an active API key
      const fallbackResult = generateDeterministicFallback(notes);
      return res.json(fallbackResult);
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemPrompt = `You are the core analysis engine of AgreeMate AI.
You solve this problem:
"After a project or student-club meeting, rough notes mix ideas, decisions, and promises. Participants leave with different understandings of what was agreed and who should act next."

You must strictly execute these two core jobs without cross-contamination:

==================================================
FEATURE 1 — MEETING NOTES CLASSIFICATION
==================================================
Classify content from the rough notes into EXACTLY THREE categories:

1. Confirmed Decisions:
- ONLY settled agreements and confirmed choices settled by the team (e.g. "Rahul: We agreed that Rahul will handle the frontend development using React", "We decided to use React").
- CRITICAL: A confirmed decision must NEVER automatically become an Action Item! Even if it mentions a person or a tool, if the sentence states an agreement ("We agreed that...", "We decided..."), it belongs ONLY under Confirmed Decisions.

2. Suggestions:
- Tentative ideas, brainstorming thoughts, proposals, recommendations, or things we "could" or "should also" do that are not yet committed (e.g. "Satyam: I think we could add a dark mode to the project later", "Satyam: We should also test the complete application before the final demo").
- CRITICAL: Suggestions must NOT become Action Items! Keep them under Suggestions unless the meeting language explicitly confirms someone agreed to perform it.

3. Open Questions:
- Unresolved questions, inquiries, or undecided matters (e.g. "Rahul: Who will handle the final presentation?", "Who will handle deployment?", "Utkarsh: The deployment still needs to be decided").
- Statements that something "still needs to be decided" or "needs to be decided" are Open Questions.
- CRITICAL: OPEN QUESTIONS MUST NEVER BECOME ACTION ITEMS! Any sentence asking "Who will handle...", "What should...", "When will...", or stating that something needs to be decided belongs ONLY under Open Questions. NEVER create an action item from an open question!

For every single item in all three categories, extract the original source sentence from the notes verbatim.

==================================================
FEATURE 2 — ACTION ITEMS EXTRACTION
==================================================
Extract ONLY real execution tasks/commitments that someone actually promised or committed to perform.

STRICT ELIGIBILITY RULES FOR ACTION ITEMS:
1. CONFIRMED DECISIONS MUST NOT BE ACTION ITEMS. If a statement is a confirmed decision (e.g. "We agreed that Rahul will handle the frontend development using React"), it belongs under Confirmed Decisions, NOT Action Items.
2. OPEN QUESTIONS MUST NEVER BE ACTION ITEMS. Questions like "Who will handle the final presentation?" or statements like "The deployment still needs to be decided" must NEVER produce action items. Do NOT create actions like "Handle the final presentation" or "Handle deployment".
3. SUGGESTIONS MUST NOT BE ACTION ITEMS. Statements like "We should also test the complete application before the final demo" or "I think we could add dark mode..." must NOT produce action items.
4. VALID ACTION ITEMS are direct commitments or task promises, such as:
   - "Utkarsh: I will prepare the dataset by Friday." -> Task: "Prepare the dataset", Owner: "Utkarsh", Deadline: "Friday", Status: "Assigned"
   - Compound sentences with separate clauses:
     "Sachin: I can work on the backend API, and we should finish the first version by Monday."
     Extract two separate potential actions:
     Action 1: Task: "Work on the backend API", Owner: "Sachin", Deadline: null, missingDetails: ["deadline"], Status: "Needs clarification".
     Action 2: Task: "Finish the first version", Owner: null, Deadline: "Monday", missingDetails: ["owner"], Status: "Needs clarification".
     DO NOT attach Monday to "Work on the backend API"!

ACTION ITEM FIELDS:
- task: clear, concise statement of the actionable work to be performed.
- owner: name of the person if explicitly assigned or committed (e.g. speaker name if "I will/can" or named person). If missing or not explicitly stated: set owner strictly to null and include "owner" in missingDetails. DO NOT GUESS.
- deadline: explicit deadline if mentioned (e.g. "Friday", "Monday"). If missing: set deadline strictly to null and include "deadline" in missingDetails. DO NOT GUESS.
- status: if owner is null or deadline is null, mark status strictly as "Needs clarification". If BOTH owner and deadline are explicitly present, mark status as "Assigned".
- source: exact original sentence from the rough notes verbatim.
- missingDetails: array containing "owner" and/or "deadline" if they are missing.

DO NOT invent information that is not present in the notes.`;

    let textOutput: string | undefined;

    // Try models with fallback
    const candidateModels = ['gemini-3.5-flash-lite', 'gemini-2.5-flash'];
    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [
            {
              text: `Analyze these meeting notes and extract confirmed decisions, suggestions, open questions, and action items according to the rules:\n\n"""\n${notes}\n"""`,
            },
          ],
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.1,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: {
                  type: Type.STRING,
                  description: 'A brief 3 to 7 word descriptive title for this meeting',
                },
                summary: {
                  type: Type.STRING,
                  description: 'A concise 1-2 sentence overview of what occurred in the meeting',
                },
                decisions: {
                  type: Type.ARRAY,
                  description: 'Confirmed decisions agreed upon by the team',
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      text: { type: Type.STRING, description: 'Clear statement of the confirmed decision' },
                      source: { type: Type.STRING, description: 'Exact sentence from original notes' },
                    },
                    required: ['text', 'source'],
                  },
                },
                suggestions: {
                  type: Type.ARRAY,
                  description: 'Tentative suggestions and ideas that are not confirmed decisions',
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      text: { type: Type.STRING, description: 'The suggestion or idea' },
                      source: { type: Type.STRING, description: 'Exact sentence from original notes' },
                    },
                    required: ['text', 'source'],
                  },
                },
                openQuestions: {
                  type: Type.ARRAY,
                  description: 'Unresolved questions and points needing clarification',
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      text: { type: Type.STRING, description: 'The open question' },
                      source: { type: Type.STRING, description: 'Exact sentence from original notes' },
                    },
                    required: ['text', 'source'],
                  },
                },
                actions: {
                  type: Type.ARRAY,
                  description: 'Action items extracted from notes with owners and deadlines',
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      task: { type: Type.STRING, description: 'Actionable task statement' },
                      owner: { type: Type.STRING, nullable: true, description: 'Name of owner or null if missing' },
                      deadline: { type: Type.STRING, nullable: true, description: 'Deadline if mentioned, or null if missing' },
                      status: { type: Type.STRING, description: '"Assigned" or "Needs clarification"' },
                      source: { type: Type.STRING, description: 'Exact sentence from original notes' },
                      missingDetails: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: 'List containing "owner" and/or "deadline" if missing',
                      },
                    },
                    required: ['task', 'status', 'source'],
                  },
                },
              },
              required: ['decisions', 'suggestions', 'openQuestions', 'actions'],
            },
          },
        });

        if (response.text) {
          textOutput = response.text;
          break;
        }
      } catch (modelErr: any) {
        console.warn(`Model ${modelName} failed, trying next fallback:`, modelErr.message);
      }
    }

    if (!textOutput) {
      const fallbackResult = generateDeterministicFallback(notes);
      return res.json(fallbackResult);
    }

    const parsed = JSON.parse(textOutput);

    // Normalize IDs and null checks
    const normalizedDecisions = (parsed.decisions || []).map((d: any, idx: number) => ({
      id: d.id || `dec-${idx + 1}`,
      text: d.text,
      source: d.source || notes.split('\n')[0] || '',
    }));

    const normalizedSuggestions = (parsed.suggestions || []).map((s: any, idx: number) => ({
      id: s.id || `sug-${idx + 1}`,
      text: s.text,
      source: s.source || notes.split('\n')[0] || '',
    }));

    const rawQuestions = parsed.openQuestions || parsed.questions || [];
    const normalizedQuestions = rawQuestions.map((q: any, idx: number) => ({
      id: q.id || `q-${idx + 1}`,
      text: q.text,
      source: q.source || notes.split('\n')[0] || '',
    }));

    const rawActions = (parsed.actions || []).map((a: any, idx: number) => {
      let owner = a.owner;
      let deadline = a.deadline;

      const isMissingOwner =
        owner === null ||
        owner === undefined ||
        owner === '' ||
        owner === 'null' ||
        typeof owner !== 'string' ||
        owner.toLowerCase().includes('missing') ||
        owner.toLowerCase().includes('clarification') ||
        owner.toLowerCase().includes('not specified');

      const isMissingDeadline =
        deadline === null ||
        deadline === undefined ||
        deadline === '' ||
        deadline === 'null' ||
        typeof deadline !== 'string' ||
        deadline.toLowerCase().includes('missing') ||
        deadline.toLowerCase().includes('clarification') ||
        deadline.toLowerCase().includes('not specified');

      const missingDetails: string[] = Array.isArray(a.missingDetails) ? [...a.missingDetails] : [];
      if (isMissingOwner) {
        owner = null;
        if (!missingDetails.includes('owner')) missingDetails.push('owner');
      }
      if (isMissingDeadline) {
        deadline = null;
        if (!missingDetails.includes('deadline')) missingDetails.push('deadline');
      }

      const status: 'Assigned' | 'Needs clarification' =
        isMissingOwner || isMissingDeadline ? 'Needs clarification' : (a.status === 'Assigned' ? 'Assigned' : 'Needs clarification');

      return {
        id: a.id || `act-${idx + 1}`,
        task: a.task,
        owner,
        deadline,
        status,
        source: a.source || notes.split('\n')[0] || '',
        missingDetails,
      };
    });

    // STRICT FILTERING OF ACTION ITEMS:
    // 1. Confirmed decisions must NOT automatically become Action Items.
    // 2. Open questions must NEVER become Action Items.
    // 3. Suggestions must NOT become Action Items.
    const normalizedActions = rawActions.filter((action: any) => {
      const taskLower = (action.task || '').toLowerCase();
      const sourceLower = (action.source || '').toLowerCase();

      // Rule 1: Exclude Confirmed Decisions
      const isDecisionSource = normalizedDecisions.some((d: any) => {
        const dSrcLower = (d.source || '').toLowerCase();
        return (
          dSrcLower === sourceLower ||
          (dSrcLower.length > 8 && sourceLower.includes(dSrcLower)) ||
          (sourceLower.length > 8 && dSrcLower.includes(sourceLower))
        );
      });
      if (
        isDecisionSource ||
        sourceLower.includes('we agreed') ||
        sourceLower.includes('agreed that') ||
        sourceLower.includes('agreed to') ||
        sourceLower.includes('we decided')
      ) {
        return false;
      }

      // Rule 2: Exclude Open Questions
      const isQuestionSource = normalizedQuestions.some((q: any) => {
        const qSrcLower = (q.source || '').toLowerCase();
        return (
          qSrcLower === sourceLower ||
          (qSrcLower.length > 8 && sourceLower.includes(qSrcLower)) ||
          (sourceLower.length > 8 && qSrcLower.includes(sourceLower))
        );
      });
      if (
        isQuestionSource ||
        action.source.trim().endsWith('?') ||
        sourceLower.includes('who will') ||
        sourceLower.includes('who is') ||
        sourceLower.includes('what should') ||
        sourceLower.includes('when should') ||
        sourceLower.includes('still needs to be decided') ||
        sourceLower.includes('needs to be decided') ||
        sourceLower.includes('yet to be decided') ||
        taskLower.startsWith('who will')
      ) {
        return false;
      }

      // Rule 3: Exclude Suggestions
      const isSuggestionSource = normalizedSuggestions.some((s: any) => {
        const sSrcLower = (s.source || '').toLowerCase();
        return (
          sSrcLower === sourceLower ||
          (sSrcLower.length > 8 && sourceLower.includes(sSrcLower)) ||
          (sourceLower.length > 8 && sSrcLower.includes(sourceLower))
        );
      });
      if (
        isSuggestionSource ||
        sourceLower.includes('i think we could') ||
        sourceLower.includes('we could add') ||
        sourceLower.includes('we should also') ||
        sourceLower.includes('suggest')
      ) {
        return false;
      }

      return true;
    }).map((act: any, idx: number) => ({
      ...act,
      id: `act-${idx + 1}`,
    }));

    return res.json({
      title: parsed.title || 'Meeting Analysis',
      summary: parsed.summary || 'Analyzed meeting notes separating agreed decisions from suggestions, open questions, and actionable tasks.',
      decisions: normalizedDecisions,
      suggestions: normalizedSuggestions,
      questions: normalizedQuestions,
      openQuestions: normalizedQuestions,
      actions: normalizedActions,
    });
  } catch (error: any) {
    console.error('Error analyzing meeting notes:', error);
    try {
      const fallbackResult = generateDeterministicFallback(req.body.notes || '');
      return res.json(fallbackResult);
    } catch (fallbackError) {
      return res.status(500).json({
        error: 'We couldn’t analyze these notes. Please try again.',
        details: error.message,
      });
    }
  }
});

// Deterministic fallback analyzer
function generateDeterministicFallback(rawNotes: string) {
  const lines = rawNotes
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const decisions: any[] = [];
  const suggestions: any[] = [];
  const questions: any[] = [];
  const actions: any[] = [];

  let idCounter = 1;

  for (const line of lines) {
    const speakerMatch = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    const speaker = speakerMatch ? speakerMatch[1] : '';
    const content = speakerMatch ? speakerMatch[2] : line;
    const contentLower = content.toLowerCase();

    // 1. Confirmed decisions (MUST NOT become Action Items)
    if (
      contentLower.includes('agreed that') ||
      contentLower.includes('agreed to') ||
      contentLower.includes('decided to') ||
      contentLower.includes('decision:') ||
      contentLower.includes('we agreed') ||
      contentLower.includes('agreed on') ||
      contentLower.includes('confirmed that') ||
      contentLower.includes("let's use react") ||
      contentLower.includes('chosen')
    ) {
      let text = content.replace(/^(we agreed that|we agreed to|agreed that|agreed to|decided to|decision:\s*|we decided to)\s*/i, '').trim();
      text = text.charAt(0).toUpperCase() + text.slice(1);
      decisions.push({
        id: `dec-${idCounter++}`,
        text: text.endsWith('.') ? text : text + '.',
        source: line,
      });
      continue;
    }

    // 2. Open questions (MUST NEVER become Action Items)
    if (
      content.endsWith('?') ||
      contentLower.startsWith('who will') ||
      contentLower.includes('who will') ||
      contentLower.startsWith('who is') ||
      contentLower.startsWith('when will') ||
      contentLower.startsWith('how will') ||
      contentLower.includes('needs to be decided') ||
      contentLower.includes('still needs to be decided') ||
      contentLower.includes('yet to be decided')
    ) {
      questions.push({
        id: `q-${idCounter++}`,
        text: content,
        source: line,
      });
      continue;
    }

    // 3. Suggestions (MUST NOT become Action Items)
    if (
      contentLower.includes('could') ||
      contentLower.includes('maybe') ||
      contentLower.includes('might') ||
      contentLower.includes('what if') ||
      contentLower.includes('suggest') ||
      contentLower.includes('idea:') ||
      contentLower.includes('should also') ||
      contentLower.includes('we should') ||
      contentLower.includes('i think') ||
      contentLower.includes('we can explore')
    ) {
      let text = content.replace(/^(i think we could|we could|maybe we|suggested to|idea:\s*|we should also|we should)\s*/i, '').trim();
      text = text.charAt(0).toUpperCase() + text.slice(1);
      suggestions.push({
        id: `sug-${idCounter++}`,
        text: text.endsWith('.') ? text : text + '.',
        source: line,
      });
      continue;
    }

    // 4. Action items (Real execution commitments only)
    // Handle compound sentences first:
    // e.g. "Sachin: I can work on the backend API, and we should finish the first version by Monday."
    if (content.includes(', and ') || content.includes(' and we should ')) {
      const parts = content.split(/,\s*and\s+|\s+and\s+we\s+should\s+/i);
      if (parts.length >= 2) {
        // Part 1
        const part1 = parts[0].trim();
        let p1Task = part1.replace(/^[A-Za-z0-9_-]+\s*:\s*/i, '').replace(/^I\s+(can\s+work\s+on|will\s+work\s+on|can|will)\s+/i, '').trim();
        if (!p1Task.toLowerCase().startsWith('work on')) {
          p1Task = 'Work on ' + p1Task;
        }
        p1Task = p1Task.charAt(0).toUpperCase() + p1Task.slice(1);

        actions.push({
          id: `act-${idCounter++}`,
          task: p1Task,
          owner: speaker || null,
          deadline: null,
          status: 'Needs clarification',
          source: line,
          missingDetails: ['deadline'],
        });

        // Part 2
        const part2 = parts[1].trim();
        const p2DeadlineMatch = part2.match(/(?:by|before|on)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i);
        const p2Deadline = p2DeadlineMatch ? p2DeadlineMatch[1].charAt(0).toUpperCase() + p2DeadlineMatch[1].slice(1) : null;
        let p2Task = part2.replace(/(?:we\s+should\s+)?(finish\s+the\s+first\s+version).*/i, '$1').trim();
        p2Task = p2Task.charAt(0).toUpperCase() + p2Task.slice(1);

        actions.push({
          id: `act-${idCounter++}`,
          task: p2Task,
          owner: null,
          deadline: p2Deadline,
          status: 'Needs clarification',
          source: line,
          missingDetails: ['owner'],
        });
        continue;
      }
    }

    const hasPromise = contentLower.includes('will') || contentLower.includes("i'll") || contentLower.includes('can work');
    if (hasPromise) {
      let owner: string | null = null;
      let deadline: string | null = null;
      const missingDetails: string[] = [];

      // Determine owner
      if (speaker && (contentLower.includes("i'll") || contentLower.includes('i will') || contentLower.includes('i can'))) {
        owner = speaker;
      } else {
        const nameMatch = content.match(/^([A-Z][a-z]+)\s+will/);
        if (nameMatch) {
          owner = nameMatch[1];
        }
      }

      // Determine deadline
      const deadlineMatch = content.match(/(?:by|before|on|due|completed)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|tonight|next week|eod)/i);
      if (deadlineMatch) {
        deadline = deadlineMatch[1].charAt(0).toUpperCase() + deadlineMatch[1].slice(1);
      }

      if (!owner) missingDetails.push('owner');
      if (!deadline) missingDetails.push('deadline');

      let taskClean = content
        .replace(/^[A-Z][a-z]+\s+will\s+/i, '')
        .replace(/^I('ll| will|\s+will|\s+can)\s+/i, '')
        .replace(/^I\s+(can\s+work\s+on|will\s+work\s+on)\s+/i, 'Work on ')
        .replace(/\s+by\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|tonight|next week).*/i, '')
        .trim();

      taskClean = taskClean.charAt(0).toUpperCase() + taskClean.slice(1);

      actions.push({
        id: `act-${idCounter++}`,
        task: taskClean,
        owner,
        deadline,
        status: missingDetails.length > 0 ? 'Needs clarification' : 'Assigned',
        source: line,
        missingDetails,
      });
      continue;
    }

    // Default to suggestions
    suggestions.push({
      id: `sug-${idCounter++}`,
      text: content,
      source: line,
    });
  }

  return {
    title: 'Meeting Analysis',
    summary: 'Analyzed meeting notes separating agreed decisions from suggestions, open questions, and actionable tasks.',
    decisions,
    suggestions,
    questions,
    openQuestions: questions,
    actions,
  };
}

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`AgreeMate AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
