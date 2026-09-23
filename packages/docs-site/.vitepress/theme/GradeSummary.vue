<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";

const { page } = useData();
const grade = computed(
  () =>
    (
      page.value as {
        gradeSummary?: {
          verdict: string;
          score: number;
          findings: number;
          gradedAt: string;
          gradedBy: string;
        };
      }
    ).gradeSummary,
);
</script>

<template>
  <aside v-if="grade" class="grade-summary" :data-verdict="grade.verdict">
    <strong>grade</strong>
    <span
      ><code>{{ grade.verdict }}</code></span
    >
    <span
      >score <code>{{ grade.score }}</code></span
    >
    <span
      >findings <code>{{ grade.findings }}</code></span
    >
    <span class="grade-summary__meta">{{ grade.gradedAt }} / {{ grade.gradedBy }}</span>
  </aside>
</template>

<style scoped>
.grade-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  align-items: center;
  margin: 0 0 1rem;
  border-left: 4px solid var(--vp-c-brand-1);
  border-radius: 4px;
  padding: 0.6rem 0.8rem;
  background: var(--vp-c-bg-soft);
}

.grade-summary[data-verdict="fail"] {
  border-left-color: var(--vp-c-danger-1);
}

.grade-summary[data-verdict="needs-work"] {
  border-left-color: var(--vp-c-warning-1);
}

.grade-summary__meta {
  color: var(--vp-c-text-2);
  font-size: 0.85em;
}
</style>
