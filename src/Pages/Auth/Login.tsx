import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AppContext } from "../../Context/AppContext";
import { loginUser } from "../../Api/auth";
import { Form, Input, Button, message } from "antd";

export default function Login() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("AppContext is not provided!");
    }
    const { setToken } = context;
    const navigate = useNavigate();
    const [form] = Form.useForm();

    // React Query mutation
    const mutation = useMutation({
        mutationFn: async (values: { email: string; password: string }) => {
            return await loginUser(values.email, values.password);
        },
        onSuccess: (data) => {
            localStorage.setItem("token", data.token);
            setToken(data.token);
            message.success("Login successful!");
            navigate("/");
        },
        onError: (error: any) => {
            message.error(error.message || "Login failed. Please try again.");
        },
    });

    const handleLogin = (values: { email: string; password: string }) => {
        mutation.mutate(values);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 shadow-lg rounded-lg w-96">
                <h1 className="text-2xl font-semibold text-center mb-4">Login</h1>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleLogin}
                >
                    {/* Email */}
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Please enter your email!" }]}
                    >
                        <Input placeholder="Enter your email" />
                    </Form.Item>

                    {/* Password */}
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Please enter your password!" }]}
                    >
                        <Input.Password placeholder="Enter your password" />
                    </Form.Item>

                    {/* Submit Button */}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={mutation.isPending}>
                            {mutation.isPending ? "Logging in..." : "Login"}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}