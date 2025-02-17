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
  userId: string;
  bookId: string;
  reviewText: string;
  rating: number;
}