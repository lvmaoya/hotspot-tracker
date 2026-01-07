export const useTheme = () => {
  const theme = useState('theme', () => 'light')
  const isDark = computed(() => theme.value === 'dark')
  const applyTheme = (t) => {
    const el = document.documentElement
    if (t === 'dark') el.classList.add('dark')
    else el.classList.remove('dark')
  }
  const setTheme = (t) => {
    theme.value = t
    try { localStorage.setItem('theme', t) } catch {}
    applyTheme(t)
  }
  const toggleTheme = () => setTheme(isDark.value ? 'light' : 'dark')
  const initTheme = () => {
    let t = 'light'
    try {
      const saved = localStorage.getItem('theme')
      if (saved === 'dark' || saved === 'light') {
        t = saved
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        t = 'dark'
      }
    } catch {}
    setTheme(t)
  }
  return { theme, isDark, setTheme, toggleTheme, initTheme }
}
