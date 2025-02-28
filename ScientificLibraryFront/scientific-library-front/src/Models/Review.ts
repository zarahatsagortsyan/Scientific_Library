// export interface Review {
//   id: number;
//   reviewText: string;
//   rating: number;
//   createdAt: string;
//   userId: string;
//   user: {
//       firstName: string;
//       lastName: string;
//   };
// }

export interface Review {
  id: string;
  userId: string;
  bookId: string;
  bookTitle:string;
  reviewText: string;
  rating: number;
  createdAt: string;
  userName: string;
}