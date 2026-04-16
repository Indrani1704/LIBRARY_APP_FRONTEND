export interface Author {
  _id: string;
  name: string;
  image: string;
  isClassic?: boolean;
}

export interface Category {
  _id: string;
  name: string;
  image: string;
}

export interface Book {
  _id: string;
  title: string;
  description?: string;
  price: number;
  genre?: string;
  image?: string;
  rating?: number;
  isBestSeller?: boolean;
  author?: Author;
  category?: Category;
}