import { useQuery } from "@tanstack/react-query";
import { getAllCourse, getCoursesExceptOwn, type Course } from "../Api/course";
import React, { useContext } from "react";
import { Card, Typography, Spin, Row, Col } from "antd";
const { Title, Text } = Typography;
import { BASE_URL } from "../config/config";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
export default function Home() {
    const { token, user } = useContext(AppContext) ?? { token: null, user: null };

    const navigate = useNavigate();

    const { data: courses, isLoading, isError, error } = useQuery<Course[]>({
        queryKey: ["courses", token],
        queryFn: token ? getCoursesExceptOwn : getAllCourse,
    });

    return (
        <div className="container mx-auto p-6 mt-6">

            {/* Loading State */}
            {isLoading && (
                <div className="flex justify-center items-center h-40">
                    <Spin size="large" />
                </div>
            )}

            {/* Error Handling */}
            {isError && <Text type="danger">{(error as Error).message}</Text>}

            {/* Courses Grid */}
            <Row gutter={[16, 16]}>
                {courses?.map((course) => (
                    <Col key={course.course_id} xs={24} sm={12} md={8} lg={6}>
                        <Card onClick={() => navigate(`/course/${course.course_id}`)}
                            hoverable
                            cover={
                                <img
                                    src={`${BASE_URL}${course.thumbnail_course}`}
                                    alt={course.title}
                                    className="h-40 object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/default_image.png";
                                    }}
                                />
                            }
                        >
                            <Title level={4}>{course.title}</Title>
                            <Text type="secondary">{course.description}</Text>
                            <div className="mt-2">
                                <Text strong className="text-green-500">
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
