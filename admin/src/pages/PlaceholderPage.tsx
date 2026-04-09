import { Card, Space, Typography } from 'antd';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <Card style={{ borderRadius: 20 }}>
      <Space orientation="vertical" size={12}>
        <Typography.Title level={3} style={{ margin: 0 }}>{title}</Typography.Title>
        <Typography.Text type="secondary">{description}</Typography.Text>
      </Space>
    </Card>
  );
}
