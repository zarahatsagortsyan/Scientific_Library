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