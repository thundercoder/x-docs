export class Patient {
  _id: string;
  firstName: string;
  lastName: string;
  body: {
    height: number;
    weight: number;
    color: string;
  }
}
