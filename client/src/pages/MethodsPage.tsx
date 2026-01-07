import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Input, message, Row, Col, Tag, Popconfirm, Statistic } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Method } from '../types';
import { methodsApi } from '../services/api';
const { TextArea } = Input;

const MethodsPage: React.FC = () => {
  const [methods, setMethods] = useState<Method[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMethod, setEditingMethod] = useState<Method | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    setLoading(true);
    try {
      const response = await methodsApi.getAll();
      setMethods(response.data.data);
    } catch (error) {
      message.error('获取方法列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingMethod(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (method: Method) => {
    setEditingMethod(method);
    form.setFieldsValue(method);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await methodsApi.delete(id);
      message.success('删除成功');
      fetchMethods();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingMethod) {
        await methodsApi.update(editingMethod.id, values);
        message.success('更新成功');
      } else {
        await methodsApi.create(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchMethods();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 0.7) return '#52c41a'; // 绿色
    if (winRate >= 0.5) return '#faad14'; // 橙色
    return '#f5222d'; // 红色
  };

  const getPnlColor = (pnl: number) => {
    if (pnl > 0) return '#52c41a'; // 绿色
    if (pnl < 0) return '#f5222d'; // 红色
    return '#8c8c8c'; // 灰色
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>交易方法库</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加新方法
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {methods.map((method) => (
          <Col xs={24} sm={12} lg={8} key={method.id}>
            <Card
              className="method-card"
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{method.name}</div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: 4 }}>代码: {method.code}</div>
                  </div>
                  {method.is_default && <Tag color="blue">默认</Tag>}
                </div>
              }
              extra={
                <div>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(method)}
                  />
                  <Popconfirm
                    title="确定要删除这个方法吗？"
                    onConfirm={() => handleDelete(method.id)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button type="text" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </div>
              }
            >
              <p style={{ color: '#8c8c8c', minHeight: 40, marginBottom: 16 }}>{method.description}</p>
              
              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={12}>
                  <Statistic
                    title="胜率"
                    value={(method.win_rate ?? 0) * 100}
                    precision={2}
                    suffix="%"
                    valueStyle={{ color: getWinRateColor(method.win_rate ?? 0) }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="总盈亏"
                    value={method.total_pnl ?? 0}
                    precision={2}
                    valueStyle={{ color: getPnlColor(method.total_pnl ?? 0) }}
                  />
                </Col>
              </Row>

              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={24}>
                  <Statistic
                    title="使用次数"
                    value={method.usage_count}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={editingMethod ? '编辑方法' : '添加新方法'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="code"
            label="方法代码"
            rules={[{ required: true, message: '请输入方法代码' }]}
          >
            <Input placeholder="例如：1CBO" />
          </Form.Item>

          <Form.Item
            name="name"
            label="方法名称"
            rules={[{ required: true, message: '请输入方法名称' }]}
          >
            <Input placeholder="例如：First Channel Breakout" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <TextArea
              rows={3}
              placeholder="详细描述这个交易方法"
            />
          </Form.Item>

          <Form.Item
            name="is_default"
            label="是否为默认方法"
            valuePropName="checked"
          >
            <input type="checkbox" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MethodsPage;
