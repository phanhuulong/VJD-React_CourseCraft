import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Descriptions, Spin, Alert, Card, Typography } from 'antd';
import { getCourseById } from '../Api/course';
import { useParams } from 'react-router-dom';

const { Title } = Typography;

const DetailCourse: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const courseId = Number(id);

    const { data, error, isLoading } = useQuery({
        queryKey: ['course', courseId],
        queryFn: () => getCourseById(courseId),
        enabled: !!courseId,
    });

    if (isLoading) return <Spin size="large" />;
    if (error) return <Alert message="Error" description={String(error)} type="error" showIcon />;

    return (
        <Card style={{ maxWidth: 800, margin: '20px auto', padding: 20 }}>
            <Title level={2}>{data?.title}</Title>
            <Descriptions title="Course Details" bordered column={1}>
                <Descriptions.Item label="Description">{data?.description}</Descriptions.Item>
                <Descriptions.Item label="Category">{data?.category_id}</Descriptions.Item>
                <Descriptions.Item label="Price">${data?.price}</Descriptions.Item>
                <Descriptions.Item label="Instructor ID">{data?.teacher_id}</Descriptions.Item>
                <Descriptions.Item label="Video URL">
                    <a href={data?.url_video} target="_blank" rel="noopener noreferrer">
                        Watch Video
                    </a>
                </Descriptions.Item>
            </Descriptions>
        </Card>
    );
};

export default DetailCourse;