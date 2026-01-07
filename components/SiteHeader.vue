<template>
  <header>
    <div class="mx-auto pl-4 pt-32 max-w-5xl h-full flex items-center justify-between">
      <div class="flex flex-col">
        <div class="font-extrabold text-3xl tracking-wide text-primary">记录发生</div>
        <div class="mt-3 flex items-center gap-2 italic text-secondary">整理当下最受关注的社会议题</div>
      </div>
      <div class="flex items-center gap-2">
        <button type="button" class="inline-flex items-center gap-1.5 px-2.5 py-1.5 card-bg rounded-md" aria-label="筛选">
          <span class="text-sm text-primary">筛选</span>
          <svg class="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h18M7 12h10M10 20h4"/>
          </svg>
        </button>
        <button type="button" class="inline-flex items-center gap-1.5 px-2.5 py-1.5 card-bg rounded-md" aria-label="排序">
          <span class="text-sm text-primary">排序</span>
          <svg class="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>
