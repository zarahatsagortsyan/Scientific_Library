// export interface User {
//     id: string;
//     name: string;
//     email: string;
//     banned: boolean;
//   }

  export interface User {
  id: string;
  userName: string;
  email: string;
  type: string; // 'Reader' or 'Publisher' or 'Admin'
  banned: boolean;
  createdDate: string; // ISO date string
  birthDate: string; // ISO date string
}