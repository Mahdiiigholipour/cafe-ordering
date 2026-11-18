export interface CategoriesResponse {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
