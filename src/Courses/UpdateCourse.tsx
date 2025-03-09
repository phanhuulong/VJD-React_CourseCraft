import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Select, Button, message, Spin, Upload } from "antd";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getCourseById, updateCourse, type Course } from "../Api/course";
import { AppContext } from "../Context/AppContext";
import { getAllCategories } from "../Api/category";
import { UploadChangeParam, UploadFile } from "antd/es/upload";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function UpdateCourse() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useContext(AppContext) ?? { token: null };
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Fetch course data
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: () => (id ? getCourseById(Number(id)) : null),
    enabled: !!id && !!token, // Chỉ fetch khi có id và token
  });

  // Khi dữ liệu đã tải xong, cập nhật vào form
  useEffect(() => {
    if (course) {
      form.setFieldsValue(course);
    }
  }, [course, form]);


  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  // Mutation để cập nhật course
  const { mutate, isPending: submitting } = useMutation({
    mutationFn: (formData: FormData) => updateCourse(Number(id), formData),
    onSuccess: () => {
      message.success("Course updated successfully!");
      navigate("/my-courses");
    },
    onError: (error: any) => {
      console.error("Error details:", error);
      
      // Check if error has response property (from Axios)
      if (error.response) {
        const status = error.response.status;
        
        if (status === 422) {
          // Parse validation errors
          const validationErrors = error.response.data;
          console.log("Validation errors:", validationErrors);
          
          // Display each validation error
          if (typeof validationErrors === 'object') {
            Object.entries(validationErrors).forEach(([field, messages]: [string, any]) => {
              if (Array.isArray(messages)) {
                messages.forEach((msg: string) => message.error(`${field}: ${msg}`));
              }
            });
          } else {
            message.error("Validation failed. Please check your form inputs.");
          }
        } else if (status === 500) {
          message.error("Server error. Please try again later.");
        } else {
          message.error(`Error (${status}): Please try again.`);
        }
      } else {
        message.error("Failed to update course. Please check your connection.");
      }
    },
  });

  // Xử lý submit form
  const handleSubmit = async (values: Partial<Course>) => {
    if (!token || !id) return;
  
    const formData = new FormData();
    formData.append("title", values.title || "");
    formData.append("description", values.description || "");
    formData.append("category_id", String(values.category_id)); // Ép kiểu thành số
    formData.append("price", String(values.price)); // Ép kiểu thành số thực
    formData.append("url_video", values.url_video || "");
  
    if (selectedFile) {
      formData.append("thumbnail_course", selectedFile);
    }
     
    console.log("FormData content:", Object.fromEntries(formData.entries()));
    
    mutate(formData);
  };
  
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

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Update Course</h1>

      {courseLoading || categoriesLoading ? (
        <Spin size="large" />
      ) : (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Course Title"
            name="title"
            rules={[{ required: true, message: "Please enter course title!" }]}
          >
            <Input placeholder="Course Title" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description!" }]}
          >
            <Input.TextArea placeholder="Course Description" rows={4} />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category_id"
            rules={[{ required: true, message: "Please select a category!" }]}
          >
            <Select placeholder="Select Category">
              {categories?.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please enter price!" }]}
          >
            <Input type="number" placeholder="Price" />
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

          <Form.Item
            label="Video URL"
            name="url_video"
            rules={[{ required: true, message: "Please enter video URL!" }]}
          >
            <Input placeholder="Video URL" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={submitting}>
              {submitting ? "Updating..." : "Update Course"}
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
}
