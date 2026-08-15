import { apiClient } from "./apiClient";
import type {
    Category,
    CreateCategoryRequest,
    UpdateCategoryRequest,
} from "../types/category";

export const categoryService = {
    async getAll(): Promise<Category[]> {
        const response = await apiClient.get<Category[]>("/Categories");
        return response.data;
    },

    async getById(id: string): Promise<Category> {
        const response = await apiClient.get<Category>(`/Categories/${id}`);
        return response.data;
    },

    async create(request: CreateCategoryRequest): Promise<Category> {
        const response = await apiClient.post<Category>(
            "/Categories",
            request
        );

        return response.data;
    },

    async update(
        id: string,
        request: UpdateCategoryRequest
    ): Promise<Category> {
        const response = await apiClient.put<Category>(
            `/Categories/${id}`,
            request
        );

        return response.data;
    },

    async delete(id: string): Promise<void> {
        await apiClient.delete(`/Categories/${id}`);
    },
};