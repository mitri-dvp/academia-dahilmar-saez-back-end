type EmailBody = {
  template: string;
  data: any;
};

type ContactData = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

type SingupBody = {
  data: {
    firstName: string;
    lastName: string;
    documentID: number;
    dateOfBirth: string;
    email: string;
    phone: string;
    password: string;
    role: string;
  };
};
