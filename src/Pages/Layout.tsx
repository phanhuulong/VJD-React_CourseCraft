import { Link, Outlet, useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import { useContext, FormEvent, use } from "react";
import React from "react";
import { Layout, Menu, Button, Typography } from "antd";
import { LogoutOutlined, PlusOutlined, UserOutlined, HomeOutlined, LoginOutlined, AppstoreOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;
const { Text } = Typography;

export default function LayoutComponent() {
    const appContext = useContext(AppContext);
    if (!appContext) {
        throw new Error("AppContext must be used within a provider");
    }

    const { user, token, setUser, setToken } = appContext;
    const navigate = useNavigate();

    async function handleLogout(e: FormEvent) {
        e.preventDefault();
        try {
            const res = await fetch('/api/logout', {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to log out");
            }

            setUser(null);
            setToken(null);
            localStorage.removeItem("token");
            navigate('/');
        } catch (error) {
            console.error("Logout error:", error);
        }
    }

    return (
        <Layout>
            {/* Header */}
            <Header className="bg-white shadow-md flex items-center justify-between px-6 fixed w-full z-10 top-0">
                {/* Logo / Home */}
                <Link to="/" className="text-lg font-semibold flex items-center space-x-2">
                    <HomeOutlined className="text-blue-500" />
                    <span>Home</span>
                </Link>

                {/* Navigation Menu */}
                <Menu mode="horizontal" className="flex flex-1 justify-center border-none bg-transparent">
                    {user ? (
                        <>
                            {/* Logout Button */}
                            {user?.role === "teacher" && (
                                <>
                                    <Menu.Item key="new-course" icon={<PlusOutlined />}>
                                        <Link to="/course/create">New Course</Link>
                                    </Menu.Item>
                                    <Menu.Item key="my-courses" icon={<AppstoreOutlined />}>
                                        <Link to="/my-courses">My Courses</Link>
                                    </Menu.Item>
                                </>
                            )}

                            {/* Logout Button */}
                            <Menu.Item key="logout">
                                <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>
                                    Logout
                                </Button>
                            </Menu.Item>
                        </>
                    ) : (
                        <>
                            <Menu.Item key="register" icon={<UserOutlined />}>
                                <Link to="/register">Register</Link>
                            </Menu.Item>
                            <Menu.Item key="login" icon={<LoginOutlined />}>
                                <Link to="/login">Login</Link>
                            </Menu.Item>
                        </>
                    )}
                </Menu>
                <Content className="p-6 mt-16">
                    <Outlet />
                </Content>
            </Header>
        </Layout>

    );
}
