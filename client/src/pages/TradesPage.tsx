import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, InputNumber, DatePicker, message, Tag, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Trade, Method } from '../types';
import { tradesApi, methodsApi } from '../services/api';
const { TextArea } = Input;
const { Option } = Select;

const TradesPage: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [methods, setMethods] = useState<Method[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTrades();
    fetchMethods();
  }, []);

  const fetchTrades = async () => {
    setLoading(true);
    try {
      const response = await tradesApi.getAll();
      setTrades(response.data.data);
    } catch (error) {
      message.error('获取交易记录失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchMethods = async () => {
    try {
      const response = await methodsApi.getAll();
      setMethods(response.data.data);
    } catch (error) {
      message.error('获取方法列表失败');
    }
  };

  const handleAdd = () => {
    setEditingTrade(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (trade: Trade) => {
    setEditingTrade(trade);
    form.setFieldsValue({
      ...trade,
      entryTime: dayjs(trade.entryTime),
      exitTime: dayjs(trade.exitTime),
      tags: trade.tags.join(','),
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await tradesApi.delete(id);
      message.success('删除成功');
      fetchTrades();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const method = methods.find(m => m.id === values.methodId);
      
      const tradeData = {
        ...values,
        entryTime: values.entryTime.format('YYYY-MM-DD HH:mm:ss'),
        exitTime: values.exitTime.format('YYYY-MM-DD HH:mm:ss'),
        methodName: method?.name || '',
        tags: values.tags ? values.tags.split(',').map((t: string) => t.trim()) : [],
      };

      if (editingTrade) {
        await tradesApi.update(editingTrade.id, tradeData);
        message.success('更新成功');
      } else {
        await tradesApi.create(tradeData);
        message.success('创建成功---');
      }
      setModalVisible(false);
      fetchTrades();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const columns = [
    {
      title: '货币对',
      dataIndex: 'symbol',
      key: 'symbol',
      width: 100,
    },
    {
      title: '方向',
      dataIndex: 'direction',
      key: 'direction',
      width: 80,
      render: (direction: string) => (
        <Tag color={direction === 'long' ? 'green' : 'red'}>
          {direction === 'long' ? '做多' : '做空'}
        </Tag>
      ),
    },
    {
      title: '入场价',
      dataIndex: 'entryPrice',
      key: 'entryPrice',
      width: 100,
    },
    {
      title: '出场价',
      dataIndex: 'exitPrice',
      key: 'exitPrice',
      width: 100,
    },
    {
      title: '盈亏',
      dataIndex: 'profit',
      key: 'profit',
      width: 100,
      render: (profit: number) => (
        <span className={profit > 0 ? 'profit-positive' : profit < 0 ? 'profit-negative' : 'profit-neutral'}>
          {profit > 0 ? '+' : ''}{profit}
        </span>
      ),
    },
    {
      title: '结果',
      dataIndex: 'result',
      key: 'result',
      width: 80,
      render: (result: string) => {
        const colors = { win: 'success', loss: 'error', breakeven: 'default' };
        const labels = { win: '盈利', loss: '亏损', breakeven: '保本' };
        return <Tag color={colors[result as keyof typeof colors]}>{labels[result as keyof typeof labels]}</Tag>;
      },
    },
    {
      title: '使用方法',
      dataIndex: 'methodName',
      key: 'methodName',
      width: 120,
    },
    {
      title: '入场时间',
      dataIndex: 'entryTime',
      key: 'entryTime',
      width: 160,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 150,
      render: (tags: string[]) => (
        <>
          {tags.map(tag => (
            <Tag key={tag} className="trade-tag">{tag}</Tag>
          ))}
        </>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: Trade) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这条记录吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>交易复盘</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加交易记录
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={trades}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1300 }}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingTrade ? '编辑交易记录' : '添加交易记录'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="symbol"
            label="货币对"
            rules={[{ required: true, message: '请输入货币对' }]}
          >
            <Input placeholder="例如：EUR/USD" />
          </Form.Item>

          <Form.Item
            name="direction"
            label="交易方向"
            rules={[{ required: true, message: '请选择交易方向' }]}
          >
            <Select placeholder="选择方向">
              <Option value="long">做多</Option>
              <Option value="short">做空</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="entryPrice"
            label="入场价格"
            rules={[{ required: true, message: '请输入入场价格' }]}
          >
            <InputNumber style={{ width: '100%' }} step={0.0001} />
          </Form.Item>

          <Form.Item
            name="exitPrice"
            label="出场价格"
            rules={[{ required: true, message: '请输入出场价格' }]}
          >
            <InputNumber style={{ width: '100%' }} step={0.0001} />
          </Form.Item>

          <Form.Item
            name="lots"
            label="手数"
            rules={[{ required: true, message: '请输入手数' }]}
          >
            <InputNumber style={{ width: '100%' }} step={0.01} min={0.01} />
          </Form.Item>

          <Form.Item
            name="entryTime"
            label="入场时间"
            rules={[{ required: true, message: '请选择入场时间' }]}
          >
            <DatePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>

          <Form.Item
            name="exitTime"
            label="出场时间"
            rules={[{ required: true, message: '请选择出场时间' }]}
          >
            <DatePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>

          <Form.Item
            name="methodId"
            label="使用方法"
            rules={[{ required: true, message: '请选择使用的方法' }]}
          >
            <Select placeholder="选择方法">
              {methods.map(method => (
                <Option key={method.id} value={method.id}>{method.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="result"
            label="交易结果"
            rules={[{ required: true, message: '请选择交易结果' }]}
          >
            <Select placeholder="选择结果">
              <Option value="win">盈利</Option>
              <Option value="loss">亏损</Option>
              <Option value="breakeven">保本</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="riskRewardRatio"
            label="风险回报比"
            rules={[{ required: true, message: '请输入风险回报比' }]}
          >
            <InputNumber style={{ width: '100%' }} step={0.1} min={0} />
          </Form.Item>

          <Form.Item
            name="tags"
            label="标签"
          >
            <Input placeholder="多个标签用逗号分隔，例如：趋势,突破" />
          </Form.Item>

          <Form.Item
            name="notes"
            label="交易笔记"
          >
            <TextArea rows={4} placeholder="记录交易心得和反思" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TradesPage;
