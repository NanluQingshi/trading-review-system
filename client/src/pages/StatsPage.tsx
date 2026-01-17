import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, message, Spin, Empty } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, TrophyOutlined, DollarOutlined } from '@ant-design/icons';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Stats } from '../types';
import { statsApi } from '../services/api';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const StatsPage: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await statsApi.getStats();
      setStats(response.data.data);
    } catch (error) {
      message.error('获取统计数据失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" tip="加载统计数据中..." />
      </div>
    );
  }

  if (!stats) {
    return <Empty description="暂无统计数据" />;
  }

  const { overview, symbolStats, methodStats, profitCurve } = stats;

  // 准备胜负分布数据
  const resultDistribution = [
    { name: '盈利', value: overview.winTrades },
    { name: '亏损', value: overview.lossTrades },
    { name: '保本', value: overview.breakevenTrades },
  ];

  // 货币对表格列
  const symbolColumns = [
    {
      title: '货币对',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: '交易次数',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: '盈利次数',
      dataIndex: 'wins',
      key: 'wins',
    },
    {
      title: '胜率',
      dataIndex: 'winRate',
      key: 'winRate',
      render: (rate: string) => `${rate}%`,
    },
    {
      title: '总盈亏',
      dataIndex: 'profit',
      key: 'profit',
      render: (profit: number) => (
        <span className={profit > 0 ? 'profit-positive' : profit < 0 ? 'profit-negative' : 'profit-neutral'}>
          {profit > 0 ? '+' : ''}{profit}
        </span>
      ),
    },
    {
      title: '总预期盈亏',
      dataIndex: 'expectedProfit',
      key: 'expectedProfit',
      render: (expectedProfit: number) => (
        <span className={expectedProfit > 0 ? 'profit-positive' : expectedProfit < 0 ? 'profit-negative' : 'profit-neutral'}>
          {expectedProfit > 0 ? '+' : ''}{expectedProfit}
        </span>
      ),
    },
  ];

  // 方法表格列
  const methodColumns = [
    {
      title: '方法名称',
      dataIndex: 'methodName',
      key: 'methodName',
    },
    {
      title: '使用次数',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: '盈利次数',
      dataIndex: 'wins',
      key: 'wins',
    },
    {
      title: '胜率',
      dataIndex: 'winRate',
      key: 'winRate',
      render: (rate: string) => `${rate}%`,
    },
    {
      title: '总盈亏',
      dataIndex: 'profit',
      key: 'profit',
      render: (profit: number) => (
        <span className={profit > 0 ? 'profit-positive' : profit < 0 ? 'profit-negative' : 'profit-neutral'}>
          {profit > 0 ? '+' : ''}{profit}
        </span>
      ),
    },
    {
      title: '总预期盈亏',
      dataIndex: 'expectedProfit',
      key: 'expectedProfit',
      render: (expectedProfit: number) => (
        <span className={expectedProfit > 0 ? 'profit-positive' : expectedProfit < 0 ? 'profit-negative' : 'profit-neutral'}>
          {expectedProfit > 0 ? '+' : ''}{expectedProfit}
        </span>
      ),
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>我的统计</h1>

      {/* 核心指标卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总交易次数"
              value={overview.totalTrades}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="胜率"
              value={overview.winRate}
              precision={2}
              suffix="%"
              styles={{ content: { color: overview.winRate >= 50 ? '#3f8600' : '#cf1322' } }}
              prefix={overview.winRate >= 50 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总盈亏"
              value={overview.totalProfit}
              precision={2}
              styles={{ content: { color: overview.totalProfit >= 0 ? '#3f8600' : '#cf1322' } }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="盈亏因子"
              value={overview.profitFactor}
              precision={2}
              styles={{ content: { color: overview.profitFactor >= 1 ? '#3f8600' : '#cf1322' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总预期盈亏"
              value={overview.totalExpectedProfit}
              precision={2}
              styles={{ content: { color: overview.totalExpectedProfit >= 0 ? '#3f8600' : '#cf1322' } }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="平均预期盈亏"
              value={overview.avgExpectedProfit}
              precision={2}
              styles={{ content: { color: overview.avgExpectedProfit >= 0 ? '#3f8600' : '#cf1322' } }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 详细统计 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="盈利交易"
              value={overview.winTrades}
              styles={{ content: { color: '#3f8600' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="亏损交易"
              value={overview.lossTrades}
              styles={{ content: { color: '#cf1322' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="平均盈利"
              value={overview.avgWin}
              precision={2}
              styles={{ content: { color: '#3f8600' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="平均亏损"
              value={overview.avgLoss}
              precision={2}
              styles={{ content: { color: '#cf1322' } }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {/* 盈亏曲线 */}
        <Col xs={24}>
          <Card title="累计盈亏曲线">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={profitCurve}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cumulative" stroke="#8884d8" name="累计盈亏" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* 货币对统计 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24}>
          <Card title="货币对统计">
            <Table
              columns={symbolColumns}
              dataSource={symbolStats}
              rowKey="symbol"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* 方法统计 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24}>
          <Card title="方法统计">
            <Table
              columns={methodColumns}
              dataSource={methodStats}
              rowKey="methodId"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* 方法盈亏对比 */}
      <Row gutter={16}>
        <Col xs={24}>
          <Card title="各方法盈亏对比">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={methodStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="methodName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="profit" fill="#8884d8" name="总盈亏" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatsPage;