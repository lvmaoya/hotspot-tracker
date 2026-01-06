// 简单的内存缓存实现

const cacheStore = new Map()

export function createCache(key, ttl = 5 * 60 * 1000) {
  return {
    get() {
      const cached = cacheStore.get(key)
      
      if (!cached) {
        return null
      }
      
      const now = Date.now()
      const { data, timestamp } = cached
      
      // 检查是否过期
      if (now - timestamp > ttl) {
        cacheStore.delete(key)
        return null
      }
      
      return data
    },
    
    set(data) {
      cacheStore.set(key, {
        data,
        timestamp: Date.now()
      })
    },
    
    clear() {
      cacheStore.delete(key)
    },
    
    has() {
      const cached = cacheStore.get(key)
      if (!cached) return false
      
      const now = Date.now()
      const { timestamp } = cached
      
      return now - timestamp <= ttl
    },
    
    getAge() {
      const cached = cacheStore.get(key)
      if (!cached) return null
      
      return Date.now() - cached.timestamp
    }
  }
}

// 清理过期的缓存
export function cleanupExpiredCache() {
  const now = Date.now()
  
  for (const [key, cached] of cacheStore.entries()) {
    // 假设所有缓存的TTL都是5分钟
    if (now - cached.timestamp > 5 * 60 * 1000) {
      cacheStore.delete(key)
    }
  }
}

// 定时清理（每10分钟一次）
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredCache, 10 * 60 * 1000)
}

// 获取所有缓存键
export function getAllCacheKeys() {
  return Array.from(cacheStore.keys())
}

// 清空所有缓存
export function clearAllCache() {
  cacheStore.clear()
}

// 获取缓存统计
export function getCacheStats() {
  return {
    totalEntries: cacheStore.size,
    keys: getAllCacheKeys(),
    memoryUsage: process.memoryUsage()
  }
}