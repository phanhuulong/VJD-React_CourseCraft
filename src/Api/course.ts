import axios from "axios";

export interface Course {
    id?: number;
    title: string;
    description: string;
    teacher_id?: number;
    category_id: number;
    price: number;
    thumbnail_course: string;
    url_video: string;
}

export interface FormErrors {
    title?: string[];
    description?: string[];
    category_id?: string[];
    price?: string[];
    thumbnail_course?: string[];
    url_video?: string[];
}
export const createCourse = async (formData: FormData) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token missing!");
        console.log(formData);
        const res = await axios.post("/api/courses", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error: any) {
        console.error("Error Response:", error.response?.data);
        throw error.response?.data || error.message;
    }
};

export const getAllCourse = async (): Promise<Course[]> => {
    try {
        const res = await axios.get("/api/courses"); // Không cần headers
        return Array.isArray(res.data) ? res.data : [];
    } catch (error: any) {
        console.error("Error fetching courses:", error);
        throw error.response?.data || error.message;
    }
};

export const deleteCourse = async (id: number) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token missing!");

        const res = await axios.delete(`/api/courses/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": 'application/json',
            },
        });

        console.log("Deleted:", res.data);
        return res.data;
        
    } catch (error: any) {
        console.error("Error deleting course:", error.response?.data || error.message);
        throw error.response?.data || error.message;
    }
};


export const updateCourse = async (id: number, formData: FormData) => {

  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication token missing!");
    
    formData.append('_method', 'PUT'); 
    const res = await axios.post(`/api/courses/${id}`, formData, {

      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getCourseById = async (id: number): Promise<Course> => {
    try {
        const res = await axios.get(`/api/courses/${id}`);
        console.log(res.data);
        return res.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const getCoursesByTeacher = async (teacherId: number): Promise<Course[]> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token missing!");
        const res = await axios.get(`/api/courses/teacher/${teacherId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": 'application/json',

            },
        });
        return Array.isArray(res.data) ? res.data : [];
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const getCoursesExceptOwn = async (): Promise<Course[]> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token missing!");
        const res = await axios.get("/api/courses/except-own", {
            headers: {
                Authorization: `Bearer ${token}`,
            "Content-Type": 'application/json',
            },
        });
        return Array.isArray(res.data) ? res.data : [];
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};




