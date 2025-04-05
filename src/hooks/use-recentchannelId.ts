import { useEffect, useState, useCallback } from 'react';
import { IndexedDBService } from '../lib/indexedDB';

// 数据库配置
const DB_NAME = 'chatAppDatabase';
const STORE_NAME = 'recentChats';

// 初始化 IndexedDB 服务
const dbService = new IndexedDBService({
  dbName: DB_NAME,
  version: 1,
  stores: [
    {
      name: STORE_NAME,
      keyPath: 'appId',
      indexes: [
        { name: 'appId', keyPath: 'appId', options: { unique: true } }
      ]
    }
  ]
});

// 数据类型定义
interface RecentChat {
  appId: string;
  channelId: string;
  timestamp: number;
}

/**
 * 获取指定appId最近访问的channelId
 * @param appId 应用ID
 * @returns 最近访问的channelId，如果没有找到则返回null
 */
export async function fetchRecentchannelId(appId: string): Promise<string | null> {
  try {
    // 确保数据库打开
    await dbService.open();
    // 获取appId对应的记录
    const record = await dbService.get<RecentChat>(STORE_NAME, appId);

    return record ? record.channelId : null;
  } catch (err) {
    console.error('Failed to fetch recent channelId:', err);
    throw err;
  }
}

/**
 * React hook用于管理每个app最近访问的channelId
 * @param appId 应用ID
 * @returns 包含channelId和相关操作方法的对象
 */
export function useRecentchannelId(appId: string) {
  const [channelId, setchannelId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 加载最近的channelId
  useEffect(() => {
    let isMounted = true;

    const loadRecentchannelId = async () => {
      try {
        setLoading(true);
        const recentchannelId = await fetchRecentchannelId(appId);

        if (isMounted) {
          setchannelId(recentchannelId);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to load recent channelId in hook:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setchannelId(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadRecentchannelId();

    return () => {
      isMounted = false;
    };
  }, [appId]);

  // 设置/更新最近的channelId
  const setRecentchannelId = useCallback(async (newchannelId: string) => {
    if (!newchannelId) return;

    try {
      // 确保数据库打开
      await dbService.open();

      // 更新记录
      await dbService.put<RecentChat>(STORE_NAME, {
        appId,
        channelId: newchannelId,
        timestamp: Date.now()
      });

      setchannelId(newchannelId);
      setError(null);
    } catch (err) {
      console.error('Failed to update recent channelId:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [appId]);

  // 清除最近的channelId
  const clearRecentchannelId = useCallback(async () => {
    try {
      // 确保数据库打开
      await dbService.open();

      // 删除记录
      await dbService.delete(STORE_NAME, appId);

      setchannelId(null);
      setError(null);
    } catch (err) {
      console.error('Failed to clear recent channelId:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [appId]);

  // 提供全局清空所有记录的方法
  const clearAllRecentChats = useCallback(async () => {
    try {
      // 确保数据库打开
      await dbService.open();

      // 清空存储对象
      await dbService.clear(STORE_NAME);

      setchannelId(null);
      setError(null);
    } catch (err) {
      console.error('Failed to clear all recent chats:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, []);

  // 在组件卸载时关闭数据库连接
  useEffect(() => {
    return () => {
      dbService.close();
    };
  }, []);

  return {
    channelId,
    loading,
    error,
    setRecentchannelId,
    clearRecentchannelId,
    clearAllRecentChats
  };
}
