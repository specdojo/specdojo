// VitePress は固定のナビゲーション・サイドバー・本文を `--vp-layout-top-height` の分だけ下げる。
// `layout-top` の slot に置いた要素は、この変数へ高さを反映しないと広い画面でナビゲーションに隠れる。

export const LAYOUT_TOP_HEIGHT_VAR = "--vp-layout-top-height";

// VitePress がナビゲーションを固定表示にする幅。これ未満では `position: relative` のため、
// 変数を設定すると帯の分だけ二重に下がって空白ができる。
export const FIXED_NAV_MEDIA_QUERY = "(min-width: 960px)";

export interface StyleTarget {
  style: {
    setProperty(name: string, value: string): void;
    removeProperty(name: string): string;
  };
}

export function applyLayoutTopHeight(
  root: StyleTarget,
  height: number,
  isFixedNav: boolean = true,
): void {
  if (isFixedNav && height > 0) {
    root.style.setProperty(LAYOUT_TOP_HEIGHT_VAR, `${Math.ceil(height)}px`);
    return;
  }
  root.style.removeProperty(LAYOUT_TOP_HEIGHT_VAR);
}

export function clearLayoutTopHeight(root: StyleTarget): void {
  root.style.removeProperty(LAYOUT_TOP_HEIGHT_VAR);
}
