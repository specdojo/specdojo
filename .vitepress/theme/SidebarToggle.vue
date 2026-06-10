<script setup lang="ts">
import { useSidebar } from 'vitepress/theme'
import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'vp-sidebar-collapsed'
const COLLAPSED_CLASS = 'vp-sidebar-collapsed'

const { hasSidebar } = useSidebar()
const collapsed = ref(false)

onMounted(() => {
  collapsed.value = document.documentElement.classList.contains(COLLAPSED_CLASS)
})

function toggle() {
  collapsed.value = !collapsed.value
  document.documentElement.classList.toggle(COLLAPSED_CLASS, collapsed.value)
  localStorage.setItem(STORAGE_KEY, String(collapsed.value))
}
</script>

<template>
  <button
    v-if="hasSidebar"
    type="button"
    class="sidebar-toggle"
    :class="{ collapsed }"
    :aria-pressed="collapsed"
    :title="collapsed ? 'サイドバーを表示' : 'サイドバーを折りたたむ'"
    @click.stop.prevent="toggle"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
    </svg>
  </button>
</template>

<style scoped>
.sidebar-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  color: var(--vp-c-text-2);
  transition: color 0.25s, background-color 0.25s;
}

.sidebar-toggle:hover {
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-default-soft);
}

.sidebar-toggle.collapsed {
  color: var(--vp-c-brand-1);
}

@media (min-width: 960px) {
  .sidebar-toggle {
    display: flex;
  }
}
</style>
