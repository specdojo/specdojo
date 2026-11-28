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

/* ナビゲーションが固定される幅では、帯も固定して常にナビゲーションの上に出す（文書の流れからは外れる）。 */
@media (min-width: 960px) {
  .next-channel-banner {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: var(--vp-z-index-layout-top, 40);
  }
}

.next-channel-banner a {
  font-weight: 600;
  text-decoration: underline;
}
</style>

<style>
/*
 * VitePress は `--vp-layout-top-height` を、固定のナビゲーション・サイドバー・本文の余白（`.VPContent` の margin-top）と、
 * `.VPLocalNav` の padding-top の両方へ使う。帯を固定表示にして文書の流れから外し、本文のずれを帯の高さ 1 回分にそろえるため、
 * 960px 以上では local nav の padding-top を外し、sticky の位置へ帯の高さを足す。
 * 帯が無い版では変数が未設定（0px）になり、既定と同じ値になる。
 * VitePress の規則は scoped（`.VPLocalNav[data-v-…]`、詳細度 0,2,0）なので、`html .Layout > .VPLocalNav`（0,2,1）で上書きする。
 */
@media (min-width: 960px) {
  html .Layout > .VPLocalNav {
    padding-top: 0;
    top: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px));
  }
}
</style>
