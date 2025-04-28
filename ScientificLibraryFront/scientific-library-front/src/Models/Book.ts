export interface Book {
    id: string;
    publisherId: string;
    title: string;
    author: string;
    genre: string;
    description: string;
    isbn: string;
    coverImageUrl?: string;
    publicationDate: string;
    pageCount: number;
    language: string;
    format: string;
    keywords: string;
    isAvailable: boolean;
    status: string;
    averageRating:number;
  }

