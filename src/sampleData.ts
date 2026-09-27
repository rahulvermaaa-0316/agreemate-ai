import { MeetingAnalysis } from './types';

export const CANONICAL_EXAMPLE_NOTES = `We agreed to use React for the frontend.
We could add dark mode later.
Priya will prepare the dataset by Friday.
Testing should be completed Monday.
Who will handle deployment?`;

export const STUDENT_CLUB_NOTES = `Rahul: We agreed to cap event registration at 120 students for the CS Lab.
Aman: We could invite alumni from Google for the keynote if they are in town.
Priya: I will finalize the sponsorship deck by Thursday.
Marcus: I'll reach out to the campus catering team by Friday morning.
Rahul: Who will handle the hardware equipment setup?
Testing the live demo setup should be completed Monday afternoon.
Aman: Maybe we could host an informal Discord Q&A beforehand.`;

export const CAPSTONE_PROJECT_NOTES = `Team agreed to use PostgreSQL for user auth and metadata storage.
Sarah: We might want to benchmark vector search against SQLite just to see latency.
Dev: I will build the REST API endpoints by next Tuesday.
Elena: I'll conduct user testing interviews with 5 classmates before Thursday.
Who will write the final capstone proposal documentation?
Dev: Should we submit draft slides to Professor Evans by Wednesday?`;

export const INITIAL_MEETING: MeetingAnalysis = {
  id: 'meet-1',
  title: 'Frontend & Architecture Sync',
  summary: 'Settled on React for frontend architecture, assigned dataset preparation and testing milestones, with deployment ownership remaining open.',
  rawNotes: CANONICAL_EXAMPLE_NOTES,
  createdAt: 'Just now',
  decisions: [
    {
      id: 'dec-1',
      text: 'Use React for the frontend.',
      source: 'We agreed to use React for the frontend.',
    },
  ],
  suggestions: [
    {
      id: 'sug-1',
      text: 'Add dark mode later.',
      source: 'We could add dark mode later.',
    },
  ],
  questions: [
    {
      id: 'q-1',
      text: 'Who will handle deployment?',
      source: 'Who will handle deployment?',
    },
  ],
  actions: [
    {
      id: 'act-1',
      task: 'Prepare dataset',
      owner: 'Priya',
      deadline: 'Friday',
      status: 'Assigned',
      source: 'Priya will prepare the dataset by Friday.',
    },
    {
      id: 'act-2',
      task: 'Complete testing',
      owner: 'Owner missing',
      deadline: 'Monday',
      status: 'Needs clarification',
      source: 'Testing should be completed Monday.',
    },
    {
      id: 'act-3',
      task: 'Handle deployment',
      owner: 'Owner missing',
      deadline: 'Deadline missing',
      status: 'Needs clarification',
      source: 'Who will handle deployment?',
    },
  ],
};
