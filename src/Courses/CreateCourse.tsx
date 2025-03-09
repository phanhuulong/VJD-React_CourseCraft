import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../Context/AppContext";
import { createCourse, Course, FormErrors } from "../Api/course";
import { useNavigate } from "react-router-dom";
import { Category, getAllCategories } from "../Api/category";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Form, Input, Select, Button, Typography, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { UploadChangeParam, UploadFile } from "antd/es/upload";

const { Title } = Typography;
const { Option } = Select;

export default function CreateCourse() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("AppContext is not provided!");
    }

    const { user } = context;
    const navigate = useNavigate();
    
    const [errors, setErrors] = useState<FormErrors>({});
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const { data: categories = [], isLoading } = useQuery<Category[], Error>({
        queryKey: ["categories"],
        queryFn: getAllCategories,
    });

    const mutation = useMutation({
        mutationFn: createCourse,
        onSuccess: () => {
            message.success("Course created successfully!");
            navigate("/my-courses");
        },
        onError: (error: any) => {
            message.error("Failed to create course.");
            if (error && typeof error === "object") {
                setErrors(error);
            }
        },
    });

    const handleFileChange = (info: UploadChangeParam<UploadFile>) => {
        console.log("Upload info:", info);
        
        const file = info.fileList[0]?.originFileObj as File;
        if (file) {
            const allowedExtensions = ["jpg", "jpeg", "png"];
            const fileExtension = file.name.split(".").pop()?.toLowerCase();
    
            if (fileExtension && allowedExtensions.includes(fileExtension)) {
                setSelectedFile(file);
                console.log("📸 File selected:", file);
            } else {
                message.error("Please select a valid image file (.jpg, .jpeg, .png).");
                setSelectedFile(null);
            }
        }
    };
    
    const onFinish = (values: Course) => {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("category_id", String(values.category_id));
        formData.append("price", String(values.price));
        formData.append("url_video", values.url_video);
        formData.append("teacher_id", String(user?.id ?? 0));
    
        if (selectedFile) {
            formData.append("thumbnail_course", selectedFile);
            console.log("Sending file:", selectedFile);
        } else {
            message.error("Please upload a thumbnail image.");
            return;
        }
    
        console.log("FormData content:");
        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
    
        mutation.mutate(formData);
    };
    

    return (
        <div className="container mx-auto p-6 max-w-lg">
            <Title level={2} className="text-center">Create a New Course</Title>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item label="Course Title" name="title" rules={[{ required: true, message: "Title is required!" }]}> 
                    <Input placeholder="Enter course title" />
                </Form.Item>

                <Form.Item label="Description" name="description" rules={[{ required: true, message: "Description is required!" }]}> 
                    <Input.TextArea rows={4} placeholder="Enter description" />
                </Form.Item>

                <Form.Item label="Category" name="category_id" rules={[{ required: true, message: "Please select a category!" }]}> 
                    <Select placeholder="Select category" loading={isLoading}>
                        {categories.map((category) => (
                            <Option key={category.id} value={category.id}>{category.name}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label="Price ($)" name="price" rules={[{ required: true, message: "Price is required!" }]}> 
                    <Input type="number" placeholder="Enter price" />
                </Form.Item>

                <Form.Item label="Thumbnail Image" name="thumbnail_course">
                    <Upload 
                        beforeUpload={() => false} 
                        onChange={handleFileChange}
                        showUploadList={true}
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                </Form.Item>

                <Form.Item label="Video URL" name="url_video" rules={[{ required: true, message: "Video URL is required!" }]}> 
                    <Input placeholder="Enter video URL" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={mutation.isPending}>
                        {mutation.isPending ? "Creating..." : "Create Course"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
