import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  InputNumber, 
  message, 
  Typography,
  Divider,
  Row,
  Col,
  Tooltip
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  CopyOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Trade, Method } from '../types';
import { tradesApi, methodsApi } from '../services/api';

const { Title, Text } = Typography;
const { Option } = Select;

const TradesPage: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [methods, setMethods] = useState<Method[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    fetchTrades();
    fetchMethods();
  }, []);

  const fetchTrades = async (params = {}) => {
    setLoading(true);
    try {
      const response = await tradesApi.getTrades(params);
      setTrades(response.data.data);
    } catch (error) {
      message.error('获取交易记录失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchMethods = async () => {
    try {
      const response = await methodsApi.getMethods();
      setMethods(response.data.data);
    } catch (error) {
      message.error('获取方法库失败');
    }
  };

  const handleAdd = () => {
    setEditingTrade(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (trade: Trade) => {
    setEditingTrade(trade);
    // 根据trade.methodId查找对应的methodName
    // 注意：trade.methodId现在是string类型，与methods中的id类型一致
    const selectedMethod = methods.find(m => m.id === trade.methodId);
    form.setFieldsValue({
      ...trade,
      entryTime: dayjs(trade.entryTime),
      exitTime: dayjs(trade.exitTime),
      methodName: selectedMethod ? selectedMethod.name : trade.methodName,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条交易记录吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await tradesApi.deleteTrade(id);
          message.success('删除成功');
          fetchTrades();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleCopy = (record: Trade) => {
    // 只复制三个必填字段
    form.setFieldsValue({
      symbol: record.symbol,
      direction: record.direction,
      methodId: record.methodId,
      methodName: record.methodName,
      // 其他字段清空或保持默认值
      entryPrice: undefined,
      exitPrice: undefined,
      entryTime: undefined,
      exitTime: undefined,
      lots: undefined,
      profit: undefined,
      expectedProfit: undefined,
      result: undefined,
      notes: undefined,
      tags: [],
    });
    // 打开模态框
    setEditingTrade(null);
    setIsModalVisible(true);
    message.success('已复制交易记录');
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        entryTime: values.entryTime && values.entryTime.isValid() ? values.entryTime.format('YYYY-MM-DD HH:mm:ss') : null,
        exitTime: values.exitTime && values.exitTime.isValid() ? values.exitTime.format('YYYY-MM-DD HH:mm:ss') : null,
      };

      setConfirmLoading(true);

      if (editingTrade) {
        await tradesApi.updateTrade(editingTrade.id, formattedValues);
        message.success('更新成功');
      } else {
        await tradesApi.createTrade(formattedValues);
        message.success('创建成功');
      }
      setIsModalVisible(false);
      fetchTrades();
    } catch (error) {
      console.error('Validate Failed:', error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const columns = [
    {
      title: '交易品种',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '方向',
      dataIndex: 'direction',
      key: 'direction',
      render: (direction: string) => (
        <Tag color={direction === 'long' ? 'blue' : 'volcano'}>
          {direction === 'long' ? '做多' : '做空'}
        </Tag>
      ),
    },
    {
      title: '入场/出场价格',
      key: 'prices',
      render: (_: any, record: Trade) => (
        <Space orientation="vertical" size={0}>
          <Text type="secondary" style={{ fontSize: '12px' }}>入: {record.entryPrice !== null ? record.entryPrice : '-'}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>出: {record.exitPrice !== null ? record.exitPrice : '-'}</Text>
        </Space>
      ),
    },
    {
      title: '交易时间',
      key: 'times',
      render: (_: any, record: Trade) => (
        <Space orientation="vertical" size={0}>
          <Text type="secondary" style={{ fontSize: '12px' }}>入: {record.entryTime ? dayjs(record.entryTime).format('YYYY-MM-DD HH:mm') : '-'}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>出: {record.exitTime ? dayjs(record.exitTime).format('YYYY-MM-DD HH:mm') : '-'}</Text>
        </Space>
      ),
    },
    {
      title: '实际盈亏',
      dataIndex: 'profit',
      key: 'profit',
      sorter: (a: Trade, b: Trade) => (a.profit || 0) - (b.profit || 0),
      render: (profit: number | null) => (
        profit !== null ? (
          <Text strong style={{ color: profit > 0 ? '#52c41a' : profit < 0 ? '#f5222d' : '#8c8c8c' }}>
            {profit > 0 ? `+${profit}` : profit}
          </Text>
        ) : (
          '-'  
        )
      ),
    },
    {
      title: '预期盈亏',
      dataIndex: 'expectedProfit',
      key: 'expectedProfit',
      sorter: (a: Trade, b: Trade) => (a.expectedProfit || 0) - (b.expectedProfit || 0),
      render: (expectedProfit: number | undefined) => (
        expectedProfit !== undefined ? (
          <Text style={{ color: expectedProfit > 0 ? '#52c41a' : expectedProfit < 0 ? '#f5222d' : '#8c8c8c' }}>
            {expectedProfit > 0 ? `+${expectedProfit}` : expectedProfit}
          </Text>
        ) : (
          '-'
        )
      ),
    },
    {
      title: '交易方法',
      dataIndex: 'methodName',
      key: 'methodName',
      render: (name: string) => <Tag color="geekblue">{name}</Tag>,
    },
    {
      title: '结果',
      dataIndex: 'result',
      key: 'result',
      filters: [
        { text: '盈利', value: 'win' },
        { text: '亏损', value: 'loss' },
        { text: '保本', value: 'breakeven' },
      ],
      onFilter: (value: any, record: Trade) => record.result === value,
      render: (result: string | null) => {
        if (!result) {
          return '-';
        }
        let color = 'default';
        let text = '保本';
        if (result === 'win') { color = 'success'; text = '盈利'; }
        if (result === 'loss') { color = 'error'; text = '亏损'; }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Trade) => (
        <Space size="middle">
          <Tooltip title="编辑">
            <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title="复制">
            <Button type="text" icon={<CopyOutlined />} onClick={() => handleCopy(record)} />
          </Tooltip>
          <Tooltip title="删除">
            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="trades-page">
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>交易复盘</Title>
          <Text type="secondary">记录并分析您的每一笔交易，不断优化交易系统</Text>
        </Col>
        <Col>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">
              新增交易
            </Button>
          </Space>
        </Col>
      </Row>

      <Card variant="borderless" style={{ marginBottom: 24, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}>
        <Form layout="inline" onFinish={(values) => fetchTrades(values)}>
          <Form.Item name="symbol">
            <Input placeholder="搜索品种" prefix={<SearchOutlined />} allowClear />
          </Form.Item>
          <Form.Item name="methodId">
            <Select placeholder="选择方法" style={{ width: 220 }} allowClear showSearch filterOption={(input, option) => {
              const optionLabel = typeof option?.children === 'string' ? option.children : '';
              return optionLabel.toLowerCase().includes(input.toLowerCase());
            }}>
              {methods.map(m => <Option key={m.id} value={m.id}>{m.name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="result">
            <Select placeholder="交易结果" style={{ width: 120 }} allowClear>
              <Option value="win">盈利</Option>
              <Option value="loss">亏损</Option>
              <Option value="breakeven">保本</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">筛选</Button>
          </Form.Item>
        </Form>
      </Card>

      <Table 
        columns={columns} 
        dataSource={trades} 
        rowKey="id" 
        loading={loading}
        pagination={{ 
          pageSize: 10,
          showTotal: (total) => `共 ${total} 条记录`,
          showSizeChanger: true,
          showQuickJumper: true
        }}
        expandable={{
          expandedRowRender: record => (
            <div style={{ padding: '8px 24px' }}>
              <Divider plain style={{ textAlign: 'left' }}><Text type="secondary">交易笔记</Text></Divider>
              <p>{record.notes || '暂无笔记'}</p>
              <Divider plain style={{ textAlign: 'left' }}><Text type="secondary">标签</Text></Divider>
              <Space wrap>
                {record.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
              </Space>
            </div>
          ),
        }}
      />

      <Modal
        title={editingTrade ? '编辑交易记录' : '新增交易记录'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        okText="保存"
        cancelText="取消"
        styles={{ body: { maxHeight: '70vh', overflowY: 'auto', overflowX: 'hidden' } }}
        confirmLoading={confirmLoading}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="symbol" label="交易品种" rules={[{ required: true }]}>
                <Input placeholder="例如: EUR/USD" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="direction" label="交易方向" rules={[{ required: true }]}>
                <Select>
                  <Option value="long">做多</Option>
                  <Option value="short">做空</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="entryPrice" label="入场价格">
                <InputNumber style={{ width: '100%' }} step={0.0001} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="exitPrice" label="出场价格">
                <InputNumber style={{ width: '100%' }} step={0.0001} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="entryTime" label="入场时间">
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="exitTime" label="出场时间">
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="lots" label="手数">
                <InputNumber style={{ width: '100%' }} step={0.01} min={0.01} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="profit" label="实际盈亏">
                <InputNumber style={{ width: '100%' }} step={10} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="expectedProfit" label="预期盈亏">
                <InputNumber style={{ width: '100%' }} step={10} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="result" label="交易结果">
                <Select>
                  <Option value="win">盈利</Option>
                  <Option value="loss">亏损</Option>
                  <Option value="breakeven">保本</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="methodId" label="交易方法" rules={[{ required: true }]}>
            <Select
              showSearch
              filterOption={(input, option) => {
                const optionLabel = typeof option?.children === 'string' ? option.children : '';
                return optionLabel.toLowerCase().includes(input.toLowerCase());
              }}
              onChange={(value) => {
                // 根据选择的methodId查找对应的methodName
                // value是string类型，因为methods中的id是string类型
                const selectedMethod = methods.find(m => m.id === value);
                if (selectedMethod) {
                  form.setFieldsValue({ methodName: selectedMethod.name });
                }
              }}
            >
              {methods.map(m => <Option key={m.id} value={m.id}>{m.name}</Option>)}
            </Select>
          </Form.Item>
          {/* 隐藏的methodName字段，用于存储交易方法名称 */}
          <Form.Item name="methodName" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="notes" label="交易笔记">
            <Input.TextArea rows={4} placeholder="记录您的入场逻辑、心理状态等..." />
          </Form.Item>
          <Form.Item name="tags" label="标签 (逗号分隔)">
            <Select mode="tags" style={{ width: '100%' }} placeholder="输入标签并回车" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TradesPage;