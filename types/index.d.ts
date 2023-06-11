type User = {
  id: number;
  firstName: string;
  lastName: string;
  documentID: string;
  dateOfBirth: string;
  username: string;
  email: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
  role: UserRole;
  photo: UserPhoto | null;
};

type UserRole = {
  id: number;
  type: string;
  createdAt: string;
  updatedAt: string;
};

type UserPhoto = {
  id: number;
  name: string;
  url: string;
  createdAt: string;
  updatedAt: string;
};

type Attendance = {
  id: number;
  date: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
};

type Chat = {
  id: number;
  users: User[];
  messages: Message[];
  createdAt: string;
  updatedAt: string;
};

type Message = {
  id: number;
  message: string;
  user: UserMessage;
  createdAt: string;
  updatedAt: string;
};

type UserID = {
  id: number;
};

type Group = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  class: Class;
  schedules: Schedule[];
  users: User[];
};

type Class = {
  id: number;
  name: string;
  description: string;
  type: string;
  createdAt: string;
  updatedAt: string;
};

type Schedule = {
  id: number;
  datetime: string;
  createdAt: string;
  updatedAt: string;
};

type Media = {
  id: number;
  attributes: MediaAttributes;
};

type MediaAttributes = {
  name: string;
  url: string;
  createdAt: string;
  updatedAt: string;
};

type ResourceMeta = {
  pagination: ResourcePagination;
};

type ResourcePagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

type CollectionResponse<T> = {
  data: T;
  meta: ResourceMeta;
};

type PopulateResponse<T> = {
  data: T | null;
};
