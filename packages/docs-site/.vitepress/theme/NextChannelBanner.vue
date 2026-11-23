<script setup lang="ts">
// 開発中の版（SPECDOJO_DOCS_CHANNEL=next）だけに出す帯（PJR-98HS）。本番では何も描かない。
import { computed } from "vue";
import { useData } from "vitepress";

const { theme } = useData();
const isNext = computed(() => theme.value.specdojoChannel === "next");
const stableUrl = computed(
  () =>
    (theme.value.specdojoStableUrl as string | undefined) ?? "https://specdojo.github.io/specdojo/",
);
</script>

<template>
  <div v-if="isNext" class="next-channel-banner" role="note">
    これは開発中の版の文書です。まだリリースしていない機能を含みます。リリース済みの版は
    <a :href="stableUrl">こちら</a>です。
  </div>
</template>

<style scoped>
.next-channel-banner {
  padding: 8px 16px;
  font-size: 14px;
  line-height: 1.5;
  text-align: center;
  color: var(--vp-c-warning-1);
  background-color: var(--vp-c-warning-soft);
  border-bottom: 1px solid var(--vp-c-warning-2);
}

.next-channel-banner a {
  font-weight: 600;
  text-decoration: underline;
}
</style>
