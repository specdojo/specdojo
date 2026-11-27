// VitePress は固定のナビゲーション・サイドバー・本文を `--vp-layout-top-height` の分だけ下げる。
// `layout-top` の slot に置いた要素は、この変数へ高さを反映しないと広い画面でナビゲーションに隠れる。

export const LAYOUT_TOP_HEIGHT_VAR = "--vp-layout-top-height";

export interface StyleTarget {
  style: {
    setProperty(name: string, value: string): void;
    removeProperty(name: string): string;
  };
}

export function applyLayoutTopHeight(root: StyleTarget, height: number): void {
  if (height > 0) {
    root.style.setProperty(LAYOUT_TOP_HEIGHT_VAR, `${Math.ceil(height)}px`);
    return;
  }
  root.style.removeProperty(LAYOUT_TOP_HEIGHT_VAR);
}

export function clearLayoutTopHeight(root: StyleTarget): void {
  root.style.removeProperty(LAYOUT_TOP_HEIGHT_VAR);
}
