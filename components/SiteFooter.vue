<template>
  <footer class="mx-auto mt-12 max-w-5xl flex">
    <div class="px-4 py-12 border-t border-soft flex-1">
      <p class="text-lg text-primary">T R A C K E R</p>
      <p class="mt-8 text-sm leading-relaxed text-secondary">
        本站记录公共事件在不同平台中的关注变化，仅用于信息整理与趋势观察，不参与讨论与判断。
      </p>
      <div class="mt-8 flex flex-col gap-2 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <span>© {{ new Date().getFullYear() }} · Public Attention Archive</span>
      </div>
    </div>
    <div class="px-4 py-12 border-t border-soft flex items-center justify-end">
      <button
        type="button"
        class="inline-flex items-center justify-center w-10 h-10 rounded-md"
        :aria-label="isDark ? '切换为明亮主题' : '切换为暗色主题'"
        title="主题切换"
        @click="toggleTheme"
      >
        <svg v-if="!isDark" class="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="4" stroke-width="2" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
        </svg>
        <svg v-else class="w-5 h-5 text-gray-200" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/>
        </svg>
      </button>
    </div>
  </footer>
</template>

<script setup>
const { isDark, toggleTheme } = useTheme()
</script>
