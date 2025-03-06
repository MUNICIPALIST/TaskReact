export interface Task {
  id: number;
  name: string;
  description?: string;
  date: Date;
  link?: string;
  done: boolean;
}
