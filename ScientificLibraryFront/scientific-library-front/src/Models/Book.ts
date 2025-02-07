import { Publisher } from "./Publisher";
import { Review } from "./Review";

export interface Book {
    Id: string;
    Title: string;
    Author: string;
    Genre: string;
    Description: string;
    ISBN: string;
    CoverImageUrl?: string;
    PublicationDate: string; // ISO format string or Date
    PageCount: number;
    Language: string;
    Format?: string;
    Keywords?: string;
    IsAvailable: boolean;
    Publisher?: Publisher;
    Reviews?: Review[];
  }

export type { Review };
