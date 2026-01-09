// 新闻源配置

import { load } from "cheerio";

export const newsSources = [
  {
    name: "微博热搜",
    platform: "weibo",
    url: "https://weibo.com/ajax/side/hotSearch",
    icon: "🔥",
    color: "red",
    parseData: (data) => {
      try {
        if (data.data && data.data.realtime) {
          return data.data.realtime.slice(0, 20).map((item) => ({
            title: item.word,
            hot: item.num,
            url: `https://s.weibo.com/weibo?q=${encodeURIComponent(item.word)}`,
            tag: item.word_scheme || item.word,
            icon: "🔥",
          }));
        }
        return [];
      } catch (error) {
        console.error("解析微博数据失败:", error);
        return [];
      }
    },
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept: "application/json",
      Referer: "https://weibo.com/",
    },
  },
  {
    name: "知乎热榜",
    platform: "zhihu",
    url: "https://www.zhihu.com/api/v3/explore/guest/feeds?limit=15&ws_qiangzhisafe=0",
    icon: "📚",
    color: "blue",
    parseData: (data) => {
      try {
        if (!data || !Array.isArray(data.data)) return [];
        return data.data.slice(0, 20).map((entry) => {
          const t = entry.target || {};
          const title = (t.question && t.question.title) || t.title || "";
          const hot =
            typeof t.voteup_count === "number"
              ? t.voteup_count
              : t.thanks_count || 0;
          let url = "";
          if (t.question && t.question.id && t.id) {
            url = `https://www.zhihu.com/question/${t.question.id}/answer/${t.id}`;
          } else if (typeof t.url === "string") {
            url = t.url.replace(
              "https://api.zhihu.com/answers/",
              "https://www.zhihu.com/answer/"
            );
          }
          const tag = "热门";
          return { title, hot, url, tag, icon: "📚" };
        });
      } catch (error) {
        console.error("解析知乎数据失败:", error);
        return [];
      }
    },
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept: "application/json",
      Referer: "https://www.zhihu.com/explore",
    },
    responseType: "json",
  },
  {
    name: "百度热搜",
    platform: "baidu",
    url: "https://top.baidu.com/board?tab=realtime",
    icon: "🔍",
    color: "purple",
    parseData: (html) => {
      try {
        if (typeof html !== "string" || html.length === 0) return [];
        const $ = load(html);
        let jsonStr = "";
        $.root()
          .contents()
          .each((_, el) => {
            if (el && el.type === "comment" && typeof el.data === "string") {
              const idx = el.data.indexOf("s-data:");
              if (idx !== -1) {
                jsonStr = el.data.slice(idx + "s-data:".length).trim();
              }
            }
          });
        if (!jsonStr) {
          const m = html.match(/<!--s-data:([\s\S]*?)-->/);
          if (m && m[1]) jsonStr = m[1];
        }
        if (!jsonStr) return [];
        const j = JSON.parse(jsonStr);
        const cards = Array.isArray(j?.data?.cards) ? j.data.cards : [];
        const items = [];
        cards.forEach((card) => {
          const content = Array.isArray(card?.content) ? card.content : [];
          content.forEach((x) => items.push(x));
        });
        return items.slice(0, 50).map((x) => ({
          title: x.word || "",
          hot:
            typeof x.hotScore === "number"
              ? x.hotScore
              : Number(x.hotScore) || 0,
          url: x.url || "",
          tag: "实时",
          icon: "🔍",
        }));
      } catch (error) {
        console.error("解析百度数据失败:", error);
        return [];
      }
    },
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept: "text/html",
      Referer: "https://www.baidu.com/",
    },
    responseType: "text",
  },
  {
    name: "今日头条",
    platform: "toutiao",
    url: "https://www.toutiao.com/hot-event/hot-board/?origin=tt_pc_hot",
    icon: "📰",
    color: "orange",
    parseData: (data) => {
      try {
        if (data.data) {
          return data.data.slice(0, 20).map((item) => ({
            title: item.Title,
            hot: item.HotValue,
            url: `https://www.toutiao.com/trending/${item.ClusterId}`,
            tag: item.Label,
            icon: "📰",
          }));
        }
        return [];
      } catch (error) {
        console.error("解析头条数据失败:", error);
        return [];
      }
    },
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept: "application/json",
      Referer: "https://www.toutiao.com/",
    },
  },
  {
    name: "抖音热榜",
    platform: "douyin",
    url: "https://www.douyin.com/aweme/v1/web/hot/search/list/",
    icon: "🎵",
    color: "pink",
    parseData: (data) => {
      try {
        if (data.data && data.data.word_list) {
          return data.data.word_list.slice(0, 20).map((item) => ({
            title: item.word,
            hot: item.hot_value,
            url: `https://www.douyin.com/search/${encodeURIComponent(
              item.word
            )}`,
            tag: item.label || "热门",
            icon: "🎵",
          }));
        }
        return [];
      } catch (error) {
        console.error("解析抖音数据失败:", error);
        return [];
      }
    },
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept: "application/json",
      Referer: "https://www.douyin.com/",
    },
  },
  {
    name: "B站热榜",
    platform: "bilibili",
    url: "https://api.bilibili.com/x/web-interface/ranking/v2",
    icon: "📺",
    color: "indigo",
    parseData: (data) => {
      try {
        if (data.data && data.data.list) {
          return data.data.list.slice(0, 20).map((item) => ({
            title: item.title,
            hot: item.stat && item.stat.view ? `${item.stat.view}观看` : "热门",
            url: `https://www.bilibili.com/video/${item.bvid}`,
            tag: item.tname,
            icon: "📺",
          }));
        }
        return [];
      } catch (error) {
        console.error("解析B站数据失败:", error);
        return [];
      }
    },
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept: "application/json",
      Referer: "https://www.bilibili.com/",
    },
  },
];

// 获取所有平台的名称
export function getPlatformNames() {
  return newsSources.map((source) => ({
    id: source.platform,
    name: source.name,
    icon: source.icon,
    color: source.color,
  }));
}

// 根据平台ID获取配置
export function getSourceByPlatform(platformId) {
  return newsSources.find((source) => source.platform === platformId);
}

// 获取所有平台的统计信息
export function getAllPlatformStats() {
  return newsSources.map((source) => ({
    platform: source.platform,
    name: source.name,
    icon: source.icon,
    color: source.color,
    enabled: true,
  }));
}
