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
  chatId: string;
  timestamp: number;
}

/**
 * 获取指定appId最近访问的chatId
 * @param appId 应用ID
 * @returns 最近访问的chatId，如果没有找到则返回null
 */
export async function fetchRecentChatId(appId: string): Promise<string | null> {
  try {
    // 确保数据库打开
    await dbService.open();
    // 获取appId对应的记录
    const record = await dbService.get<RecentChat>(STORE_NAME, appId);

    return record ? record.chatId : null;
  } catch (err) {
    console.error('Failed to fetch recent chatId:', err);
    throw err;
  }
}

/**
 * React hook用于管理每个app最近访问的chatId
 * @param appId 应用ID
 * @returns 包含chatId和相关操作方法的对象
 */
export function useRecentChatId(appId: string) {
  const [chatId, setChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 加载最近的chatId
  useEffect(() => {
    let isMounted = true;

    const loadRecentChatId = async () => {
      try {
        setLoading(true);
        const recentChatId = await fetchRecentChatId(appId);

        if (isMounted) {
          setChatId(recentChatId);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to load recent chatId in hook:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setChatId(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadRecentChatId();

    return () => {
      isMounted = false;
    };
  }, [appId]);

  // 设置/更新最近的chatId
  const setRecentChatId = useCallback(async (newChatId: string) => {
    if (!newChatId) return;

    try {
      // 确保数据库打开
      await dbService.open();

      // 更新记录
      await dbService.put<RecentChat>(STORE_NAME, {
        appId,
        chatId: newChatId,
        timestamp: Date.now()
      });

      setChatId(newChatId);
      setError(null);
    } catch (err) {
      console.error('Failed to update recent chatId:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [appId]);

  // 清除最近的chatId
  const clearRecentChatId = useCallback(async () => {
    try {
      // 确保数据库打开
      await dbService.open();

      // 删除记录
      await dbService.delete(STORE_NAME, appId);

      setChatId(null);
      setError(null);
    } catch (err) {
      console.error('Failed to clear recent chatId:', err);
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

      setChatId(null);
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
    chatId,
    loading,
    error,
    setRecentChatId,
    clearRecentChatId,
    clearAllRecentChats
  };
}
