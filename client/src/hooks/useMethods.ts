/*
 * @Author: NanluQingshi
 * @Date: 2026-01-18 01:10:59
 * @LastEditors: NanluQingshi
 * @LastEditTime: 2026-01-18 01:14:53
 * @Description: 
 */
import { useState, useEffect } from 'react';
import { Method } from '../types';
import { methodsApi } from '../services/api';
import { message } from 'antd';

export const useMethods = () => {
  const [methods, setMethods] = useState<Method[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取交易方法列表
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

  // 初始加载交易方法
  useEffect(() => {
    fetchMethods();
  }, []);

  return {
    methods,
    loading,
    fetchMethods
  };
};