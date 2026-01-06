<template>
  <div class="min-h-screen yun-bai-bg">
    <header>
      <div
        class="mx-auto pl-4 pt-32 max-w-5xl h-full flex items-center justify-between"
      >
        <div class="flex flex-col">
          <div class="font-[700] text-4xl text-gray-900 tracking-wide">
            T R A C K E R
          </div>
          <div class="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <div @click="refreshData">
              <svg
                v-if="!loading"
                class="w-3.5 h-3.5 text-gray-700"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <svg
                v-else
                class="w-3.5 h-3.5 text-gray-700 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5m0 0H9M20 15v5m0 0h-5"
                />
              </svg>
            </div>
            <span>上次更新 {{ lastUpdateLabel }}</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-2.5 py-1.5"
            aria-label="筛选"
          >
            <span class="text-sm text-gray-800">筛选</span>
            <svg
              class="w-4 h-4 text-gray-700"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 4h18M7 12h10M10 20h4"
              />
            </svg>
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-2.5 py-1.5"
            aria-label="排序"
          >
            <span class="text-sm text-gray-800">排序</span>
            <svg
              class="w-4 h-4 text-gray-700"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="mx-auto px-4 pt-8 pb-8 max-w-5xl">
      <!-- 加载状态 -->
      <div v-if="pending" class="text-center py-20">
        <div class="inline-flex flex-col items-center gap-4">
          <div class="relative">
            <div class="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
            <div
              class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0"
            ></div>
          </div>
          <div>
            <p class="text-gray-600 font-medium">正在获取最新热点...</p>
            <p class="text-sm text-gray-400 mt-2">正在从各大平台同步数据</p>
          </div>
        </div>
      </div>

      <!-- 错误状态 -->
      <div
        v-else-if="error"
        class="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-8 text-center max-w-md mx-auto"
      >
        <div
          class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg
            class="w-6 h-6 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">数据获取失败</h3>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <button
          @click="refreshData"
          class="px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all"
        >
          重新获取
        </button>
      </div>

      <!-- 新闻列表 -->
      <div v-else class="space-y-6">
        <NewsList :news="filteredNews" class="transition-all duration-300" />

        <!-- 空状态 -->
        <div
          v-if="filteredNews.length === 0"
          class="text-center py-16 bg-white/50 rounded-2xl border-2 border-dashed border-gray-300"
        >
          <svg
            class="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 class="text-lg font-medium text-gray-700 mb-2">暂无热点数据</h3>
          <button
            @click="refreshData"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            刷新数据
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import Lenis from "lenis";
const lastUpdatedAt = ref(Date.now());
const lastUpdateLabel = computed(() =>
  new Date(lastUpdatedAt.value).toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  })
);
// 服务端数据获取
const {
  data: newsData,
  pending,
  error,
  refresh,
} = await useFetch("/api/news", {
  server: false, // 客户端获取，避免服务器压力
  lazy: true,
});

// 响应式数据

// 计算属性
const filteredNews = computed(() => newsData.value || []);

// 方法
const loading = ref(false);

const refreshData = async () => {
  loading.value = true;
  try {
    await refresh();
    // 添加刷新成功提示
    showToast("数据刷新成功！");
  } catch (err) {
    console.error("刷新失败:", err);
  } finally {
    loading.value = false;
    lastUpdatedAt.value = Date.now();
  }
};

// 定时刷新（可选）
onMounted(() => {
  const lenis = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 1,
    smoothWheel: true,
  });
  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
  onUnmounted(() => {
    lenis.destroy();
  });
  // 每3分钟自动刷新一次
  const interval = setInterval(() => {
    if (!loading.value) {
      refreshData();
    }
  }, 3 * 60 * 1000);

  onUnmounted(() => {
    clearInterval(interval);
  });
});

// 添加 Toast 函数
const showToast = (message) => {
  // 这里可以集成一个 Toast 组件
  console.log("Toast:", message);
};
</script>

<style scoped>
.yun-bai-bg {
  background: #fff;
}
:global(html.lenis) {
  height: auto;
}
:global(.lenis) {
  scroll-behavior: auto !important;
}
:global(.lenis body) {
  overflow: auto;
}
/* 页面过渡动画 */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
