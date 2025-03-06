// authService.ts
import axios from "axios";

export interface LoginResponse {
    token: string;
}

interface RegisterData {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await axios.post<LoginResponse>('/api/login', { email, password }, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        return response.data; 
    } catch (error: any) {
        if (error.response && error.response.data) {
            throw error.response.data;
        }
        throw new Error("Something went wrong");
    }
};

export const registerUser = async (formData: RegisterData) => {
    try {
        const response = await axios.post("/api/register", formData, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};
