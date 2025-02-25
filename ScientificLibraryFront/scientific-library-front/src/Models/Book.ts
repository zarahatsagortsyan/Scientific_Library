// import { Publisher } from "./Publisher";
// import { Review } from "./Review";

// export interface Book {
//   id: string;
//   publisherId: string;
//   title: string;
//   author: string;
//   genre: string;
//   description: string;
//   publicationDate: string;
//   coverImageUrl: string;
//   status: number;
//   isAvailable: boolean;
//     // Id: string;
//     // Title: string;
//     // Author: string;
//     // Genre: string;
//     // Description: string;
//     // ISBN: string;
//     // CoverImageUrl?: string;
//     // PublicationDate: string; // ISO format string or Date
//     // PageCount: number;
//     // Language: string;
//     // Format?: string;
//     // Keywords?: string;
//     // IsAvailable: boolean;
//     // Publisher?: Publisher;
//     // Reviews?: Review[];
//   }

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

  }

// export type { Review };
