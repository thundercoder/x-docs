export class Patient {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  mobile: string;
  body: {
    height: number;
    weight: number;
    color: string;
  };
}
