export interface ProductResponse {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image: string | null;
  isActive: boolean;
  categoryId: string;
  category: {
    id: string;
    name: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}
