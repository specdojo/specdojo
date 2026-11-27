<script setup lang="ts">
// 開発中の版（SPECDOJO_DOCS_CHANNEL=next）だけに出す帯（PJR-98HS）。本番では何も描かない。
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useData } from "vitepress";
import {
  applyLayoutTopHeight,
  clearLayoutTopHeight,
  FIXED_NAV_MEDIA_QUERY,
} from "./layout-top-height";

const { theme } = useData();
const isNext = computed(() => theme.value.specdojoChannel === "next");
const stableUrl = computed(
  () =>
    (theme.value.specdojoStableUrl as string | undefined) ?? "https://specdojo.github.io/specdojo/",
);

// 帯の実測の高さ（折り返しで変わる）を VitePress の `--vp-layout-top-height` へ反映する。
const banner = ref<HTMLElement | null>(null);
let observer: ResizeObserver | undefined;
let media: MediaQueryList | undefined;
let onMediaChange: (() => void) | undefined;

function stopObserving(): void {
  observer?.disconnect();
  observer = undefined;
  if (media && onMediaChange) media.removeEventListener("change", onMediaChange);
  media = undefined;
  onMediaChange = undefined;
  if (typeof document !== "undefined") clearLayoutTopHeight(document.documentElement);
}

watch(banner, (element) => {
  stopObserving();
  if (!element || typeof ResizeObserver === "undefined") return;
  const root = document.documentElement;
  const query = window.matchMedia(FIXED_NAV_MEDIA_QUERY);
  const update = (): void =>
    applyLayoutTopHeight(root, element.getBoundingClientRect().height, query.matches);
  update();
  media = query;
  onMediaChange = update;
  query.addEventListener("change", update);
  observer = new ResizeObserver(update);
  observer.observe(element);
});

onBeforeUnmount(stopObserving);
</script>

<template>
  <div v-if="isNext" ref="banner" class="next-channel-banner" role="note">
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
