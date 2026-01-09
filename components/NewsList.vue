<template>
  <ul class="list">
    <li v-for="(item, index) in list" :key="item.id || index" class="row">
      <span class="rank">{{ index + 1 }}</span>
      <span class="title">
        <a
          v-if="item.url"
          :href="item.url"
          target="_blank"
          :title="item.title"
          >{{ item.title }}</a
        >
        <span v-else>{{ item.title }}</span>
      </span>
      <span class="platform">
        <img :src="getPlatformIcon(item.platform)" class="icon" />
      </span>
    </li>
  </ul>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  news: {
    type: Array,
    default: () => [],
  },
  items: {
    type: Array,
    default: () => [],
  },
});
const list = computed(() =>
  props.news && props.news.length ? props.news : props.items
);
const getPlatformIcon = (platform) => {
  const map = {
    weibo: "https://weibo.com/favicon.ico",
    zhihu: "https://www.zhihu.com/favicon.ico",
    baidu: "https://www.baidu.com/favicon.ico",
    thepaper: "https://www.thepaper.cn/favicon.ico",
    douyin: "https://www.douyin.com/favicon.ico",
  };
  return map[platform] || "/favicon.ico";
};
</script>

<style scoped>
.list {
  padding: 0;
  margin: 0;
  font-size: 0.875rem;
}
.row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
}
.rank {
  width: 1rem;
  text-align: left;
  color: var(--text-secondary);
}
.title {
  flex: 1;
  min-width: 0;
}
.title a {
  color: var(--text-primary);
  text-decoration: none;
}
.title:hover a {
  text-decoration: underline;
  text-underline-offset: 0.25rem;
}
.title,
.title a {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.platform {
  color: var(--text-secondary);
}
.icon {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  display: inline-block;
}
</style>
