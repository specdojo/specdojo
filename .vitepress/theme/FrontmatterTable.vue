<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const { frontmatter, page } = useData()

interface ValuePart {
  text: string
  href?: string
}

// transformPageData（config.mts）が解決した doc id → href のマップ。
const docLinks = computed<Record<string, string>>(() => {
  const pageData = page.value as { frontmatterDocLinks?: Record<string, string> }
  return pageData.frontmatterDocLinks ?? {}
})

// ネストしたオブジェクトを `parent.child.grandchild` 形式で展開する最大の深さ。
const MAX_DEPTH = 5

const rows = computed(() => flattenEntries(frontmatter.value ?? {}, '', 1))

function flattenEntries(
  record: Record<string, unknown>,
  keyPrefix: string,
  depth: number
): { key: string; parts: ValuePart[] }[] {
  return Object.entries(record)
    .filter(([, value]) => !isEmpty(value))
    .flatMap(([key, value]) => {
      const fullKey = keyPrefix ? `${keyPrefix}.${key}` : key
      if (isPlainObject(value) && depth < MAX_DEPTH) {
        return flattenEntries(value, fullKey, depth + 1)
      }
      return [{ key: fullKey, parts: toParts(value) }]
    })
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// 空配列（supersedes / part_of など）・空文字・null・空オブジェクトの行は表示しない。
function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'string') return value.trim() === ''
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

function toParts(value: unknown): ValuePart[] {
  if (Array.isArray(value)) return value.map(item => toPart(item))
  return [toPart(value)]
}

// doc id（rulebook / based_on / part_of など）に一致する値はリンクとして表示する。
function toPart(value: unknown): ValuePart {
  if (value !== null && typeof value === 'object') return { text: JSON.stringify(value) }
  const text = String(value)
  const href = docLinks.value[text]
  return href ? { text, href: withBase(href) } : { text }
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
          <td>
            <template v-for="(part, index) in row.parts" :key="index">
              <span v-if="index > 0">, </span><a v-if="part.href" :href="part.href">{{
                part.text
              }}</a><span v-else>{{ part.text }}</span>
            </template>
          </td>
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
