import { Question } from './question';

export class Event {
  _id: string;
  cause: string;
  resolution: string;
  patientId: string;
  attachments: string[];
  backgroundQuestions: Question[];
  date: Date;
}
