<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const { site, theme, page, localeIndex, hash, isDark } = useData()

const currentLocaleLink = computed(
  () =>
    site.value.locales[localeIndex.value]?.link ??
    (localeIndex.value === 'root' ? '/' : `/${localeIndex.value}/`)
)

const otherLocaleLinks = computed(() =>
  Object.entries(site.value.locales).flatMap(([key, locale]) => {
    if (locale.label === site.value.locales[localeIndex.value]?.label) return []

    const base = locale.link ?? (key === 'root' ? '/' : `/${key}/`)
    const relativePath = page.value.relativePath.slice(currentLocaleLink.value.length - 1)
    const cleanedPath = relativePath
      .replace(/(^|\/)index\.md$/, '$1')
      .replace(/\.md$/, site.value.cleanUrls ? '' : '.html')
    const path = cleanedPath.startsWith('/') ? cleanedPath : `/${cleanedPath}`

    return [{ text: locale.label, link: withBase(base.replace(/\/$/, '') + path) + hash.value }]
  })
)

const appearanceTitle = computed(() =>
  isDark.value
    ? (theme.value.lightModeSwitchTitle ?? 'Switch to light theme')
    : (theme.value.darkModeSwitchTitle ?? 'Switch to dark theme')
)

function toggleAppearance() {
  isDark.value = !isDark.value
}
</script>

<template>
  <div class="aside-extra">
    <button
      type="button"
      class="appearance-toggle"
      :title="appearanceTitle"
      :aria-pressed="isDark"
      @click="toggleAppearance"
    >
      <span class="vpi-sun icon-sun" aria-hidden="true" />
      <span class="vpi-moon icon-moon" aria-hidden="true" />
    </button>

    <a v-for="locale in otherLocaleLinks" :key="locale.link" class="lang-link" :href="locale.link">
      <span class="vpi-languages icon-lang" aria-hidden="true" />
      {{ locale.text }}
    </a>
  </div>
</template>

<style scoped>
.aside-extra {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.appearance-toggle,
.lang-link {
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 6px;
  padding: 4px 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  transition: color 0.25s, background-color 0.25s;
}

.appearance-toggle:hover,
.lang-link:hover {
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-default-soft);
}

.icon-sun,
.icon-moon,
.icon-lang {
  font-size: 16px;
}

.icon-moon {
  display: none;
}

.dark .icon-sun {
  display: none;
}

.dark .icon-moon {
  display: block;
}
</style>
