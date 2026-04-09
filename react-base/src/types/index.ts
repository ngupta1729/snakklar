export interface FeedbackResult {
  correction: string;
  better_alternative: string;
  native_version: string;
  explanation: string;
}

export interface CoachResponse {
  feedback: FeedbackResult;
  conversation_reply: string;
}

export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  userText?: string;
  feedback?: FeedbackResult;
  reply?: string;
  timestamp: number;
}

export interface Scenario {
  id: string;
  label: string;
  description: string;
  characterName: string;
  openingLine: string;
}
