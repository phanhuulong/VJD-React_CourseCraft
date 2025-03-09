import React, { useContext } from "react";
import { getCoursesByTeacher, Course, deleteCourse } from "../Api/course";
import { AppContext } from "../Context/AppContext";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, Button, Typography, Spin, Row, Col, Modal } from "antd";
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { BASE_URL } from "../config/config";

const { Title, Text } = Typography;
const { confirm } = Modal;

export default function CourseOfMe() {
    const { token, user } = useContext(AppContext) ?? { token: null, user: null };
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: courses, isLoading, isError, error } = useQuery<Course[]>({
        queryKey: ["courses", user?.id],
        queryFn: () => getCoursesByTeacher(user?.id!),
        enabled: !!user?.id,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteCourse(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses", user?.id] });
        },
    });

    const handleDelete = (id: number) => {
        if (!token) return;

        confirm({
            title: "Are you sure?",
            icon: <ExclamationCircleOutlined />,
            content: "This action cannot be undone.",
            okText: "Yes, Delete",
            okType: "danger",
            cancelText: "Cancel",
            onOk: () => deleteMutation.mutate(id),
        });
    };

    return (
        <div className="container mx-auto p-6">
            <Title level={2} className="mb-6 text-center">
                My Courses
            </Title>

            {isLoading && (
                <div className="flex justify-center items-center h-40">
                    <Spin size="large" />
                </div>
            )}

            {isError && <Text type="danger">{(error as Error).message}</Text>}

            {!isLoading && !isError && courses?.length === 0 && (
                <div className="flex justify-center items-center h-40">
                    <Text>No courses found for this teacher.</Text>
                </div>
            )}

            <Row gutter={[16, 16]}>
                {courses?.map((course) => (
                    <Col key={course.id} xs={24} sm={12} md={8} lg={6}>
                        <Card 
                            hoverable
                            className="rounded-lg shadow-lg transition duration-300 hover:shadow-xl"
                            cover={
                                <img onClick={() => navigate(`/course/${course.id}`)}
                                    src={`${BASE_URL}${course.thumbnail_course}`}
                                    alt={course.title}
                                    className="h-48 object-cover rounded-t-lg"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/default_image.png";
                                    }}
                                />
                            }
                            actions={[
                                <Button
                                    type="primary"
                                    icon={<EditOutlined />}
                                    onClick={() => navigate(`/update-course/${course.id}`)}
                                    className="w-full"
                                >
                                    Update
                                </Button>,
                                <Button
                                    danger
                                    icon={<DeleteOutlined />}
                                    loading={deleteMutation.isPending}
                                    onClick={() => handleDelete(course.id!)}
                                    className="w-full"
                                >
                                    Delete
                                </Button>,
                            ]}
                        >
                            <Title level={4} className="text-center">{course.title}</Title>
                            <div className="flex justify-center">
                                <Text strong className="text-lg px-4 py-1 bg-gray-200 rounded-full">
                                    ${course.price}
                                </Text>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}
