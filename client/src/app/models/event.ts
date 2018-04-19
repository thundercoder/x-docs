import { Question } from './question';

export class Event {
  _id: string;
  cause: string;
  resolution: string;
  patientId: string;
  attachments: any[] = [];
  backgroundQuestions: Question[];
  date: Date;
}
