---
specdojo:
  id: prj-0001:pjr-xmma-docs-site-puppeteer25-mermaid12
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  owner: DEV
  registered_at: "2026-09-29T22:16:57Z"
  block_reason: "review で差し戻し: SVG キャッシュが mermaid の版と設定を判定に含めず、更新が反映されないため作業 5 を追加して再実行する"
---

# PJR-XMMA docs-site の puppeteer 25 と mermaid-cli 12 への更新と Node 下限の引き上げ

## 1. 概要

high の脆弱性 extract-zip を除くため docs-site の puppeteer を 25、mermaid-cli を 12 に上げ、specdojo・docs-lint・docs-site の engines を Node 22.13 以上にそろえる（v0.3.0）

## 2. 完了条件

- `packages/docs-site` の `puppeteer` を `^25`、`@mermaid-js/mermaid-cli` を `^12` に上げ、`npm audit --omit=dev` の結果に `extract-zip` が含まれない（orchestrator が `606744b2` で対応済み。`package.json` と lockfile は変更しない）。
- specdojo 本体・docs-lint・docs-site の `engines.node` が `>=22.13` にそろっている（specdojo 本体には `engines` を追加する）。
- `packages/docs-site/mermaid-config.json` に `"layout": "dagre"` を明示し、mermaid 12 で既定になる elk へ図の見た目が変わらない。
- `src/gen-mermaid-svg.ts` の mermaid-cli の呼び出しが 12 の引数と整合している。
- `packages/docs-site/src/gen-mermaid-svg.ts` の SVG キャッシュの判定に、図のコードに加えて mermaid-cli の版と `mermaid-config.json` の内容を含める。mermaid-cli の版か設定が変わると、既存の SVG が使い回されず描き直される。
- 版または設定が変わったときに SVG を描き直すこと、変わらないときは使い回すことを確かめる単体テストがある。
- devcontainer の `PUPPETEER_EXECUTABLE_PATH`（chromium-headless-shell）で `npm run docs:build` が通り、mermaid の SVG が生成される。
- 生成した SVG のうち 3 図以上を人が見て、更新前と同等であることを確かめている。
- `CHANGELOG.md` と v0.3.0 の移行ガイドに、Node 22.13 以上が必要になることが書かれている。
- `CHANGELOG.md` の「既知の問題」に、docs-site に残る脆弱性（mermaid 12 が使う chevrotain 11 が `lodash-es` 4.17.23 を固定する high 1 件と、vite 経由の `esbuild` の moderate）が上流の対応待ちであることが書かれている。

## 3. 作業内容

| No  | 作業                                                   | 担当         | 状態 | メモ                                                                          |
| --- | ------------------------------------------------------ | ------------ | ---- | ----------------------------------------------------------------------------- |
| 1   | `package.json`・lockfile の更新と `engines` の引き上げ | orchestrator | done | `606744b2` で対応した。mermaid-cli 12 の要求に合わせ下限は 22.13 とした       |
| 2   | `gen-mermaid-svg.ts` と `mermaid-config.json` の手直し | DEV          | open | exec run で agent が行う                                                      |
| 3   | CHANGELOG と移行ガイドへの追記                         | DEV          | open | -                                                                             |
| 4   | 生成した SVG の見た目の確認                            | 人           | open | 3 図以上                                                                      |
| 5   | SVG キャッシュの判定に mermaid-cli の版と設定を含める  | DEV          | open | 2026-09-30 の評価で、版を上げても 174 枚が 1 枚も描き直されないことが分かった |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-6tka-deps-in-range-update-dotenv18]]
