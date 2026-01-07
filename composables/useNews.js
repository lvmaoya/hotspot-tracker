import { ref, computed } from 'vue'

export const useNews = () => {
  // 新闻数据
  const newsData = ref([])
  const loading = ref(false)
  const error = ref(null)
  const lastUpdated = ref(null)

  // 筛选状态
  const selectedPlatform = ref('all')
  const sortBy = ref('hot') // hot, time
  const showDetails = ref(true)

  // 获取新闻数据
  const fetchNews = async (forceRefresh = false) => {
    loading.value = true
    error.value = null
    
    try {
      const url = forceRefresh ? '/api/news?refresh=true' : '/api/news'
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      newsData.value = data
      lastUpdated.value = new Date()
      
      return data
    } catch (err) {
      error.value = err.message || '获取新闻数据失败'
      console.error('Failed to fetch news:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 计算属性 - 筛选后的新闻
  const filteredNews = computed(() => {
    let filtered = [...newsData.value]

    // 平台筛选
    if (selectedPlatform.value !== 'all') {
      filtered = filtered.filter(item => item.platform === selectedPlatform.value)
    }

    // 排序
    filtered.sort((a, b) => {
      if (sortBy.value === 'hot') {
        const hotA = a.hotValue || parseHotValue(a.hot) || 0
        const hotB = b.hotValue || parseHotValue(b.hot) || 0
        return hotB - hotA
      } else {
        const timeA = new Date(a.timestamp || 0).getTime()
        const timeB = new Date(b.timestamp || 0).getTime()
        return timeB - timeA
      }
    })

    return filtered
  })

  // 平台统计
  const platformStats = computed(() => {
    const stats = {}
    newsData.value.forEach(item => {
      if (!stats[item.platform]) {
        stats[item.platform] = {
          count: 0,
          totalHot: 0,
          maxHot: 0
        }
      }
      stats[item.platform].count++
      const hotValue = item.hotValue || parseHotValue(item.hot) || 0
      stats[item.platform].totalHot += hotValue
      if (hotValue > stats[item.platform].maxHot) {
        stats[item.platform].maxHot = hotValue
      }
    })
    return stats
  })

  // 热门标签
  const hotTags = computed(() => {
    const tagMap = {}
    newsData.value.forEach(item => {
      if (item.tags) {
        item.tags.forEach(tag => {
          tagMap[tag] = (tagMap[tag] || 0) + 1
        })
      }
    })
    
    return Object.entries(tagMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }))
  })

  // 热度趋势（模拟）
  const hotTrend = computed(() => {
    // 这里可以接入真实的时间序列数据
    return newsData.value.slice(0, 10).map((item, index) => ({
      title: item.title.substring(0, 15) + '...',
      hot: item.hotValue || parseHotValue(item.hot) || 0,
      change: Math.random() > 0.5 ? 'up' : 'down'
    }))
  })

  // 辅助函数
  const parseHotValue = (hot) => {
    if (!hot) return 0
    if (typeof hot === 'number') return hot
    
    const match = hot.match(/(\d+(?:\.\d+)?)(万?)/)
    if (match) {
      let value = parseFloat(match[1])
      if (match[2] === '万') {
        value *= 10000
      }
      return value
    }
    
    return 0
  }

  const formatHot = (hot) => {
    const value = parseHotValue(hot)
    if (value >= 10000) {
      return (value / 10000).toFixed(1) + '万'
    }
    return value.toString()
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return '刚刚'
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    
    const minutes = Math.floor(diff / (1000 * 60))
    if (minutes < 60) return `${minutes}分钟前`
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 24) return `${hours}小时前`
    
    return date.toLocaleDateString('zh-CN')
  }

  // 刷新数据
  const refresh = () => fetchNews(true)

  // 初始化加载
  const init = async () => {
    await fetchNews()
  }

  return {
    // 状态
    newsData,
    loading,
    error,
    lastUpdated,
    
    // 筛选状态
    selectedPlatform,
    sortBy,
    showDetails,
    
    // 计算属性
    filteredNews,
    platformStats,
    hotTags,
    hotTrend,
    
    // 方法
    fetchNews,
    refresh,
    init,
    formatHot,
    formatTime,
    
    // 操作
    setPlatform: (platform) => { selectedPlatform.value = platform },
    setSortBy: (sort) => { sortBy.value = sort },
    toggleDetails: () => { showDetails.value = !showDetails.value }
  }
}