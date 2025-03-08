import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AppContext } from "../../Context/AppContext";
import { registerUser } from "../../Api/auth";
import { RegisterForm } from "../../Api/User";
import { Form, Input, Button, message } from "antd";

export default function Register() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("AppContext is not provided!");
    }
    const { setToken } = context;
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const mutation = useMutation({
        mutationFn: async (values: RegisterForm) => await registerUser(values),
        onSuccess: (data) => {
            localStorage.setItem("token", data.token);
            setToken(data.token);
            message.success("Registration successful!");
            navigate("/");
        },
        onError: (error: any) => {
            message.error("Registration failed!");
            form.setFields(Object.entries(error.errors || {}).map(([field, messages]) => ({
                name: field,
                errors: messages as string[],
            })));
        },
    });

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Form
                form={form}
                layout="vertical"
                className="w-1/3 bg-white p-6 rounded-lg shadow-lg"
                onFinish={mutation.mutate}
            >
                <h1 className="text-2xl font-semibold text-center">Register</h1>
                
                <Form.Item name="first_name" label="First Name" rules={[{ required: true, message: "First name is required" }]}> 
                    <Input placeholder="Enter your first name" />
                </Form.Item>
                
                <Form.Item name="last_name" label="Last Name" rules={[{ required: true, message: "Last name is required" }]}> 
                    <Input placeholder="Enter your last name" />
                </Form.Item>
                
                <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}> 
                    <Input placeholder="Enter your email" />
                </Form.Item>
                
                <Form.Item name="password" label="Password" rules={[{ required: true, message: "Password is required" }]}> 
                    <Input.Password placeholder="Enter your password" />
                </Form.Item>
                
                <Form.Item name="password_confirmation" label="Confirm Password" dependencies={["password"]} rules={[
                    { required: true, message: "Please confirm your password" },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error("Passwords do not match!"));
                        },
                    }),
                ]}> 
                    <Input.Password placeholder="Confirm your password" />
                </Form.Item>
                
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="w-full" loading={mutation.isPending}>
                        {mutation.isPending ? "Registering..." : "Register"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}