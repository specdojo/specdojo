<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()

const rows = computed(() =>
  Object.entries(frontmatter.value ?? {})
    .filter(([, value]) => !isEmpty(value))
    .map(([key, value]) => ({
      key,
      value: formatValue(value),
    }))
)

// 空配列（supersedes / part_of など）・空文字・null・空オブジェクトの行は表示しない。
function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'string') return value.trim() === ''
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

function formatValue(value: unknown): string {
  if (Array.isArray(value)) return value.join(', ')
  if (value !== null && typeof value === 'object') return JSON.stringify(value)
  return String(value)
}
</script>

<template>
  <details v-if="rows.length" class="frontmatter-block">
    <summary>frontmatter</summary>
    <table>
      <thead>
        <tr>
          <th>キー</th>
          <th>値</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.key">
          <td><code>{{ row.key }}</code></td>
          <td>{{ row.value }}</td>
        </tr>
      </tbody>
    </table>
  </details>
</template>

<style scoped>
.frontmatter-block {
  margin: 0 0 1.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  background: var(--vp-c-bg-soft);
}

.frontmatter-block summary {
  cursor: pointer;
  font-weight: 600;
  color: var(--vp-c-text-2);
  user-select: none;
}

.frontmatter-block table {
  display: table;
  width: 100%;
  margin: 0.75rem 0 0.25rem;
  border-collapse: collapse;
}

.frontmatter-block th,
.frontmatter-block td {
  border: 1px solid var(--vp-c-divider);
  padding: 0.4rem 0.6rem;
  text-align: left;
  font-size: 0.85em;
  vertical-align: top;
}

.frontmatter-block th {
  background: var(--vp-c-bg-soft);
  white-space: nowrap;
}

.frontmatter-block code {
  font-size: 0.95em;
}
</style>
