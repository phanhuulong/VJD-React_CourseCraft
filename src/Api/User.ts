// userService.ts
import axios from 'axios';
import { useState } from 'react';
// User interface
export interface User {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    profile_picture: string;
    role: string;
    // bio: string;
    // locked: boolean;
    //money: number | null;
}

export interface RegisterForm {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export const getUser = async (): Promise<User> => {
    try {
        const token = localStorage.getItem('token'); // Lấy token từ localStorage
        const response = await axios.get<User>('/api/user', {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": 'application/json',
            },
        });
        return response.data; // Trả về dữ liệu người dùng
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};
