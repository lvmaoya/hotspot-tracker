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
      <span class="hot">🔥 {{ formatHot(pickHot(item)) }}</span>
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
const pickHot = (item) => item?.hot ?? item?.hotValue ?? item?.heat;
const formatHot = (hot) => {
  if (hot == null) return "0";
  if (typeof hot === "number") {
    if (hot >= 10000) {
      const v = hot / 10000;
      const s = v.toFixed(1);
      return (s.endsWith(".0") ? s.slice(0, -2) : s) + "万";
    }
    return String(hot);
  }
  const str = String(hot).trim();
  if (!str) return "0";
  if (/[万wW]$/.test(str)) return str.replace(/[wW]$/, "万");
  const n = parseFloat(str.replace(/[^\d.]/g, ""));
  if (!isNaN(n)) {
    if (n >= 10000) {
      const v = n / 10000;
      const s = v.toFixed(1);
      return (s.endsWith(".0") ? s.slice(0, -2) : s) + "万";
    }
    return String(Math.round(n));
  }
  return str;
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
  color: #666;
}
.title {
  flex: 1;
  min-width: 0;
}
.title a {
  color: #000;
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
.hot {
  color: #666;
}
</style>
