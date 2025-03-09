import axios from "axios";

export interface Category {
    id: number;
    name: string;
}

export const getAllCategories = async (): Promise<Category[]>  => {
    try {
        const res = await axios.get<Category[]>("/api/categories");
        return res.data;
    } catch (error: any) {
        console.error("Error fetching categories:", error);
        throw error.response?.data || error.message;
    }
};