  export interface User {
  id: string;
  companyName:string;
  firstName: string;
  lastName:string;
  email: string;
  type: string; // 'Reader' or 'Publisher' or 'Admin'
  banned: boolean;
  createdDate: string; // ISO date string
  birthDate: string; // ISO date string
}