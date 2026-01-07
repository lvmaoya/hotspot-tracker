export default defineNuxtPlugin(() => {
  if (process.server) return
  const { initTheme } = useTheme()
  initTheme()
})
