export interface DecisionItem {
  id: string;
  text: string;
  source: string;
}

export interface SuggestionItem {
  id: string;
  text: string;
  source: string;
}

export interface QuestionItem {
  id: string;
  text: string;
  source: string;
}

export interface ActionItem {
  id: string;
  task: string;
  owner: string | null;
  deadline: string | null;
  status: 'Assigned' | 'Needs clarification';
  source: string;
  missingDetails?: string[];
}

export interface MeetingAnalysis {
  id: string;
  title: string;
  summary: string;
  rawNotes: string;
  createdAt: string;
  fileName?: string;
  decisions: DecisionItem[];
  suggestions: SuggestionItem[];
  questions: QuestionItem[];
  actions: ActionItem[];
}

export type ActiveView = 'landing' | 'dashboard' | 'analyze' | 'insights' | 'actions' | 'settings';
