import { defineEventHandler, createError } from 'h3'
import axios from 'axios'
import { createCache } from '~/server/utils/cache.js'
import { newsSources } from '~/server/utils/news-sources.js'

// 创建缓存实例
const cache = createCache('hotNews', 5 * 60 * 1000) // 5分钟缓存

export default defineEventHandler(async (event) => {
  try {
    const { refresh } = getQuery(event)
    const forceRefresh = refresh === 'true'

    // 从缓存获取数据（除非强制刷新）
    if (!forceRefresh) {
      const cachedData = cache.get()
      if (cachedData) {
        console.log('返回缓存数据')
        return cachedData
      }
    }

    console.log('开始获取新闻数据...')
    
    // 获取所有新闻源的数据
    const fetchPromises = newsSources.map(async (source) => {
      try {
        console.log(`正在获取 ${source.name} 数据...`)
        
        const response = await axios.get(source.url, {
          headers: source.headers || {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Referer': source.referer || 'https://www.baidu.com/'
          },
          timeout: 10000,
          responseType: source.responseType || 'json'
        })

        if (!response.data) {
          throw new Error('空数据响应')
        }

        const items = source.parseData(response.data)
        
        return items.map(item => ({
          ...item,
          id: `${source.platform}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          source: source.name,
          platform: source.platform,
          timestamp: new Date().toISOString(),
          hotValue: parseHotValue(item.hot)
        }))

      } catch (error) {
        console.error(`获取 ${source.name} 数据失败:`, error.message)
        
        // 如果失败，返回模拟数据作为降级
        return generateMockData(source)
      }
    })

    // 并发获取所有数据
    const results = await Promise.allSettled(fetchPromises)
    
    // 合并所有结果
    let allNews = []
    let successCount = 0
    let failCount = 0

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.length > 0) {
        allNews = allNews.concat(result.value)
        successCount++
      } else {
        console.warn(`${newsSources[index].name} 数据获取失败`)
        failCount++
      }
    })

    console.log(`数据获取完成: 成功 ${successCount}, 失败 ${failCount}, 总计 ${allNews.length} 条`)

    // 按热度排序
    allNews.sort((a, b) => {
      const hotA = a.hotValue || 0
      const hotB = b.hotValue || 0
      return hotB - hotA
    })

    // 添加排名
    allNews = allNews.map((item, index) => ({
      ...item,
      rank: index + 1
    }))

    // 设置缓存
    cache.set(allNews)

    return allNews

  } catch (error) {
    console.error('获取新闻数据时发生错误:', error)
    
    // 返回模拟数据作为降级
    return getMockData()
  }
})

// 解析热度值
function parseHotValue(hot) {
  if (!hot) return Math.floor(Math.random() * 1000000) + 50000
  
  if (typeof hot === 'number') return hot
  
  // 处理 "123万" 这样的字符串
  const match = hot.match(/(\d+(?:\.\d+)?)(万?)/)
  if (match) {
    let value = parseFloat(match[1])
    if (match[2] === '万') {
      value *= 10000
    }
    return value
  }
  
  // 处理 "123,456" 这样的字符串
  const num = parseFloat(hot.replace(/,/g, ''))
  if (!isNaN(num)) return num
  
  return Math.floor(Math.random() * 1000000) + 50000
}

// 生成模拟数据（降级用）
function generateMockData(source) {
  const mockTitles = [
    '最新科技突破：人工智能助力医疗诊断',
    '国际形势新变化：多国领导人会谈',
    '体育赛事精彩瞬间：冠军诞生时刻',
    '娱乐圈新动态：明星合作引关注',
    '经济热点：股市波动引投资者关注',
    '社会新闻：暖心故事感动网友',
    '文化传承：传统技艺焕发新生',
    '教育话题：教育改革引热议',
    '健康养生：专家建议健康生活方式',
    '旅游推荐：这些地方值得一去'
  ]

  const tags = [
    ['科技', 'AI'],
    ['国际', '政治'],
    ['体育', '赛事'],
    ['娱乐', '明星'],
    ['财经', '投资'],
    ['社会', '正能量'],
    ['文化', '传统'],
    ['教育', '改革'],
    ['健康', '养生'],
    ['旅游', '推荐']
  ]

  return Array.from({ length: 10 }, (_, index) => ({
    id: `mock_${source.platform}_${Date.now()}_${index}`,
    title: mockTitles[index],
    hot: `${Math.floor(Math.random() * 900 + 100)}万`,
    hotValue: Math.floor(Math.random() * 10000000) + 1000000,
    url: `https://example.com/news/${index}`,
    platform: source.platform,
    source: source.name,
    tags: tags[index],
    timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(), // 24小时内随机时间
    icon: source.icon || '📰'
  }))
}

// 获取完整的模拟数据
function getMockData() {
  console.log('返回模拟数据')
  
  const platforms = [
    { name: '微博热搜', platform: 'weibo', icon: '🔥' },
    { name: '知乎热榜', platform: 'zhihu', icon: '📚' },
    { name: '百度热搜', platform: 'baidu', icon: '🔍' },
    { name: '今日头条', platform: 'toutiao', icon: '📰' },
    { name: '抖音热榜', platform: 'douyin', icon: '🎵' },
    { name: 'B站热榜', platform: 'bilibili', icon: '📺' }
  ]

  let allNews = []
  
  platforms.forEach(source => {
    allNews = allNews.concat(generateMockData(source))
  })

  // 按热度排序
  allNews.sort((a, b) => b.hotValue - a.hotValue)
  
  // 添加排名
  allNews = allNews.map((item, index) => ({
    ...item,
    rank: index + 1
  }))

  return allNews
}