import { Question } from './question';

class Profile {
  gender: string;
  address: string;
  firstName: string;
  lastName: string;
  website: string;
  phone: string;
  mobile: string;
  birthDate: Date;
}

export class User {
  _id: string;
  email: string;
  active: boolean;
  specialist: string;
  profile: Profile;
  questions: Question[];
  createAt: Date;
}
