---
specdojo:
  id: prj-0001:pjr-tmaw-result-frontmatter-block-reason-yaml
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: medium
  owner: DEV
  registered_at: "2026-10-15T14:58:16Z"
  due_on: null
---

# PJR-TMAW result の frontmatter の block_reason に改行があると不正な YAML になる

## 1. 課題内容

exec-results.ts が frontmatter を文字列の連結で書き、block_reason を二重引用符で囲むだけのため、改行を含む理由の 2 行目以降が字下げされず YAML として不正になる。js-yaml 4 は読めたが 5 では deficient indentation で失敗し、3 件の過去の result が lint:fm で落ちる

## 2. 影響範囲

| 観点         | 影響                                                                                                                         |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | `src/exec-results.ts` の result の frontmatter の書き出し（`block_reason` ほか文字列の連結で書く項目）と、過去の result 3 件 |
| スケジュール | [[prj-0001:pjr-rcvs-js-yaml-5-migration]] の js-yaml 5 への版上げの前に直す                                                  |
| コスト       | js-yaml 5 では該当する result の frontmatter が読めず、lint:fm が失敗する。runner が result を読み直す処理も失敗しうる       |
| 品質         | 改行を含む `block_reason` を書くたびに、YAML として不正な frontmatter ができる                                               |
| 関係者       | exec と routine の利用者                                                                                                     |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `src/exec-results.ts` が `block_reason: "${safeReason}"` のように文字列を連結して書き、改行をエスケープしない。二重引用符の値が複数行になると、2 行目以降が字下げされず YAML の仕様に反する                         |
| 対応策   | frontmatter の文字列の値を、YAML として正しい形（`JSON.stringify` による二重引用符のエスケープ、またはリポジトリの `src/yaml.ts` の `dump`）で書く。過去の result 3 件の frontmatter を、値を変えずに正しい形へ直す |
| 依存事項 | なし                                                                                                                                                                                                                |
| 完了条件 | 下記の完了条件を満たす                                                                                                                                                                                              |

### 3.1. 完了条件

- `src/exec-results.ts` の frontmatter の書き出しで、改行・二重引用符・バックスラッシュ・コロンと空白の並びなどを含む文字列の値が、YAML として正しく書かれる。`block_reason` に加え、同じ関数で文字列を連結して書くほかの項目も確かめ、利用者や agent の入力が入りうる値は同じ扱いにする。
- 改行や二重引用符を含む `block_reason` を書き、`src/yaml.ts` の `load` と js-yaml の YAML 1.2 の既定の schema の両方で読み直して、元の値と一致することを確かめる単体テストを加える。
- 次の 3 件の result の frontmatter を、`block_reason` の値（改行を含む）を変えずに YAML として正しい形へ直す。履歴の記録であるため、本文と他の項目は変えない。
  - `docs/ja/projects/prj-0001/execution/exec/results/JBR-grade-deliverable-6df3fe1e1223-result.md`
  - `docs/ja/projects/prj-0001/execution/exec/results/JBR-grade-kata-b4b6eff81713-result.md`
  - `docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-PDCA-cdfd-check-010-result.md`
- `docs/ja/projects/` の result に、同じ形（二重引用符の値の 2 行目以降が字下げされていない frontmatter）が他に残っていないことを確かめ、result に書く。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。

## 4. 対応結果

`src/exec-results.ts` の result frontmatter 生成で、利用者や agent の入力が入りうる
文字列を YAML スカラーとして直列化するようにした。特に `block_reason` は、端末制御文字を
除去した後に JSON 互換の二重引用符形式で出力し、改行・二重引用符・バックスラッシュを
値を変えずに保持する。

改行・二重引用符・バックスラッシュ・コロンと空白を含む `block_reason` を、互換
ローダーと js-yaml の既定 schema の双方で読み戻す単体テストを追加した。過去 3 件の result の修復は、executor が worktree で行ったと報告したが、result は runner が管理する場所のため agent の変更が commit の対象にならず、統合（7a87be04a）には入らなかった。orchestrator が `feature/prj-0001/js-yaml-5` で、js-yaml 4 で読んだ値が変わらないことを確かめたうえで JSON の二重引用符形式へ直した（5d36efc20、merge 90b04fbdc）。`docs/ja/projects/` 配下を走査し、二重引用符の値の継続行が字下げされていない
同形の result が残っていないことも確認した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-rcvs-js-yaml-5-migration]]: 本件が見つかった版上げ。
