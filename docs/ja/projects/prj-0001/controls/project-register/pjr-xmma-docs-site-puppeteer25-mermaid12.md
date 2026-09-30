---
specdojo:
  id: prj-0001:pjr-xmma-docs-site-puppeteer25-mermaid12
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: high
  owner: DEV
  registered_at: "2026-09-29T22:16:57Z"
  block_reason: "review で差し戻し: .manifest.json のファイル単位のスキップで SVG が描き直されず、テストが lint:ts に反するため作業 6 を追加して再実行する"
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
- ファイル単位のキャッシュ（`.manifest.json`）にも、描画に使った mermaid-cli の版と `mermaid-config.json` の内容のハッシュを記録する。今の値と異なる場合は、Markdown の mtime と size が一致していてもファイル単位のキャッシュを使わず、図を描き直す。
- 前回の `.manifest.json` と SVG が残っている状態で版または設定を変えると描き直されることを、単体テストで確かめる。テストは `npm run lint:ts` を通す（`any` と未使用の引数を使わない）。
- 変更後に `npm run docs:build` を実行すると、既存の SVG が mermaid-cli 12 で描き直される。
- devcontainer の `PUPPETEER_EXECUTABLE_PATH`（chromium-headless-shell）で `npm run docs:build` が通り、mermaid の SVG が生成される。
- 生成した SVG のうち 3 図以上を人が見て、更新前と同等であることを確かめている。
- `CHANGELOG.md` と v0.3.0 の移行ガイドに、Node 22.13 以上が必要になることが書かれている。
- `CHANGELOG.md` の「既知の問題」に、docs-site に残る脆弱性（mermaid 12 が使う chevrotain 11 が `lodash-es` 4.17.23 を固定する high 1 件と、vite 経由の `esbuild` の moderate）が上流の対応待ちであることが書かれている。

## 3. 作業内容

| No  | 作業                                                   | 担当         | 状態 | メモ                                                                                                                                                                                 |
| --- | ------------------------------------------------------ | ------------ | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | `package.json`・lockfile の更新と `engines` の引き上げ | orchestrator | done | `606744b2` で対応した。mermaid-cli 12 の要求に合わせ下限は 22.13 とした                                                                                                              |
| 2   | `gen-mermaid-svg.ts` と `mermaid-config.json` の手直し | DEV          | done | `mermaid-config.json` のルートに `layout: dagre` を追加した                                                                                                                          |
| 3   | CHANGELOG と移行ガイドへの追記                         | DEV          | done | `3d548005` で対応済み                                                                                                                                                                |
| 4   | 生成した SVG の見た目の確認                            | 人           | done | 2026-09-30 に利用者が mermaid 12 の見た目を確認し、問題なしと判断した                                                                                                                |
| 5   | SVG キャッシュの判定に mermaid-cli の版と設定を含める  | DEV          | done | `gen-mermaid-svg.ts` の `hashCode` に含めた。単体テストも追加して検証した                                                                                                            |
| 6   | ファイル単位のキャッシュにも版と設定を反映する         | DEV          | done | `.manifest.json` の各エントリに `mermaidCliVersion` と `mermaidConfigHash` を記録し、今の値と異なればスキップしないようにした。VitePress 側の SVG 名も同じ関数で求めるようにそろえた |

## 4. 対応結果

作業 2、3、5 を完了した。`gen-mermaid-svg.ts` の SVG 生成のキャッシュキーに `mermaid-cli` の版と `mermaid-config.json` の内容を含めるように修正し、設定や版が変わった際に SVG が再生成されることを保証する単体テストを追加した。作業 4（SVG の見た目の確認）は人が行う必要があるため `open` のまま残している。

作業 6 を完了した。

- `.manifest.json` の各エントリに、描画に使った mermaid-cli の版（`mermaidCliVersion`）と `mermaid-config.json` の内容の MD5（`mermaidConfigHash`）を記録するようにした。記録がない、または今の値と異なるエントリは、Markdown の mtime と size が一致していてもスキップせず、図を描き直す。
- 版と設定はエントリごとに記録する。dev のホットリロードで 1 ファイルだけを更新しても、ほかのエントリの判定がずれないようにするためである。
- 作業 5 で SVG 名に版と設定を含めた後も、VitePress の Markdown 描画（`.vitepress/config.mts`）は図のコードだけから SVG 名を求めていた。このため `npm run docs:build` が「`/mermaid/<hash>.svg` を解決できない」として失敗していた。生成側の関数を `mermaidSvgId` として公開し、描画側も同じ関数を使うようにそろえた。
- 単体テストでは次を確かめる。版と設定が同じなら `.manifest.json` を使い回す。前回の `.manifest.json` と SVG が残っていても、設定または版を変えると描き直し、古い SVG を消す。版と設定の記録がない旧形式のエントリも描き直す。描画側が参照する SVG 名は生成された SVG 名と一致する。テストは `any` と未使用の引数を使わない形に書き直し、`npm run lint:ts` を通る。
- devcontainer（`PUPPETEER_EXECUTABLE_PATH` は chromium-headless-shell）で `npm run docs:build` が通った。mermaid-cli 12.0.0 で 174 枚の SVG が生成された。この worktree には前回の `public/mermaid` がなかったため、既存の SVG が描き直される動きは実際のビルドでは確かめておらず、単体テストでだけ確かめた。

2026-09-30 の評価（orchestrator）:

- 作業 4: 利用者が mermaid 12 の見た目を確認し、問題なしと判断した。orchestrator も flowchart と stateDiagram を mermaid 11 と比べた。1 回目の実行は `"layout": "dagre"` を `flowchart` の中にだけ置いていたため stateDiagram の配置が変わっていたが、トップレベルに置いた後は mermaid 11 と同じ配置に戻った。
- 統合後の main の作業ツリーで、既存の 174 枚の SVG がすべて mermaid-cli 12.0.0 で描き直され、`.manifest.json` の全エントリに版と設定が記録された。続く `npm run docs:build` では描き直しが起きず、使い回された。
- `npm run lint:ts` と `npm run docs:build` が通過した。
- 経緯: 1 回目（agy）はキャッシュが版を見ておらず、2 回目（agy）は試しのテストファイルを残し、図単位のキャッシュだけを直して参照側とずれていた。3 回目は claude-expert-executor で、ファイル単位のキャッシュと参照側の不整合まで直した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-6tka-deps-in-range-update-dotenv18]]
