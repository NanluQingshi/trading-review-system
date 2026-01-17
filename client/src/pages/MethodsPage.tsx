import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Row, 
  Col, 
  Typography, 
  Modal, 
  Form, 
  Input, 
  message, 
  Space, 
  Tag, 
  Statistic,
  Empty,
  Tooltip,
  Popconfirm,
  Spin,
  FloatButton
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  BookOutlined,
  ThunderboltOutlined,
  PercentageOutlined
} from '@ant-design/icons';
import { methodsApi } from '../services/api';
import { Method } from '../types';

const { Title, Text, Paragraph } = Typography;

const MethodsPage: React.FC = () => {
  const [methods, setMethods] = useState<Method[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMethod, setEditingMethod] = useState<Method | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    setLoading(true);
    try {
      const response = await methodsApi.getMethods();
      setMethods(response.data.data);
    } catch (error) {
      message.error('获取方法库失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingMethod(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (method: Method) => {
    setEditingMethod(method);
    form.setFieldsValue(method);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await methodsApi.deleteMethod(id);
      message.success('删除成功');
      fetchMethods();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingMethod) {
        await methodsApi.updateMethod(editingMethod.id, values);
        message.success('更新成功');
      } else {
        await methodsApi.createMethod(values);
        message.success('创建成功');
      }
      setIsModalVisible(false);
      fetchMethods();
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  return (
    <div className="methods-page">
      <Row justify="space-between" align="middle" style={{ marginBottom: 32 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>Method 库</Title>
          <Text type="secondary">定义并管理您的交易系统，追踪每种策略的实战表现</Text>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">
            新增方法
          </Button>
        </Col>
      </Row>

      <Spin spinning={loading} tip="加载方法库中...">
        <div style={{ minHeight: '400px' }}>
          {methods.length === 0 && !loading ? (
            <Empty description="暂无交易方法，点击右上角新增" style={{ marginTop: 100 }} />
          ) : (
            <Row gutter={[24, 24]}>
              {methods.map((method) => (
                <Col xs={24} sm={12} lg={8} key={method.id}>
                  <Card 
                    hoverable
                    actions={[
                      <Tooltip title="编辑"><EditOutlined key="edit" onClick={() => handleEdit(method)} /></Tooltip>,
                      <Popconfirm title="确定删除吗？" onConfirm={() => handleDelete(method.id)}>
                        <Tooltip title="删除"><DeleteOutlined key="delete" style={{ color: '#ff4d4f' }} /></Tooltip>
                      </Popconfirm>
                    ]}
                    style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                    styles={{ body: { flex: 1 } }}
                  >
                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Space direction="vertical" size={0}>
                        <Tag color="blue" style={{ marginBottom: 8 }}>{method.code}</Tag>
                        <Title level={4} style={{ margin: 0 }}>{method.name}</Title>
                      </Space>
                      <BookOutlined style={{ fontSize: 24, color: '#bfbfbf' }} />
                    </div>
                    
                    <Paragraph ellipsis={{ rows: 3 }} type="secondary" style={{ height: 66 }}>
                      {method.description || '暂无描述'}
                    </Paragraph>

                    <div style={{ 
                      background: '#fafafa', 
                      padding: '12px', 
                      borderRadius: '8px',
                      marginTop: 'auto'
                    }}>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Statistic 
                            title="使用次数" 
                            value={method.usage_count} 
                            styles={{ content: { fontSize: 18 } }}
                            prefix={<ThunderboltOutlined style={{ fontSize: 14 }} />}
                          />
                        </Col>
                        <Col span={12}>
                          <Statistic 
                            title="胜率" 
                            value={method.win_rate * 100} 
                            precision={1}
                            suffix="%"
                            styles={{ content: { fontSize: 18, color: method.win_rate >= 0.5 ? '#52c41a' : '#faad14' } }}
                            prefix={<PercentageOutlined style={{ fontSize: 14 }} />}
                          />
                        </Col>
                      </Row>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Spin>

      <Modal
        title={editingMethod ? '编辑交易方法' : '新增交易方法'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        okText="保存"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
          <Form.Item 
            name="code" 
            label="方法代码" 
            rules={[{ required: true, message: '请输入方法代码' }]}
            tooltip="简短的标识符，如: BO, MTR"
          >
            <Input placeholder="例如: BO" />
          </Form.Item>
          <Form.Item 
            name="name" 
            label="方法名称" 
            rules={[{ required: true, message: '请输入方法名称' }]}
          >
            <Input placeholder="例如: 突破交易法" />
          </Form.Item>
          <Form.Item name="description" label="详细描述">
            <Input.TextArea rows={4} placeholder="描述该方法的入场条件、止损逻辑、止盈目标等..." />
          </Form.Item>
        </Form>
      </Modal>

      <FloatButton.BackTop visibilityHeight={200} />
    </div>
  );
};

export default MethodsPage;