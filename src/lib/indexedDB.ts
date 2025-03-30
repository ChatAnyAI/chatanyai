/**
 * IndexedDB 操作工具库
 * 提供简单的API来操作IndexedDB数据库
 */

export interface IndexedDBOptions {
  dbName: string;
  version?: number;
  stores: {
    name: string;
    keyPath: string;
    indexes?: Array<{
      name: string;
      keyPath: string;
      options?: IDBIndexParameters;
    }>;
  }[];
}

export class IndexedDBService {
  private db: IDBDatabase | null = null;
  private dbName: string;
  private version: number;
  private stores: IndexedDBOptions['stores'];

  /**
   * 创建IndexedDB服务实例
   * @param options 数据库配置选项
   */
  constructor(options: IndexedDBOptions) {
    this.dbName = options.dbName;
    this.version = options.version || 1;
    this.stores = options.stores;
  }

  /**
   * 初始化并打开数据库
   * @returns Promise<boolean> 是否成功打开数据库
   */
  async open(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = (event) => {
        console.error('IndexedDB error:', (event.target as IDBRequest).error);
        reject((event.target as IDBRequest).error);
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        console.log(`IndexedDB "${this.dbName}" opened successfully`);
        resolve(true);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // 创建对象仓库
        this.stores.forEach(store => {
          // 如果存储对象已存在，则删除
          if (db.objectStoreNames.contains(store.name)) {
            db.deleteObjectStore(store.name);
          }
          
          // 创建新的存储对象
          const objectStore = db.createObjectStore(store.name, { keyPath: store.keyPath });
          
          // 创建索引
          if (store.indexes) {
            store.indexes.forEach(index => {
              objectStore.createIndex(index.name, index.keyPath, index.options);
            });
          }
          
          console.log(`Object store "${store.name}" created/updated`);
        });
      };
    });
  }

  /**
   * 关闭数据库连接
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      console.log(`IndexedDB "${this.dbName}" connection closed`);
    }
  }

  /**
   * 添加数据到指定的存储对象
   * @param storeName 存储对象名称
   * @param data 要添加的数据
   * @returns Promise<any> 添加的数据的键
   */
  async add<T>(storeName: string, data: T): Promise<IDBValidKey> {
    return this.runTransaction(storeName, 'readwrite', (store) => {
      return new Promise((resolve, reject) => {
        const request = store.add(data);
        
        request.onsuccess = (event) => {
          resolve((event.target as IDBRequest).result);
        };
        
        request.onerror = (event) => {
          reject((event.target as IDBRequest).error);
        };
      });
    });
  }

  /**
   * 获取指定键的数据
   * @param storeName 存储对象名称
   * @param key 键值
   * @returns Promise<T | undefined> 获取的数据
   */
  async get<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
    return this.runTransaction(storeName, 'readonly', (store) => {
      return new Promise((resolve, reject) => {
        const request = store.get(key);
        
        request.onsuccess = (event) => {
          resolve((event.target as IDBRequest).result);
        };
        
        request.onerror = (event) => {
          reject((event.target as IDBRequest).error);
        };
      });
    });
  }

  /**
   * 获取存储对象中的所有数据
   * @param storeName 存储对象名称
   * @returns Promise<T[]> 所有数据的数组
   */
  async getAll<T>(storeName: string): Promise<T[]> {
    return this.runTransaction(storeName, 'readonly', (store) => {
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        
        request.onsuccess = (event) => {
          resolve((event.target as IDBRequest).result);
        };
        
        request.onerror = (event) => {
          reject((event.target as IDBRequest).error);
        };
      });
    });
  }

  /**
   * 更新数据
   * @param storeName 存储对象名称
   * @param data 要更新的数据
   * @returns Promise<IDBValidKey> 更新的数据的键
   */
  async put<T>(storeName: string, data: T): Promise<IDBValidKey> {
    return this.runTransaction(storeName, 'readwrite', (store) => {
      return new Promise((resolve, reject) => {
        const request = store.put(data);
        
        request.onsuccess = (event) => {
          resolve((event.target as IDBRequest).result);
        };
        
        request.onerror = (event) => {
          reject((event.target as IDBRequest).error);
        };
      });
    });
  }

  /**
   * 删除指定键的数据
   * @param storeName 存储对象名称
   * @param key 键值
   * @returns Promise<void>
   */
  async delete(storeName: string, key: IDBValidKey): Promise<void> {
    return this.runTransaction(storeName, 'readwrite', (store) => {
      return new Promise((resolve, reject) => {
        const request = store.delete(key);
        
        request.onsuccess = () => {
          resolve();
        };
        
        request.onerror = (event) => {
          reject((event.target as IDBRequest).error);
        };
      });
    });
  }

  /**
   * 清空存储对象中的所有数据
   * @param storeName 存储对象名称
   * @returns Promise<void>
   */
  async clear(storeName: string): Promise<void> {
    return this.runTransaction(storeName, 'readwrite', (store) => {
      return new Promise((resolve, reject) => {
        const request = store.clear();
        
        request.onsuccess = () => {
          resolve();
        };
        
        request.onerror = (event) => {
          reject((event.target as IDBRequest).error);
        };
      });
    });
  }

  /**
   * 通过索引查询数据
   * @param storeName 存储对象名称
   * @param indexName 索引名称
   * @param value 索引值
   * @returns Promise<T[]> 查询结果数组
   */
  async getByIndex<T>(storeName: string, indexName: string, value: any): Promise<T[]> {
    return this.runTransaction(storeName, 'readonly', (store) => {
      return new Promise((resolve, reject) => {
        const index = store.index(indexName);
        const request = index.getAll(value);
        
        request.onsuccess = (event) => {
          resolve((event.target as IDBRequest).result);
        };
        
        request.onerror = (event) => {
          reject((event.target as IDBRequest).error);
        };
      });
    });
  }

  /**
   * 执行事务操作
   * @param storeName 存储对象名称
   * @param mode 事务模式
   * @param callback 回调函数
   * @returns Promise<T> 操作结果
   */
  private async runTransaction<T>(
    storeName: string, 
    mode: IDBTransactionMode, 
    callback: (store: IDBObjectStore) => Promise<T>
  ): Promise<T> {
    if (!this.db) {
      await this.open();
    }
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      
      const transaction = this.db.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);
      
      transaction.onerror = (event) => {
        reject((event.target as IDBTransaction).error);
      };
      
      transaction.oncomplete = () => {
        // 事务完成
      };
      
      callback(store)
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * 删除整个数据库
   * @returns Promise<void>
   */
  static async deleteDatabase(dbName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(dbName);
      
      request.onsuccess = () => {
        console.log(`Database "${dbName}" deleted successfully`);
        resolve();
      };
      
      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  }
}
