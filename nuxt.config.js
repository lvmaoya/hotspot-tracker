export default defineNuxtConfig({
  ssr: true,
  
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  
  runtimeConfig: {
    public: {
      appName: '热点新闻追踪'
    }
  },
  
  app: {
    head: {
      title: '热点新闻追踪 - 全网热点实时聚合',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '实时聚合微博、知乎、百度、今日头条等平台的热点新闻' },
        { name: 'keywords', content: '热点新闻,微博热搜,知乎热榜,新闻追踪' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  
  // 组件自动导入
  components: true,
  
  // 开发配置
  devtools: { enabled: true }
})