import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { BookOutlined, LineChartOutlined, BarChartOutlined } from '@ant-design/icons';
import MethodsPage from './pages/MethodsPage';
import TradesPage from './pages/TradesPage';
import StatsPage from './pages/StatsPage';
import './App.css';

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%', display: 'flex', alignItems: 'center' }}>
          <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', marginRight: '50px' }}>
            📊 交易复盘系统
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['methods']}
            style={{ flex: 1, minWidth: 0 }}
          >
            <Menu.Item key="methods" icon={<BookOutlined />}>
              <Link to="/">Method 库</Link>
            </Menu.Item>
            <Menu.Item key="trades" icon={<LineChartOutlined />}>
              <Link to="/trades">交易复盘</Link>
            </Menu.Item>
            <Menu.Item key="stats" icon={<BarChartOutlined />}>
              <Link to="/stats">我的统计</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px', marginTop: 64 }}>
          <div style={{ padding: 24, minHeight: 380, background: '#fff', marginTop: 16 }}>
            <Routes>
              <Route path="/" element={<MethodsPage />} />
              <Route path="/trades" element={<TradesPage />} />
              <Route path="/stats" element={<StatsPage />} />
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          交易复盘系统 ©2024 - 本地化部署版本
        </Footer>
      </Layout>
    </Router>
  );
};

export default App;
