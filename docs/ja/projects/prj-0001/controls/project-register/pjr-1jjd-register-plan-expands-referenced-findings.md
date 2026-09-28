---
specdojo:
  id: prj-0001:pjr-1jjd-register-plan-expands-referenced-findings
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: high
  owner: DEV
  registered_at: "2026-09-28T22:13:15Z"
---

# PJR-1JJD register の plan が関連ドキュメントとして参照しただけの文書の grade finding を解消対象に展開する

## 1. 課題内容

register 項目の plan（`xep-register-template.md` の「grade result から展開された finding」）は、`src/exec-plans.ts` の `registerGradeFindingsText` が生成する。この関数は、個票の「関連ドキュメント」の章にある wikilink をすべて対象とし、各文書の grade の finding を展開して「viewpoint ID の判定根拠に照らして解消する」と指示する。

個票の「関連ドキュメント」は、作業の対象ではなく、根拠や参考として文書を挙げる場所としても使われている。そのため、参考として挙げた文書の finding まで executor が解消しにいく。

| 項目     | 関連ドキュメントに挙げた文書 | 起きたこと                                                                                                                                                                                                                                           |
| -------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PJR-XW9M | `[[specdojo:pjr-rulebook]]`  | codex-expert-executor が対象ファイルを書けなかった代わりに、pjr-rulebook の finding を解消する変更（rulebook frontmatter の schema、`src/kata.ts`）を worktree に残した。利用者の承認で破棄                                                          |
| PJR-T2M6 | `[[specdojo:pjr-rulebook]]`  | codex-expert-executor が pjr-rulebook の finding（major 3、minor 3）を解消するため `template_dispatch` を新設し、schema・`src/kata.ts`・`register add`・pjr-rulebook・作成標準まで変えて develop に統合された。orchestrator が取り除いた（c9948957） |

## 2. 影響範囲

| 観点         | 影響                                                                                                                                   |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | register 由来のすべてのタスク。関連ドキュメントに kata や設計書を挙げた個票                                                            |
| スケジュール | 範囲外の変更の確認と取り除きに手間がかかる                                                                                             |
| コスト       | executor の作業量と agent 利用枠の増加                                                                                                 |
| 品質         | 承認されていない設計変更が develop に入る。register 由来タスクの commit は許可リストで絞っていないため、既存ファイルの変更は止まらない |
| 関係者       | 個票を書く利用者、orchestrator                                                                                                         |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                   |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | finding を展開する対象を、個票の「関連ドキュメント」の wikilink から導いている。作業の対象と参考資料を区別していない                                                                                                                                                   |
| 対応策   | finding を展開する対象を、個票 frontmatter の `targets`（PJR-6WFA で導入した作業対象の宣言）に限る。`targets` がない個票では展開しない。関連ドキュメントは参考として plan に載せるだけにし、解消の指示を付けない                                                       |
| 依存事項 | PJR-6WFA（個票の `targets`）                                                                                                                                                                                                                                           |
| 完了条件 | `targets` に含まれない文書の finding が plan に展開されないことを単体テストで確認する。`targets` に含まれる文書の finding は従来どおり展開される。`register-operation-guide.md` に、`targets` と関連ドキュメントの役割の違いが書かれている。`npm run check` が成功する |

## 4. 対応結果

- `registerGradeFindingsText` が finding を展開する対象を、「関連ドキュメント」の wikilink ではなく個票 Frontmatter の `targets` に変更した。
- `targets` がない個票では finding を展開せず、関連ドキュメントにあるだけの文書を解消対象にしないようにした。
- `targets` に含まれる文書の展開、含まれない関連文書の除外、`targets` 未宣言、文書数・finding 数の上限を単体テストで確認できるようにした。
- `register-operation-guide.md` に、`targets` は変更対象、関連ドキュメントは根拠や参考への導線であるという役割の違いを追記した。

## 5. 関連ドキュメント

- `src/exec-plans.ts`（`registerGradeFindingsText`）、`docs/ja/specdojo/exec-templates/xep-register-template.md`
- PJR-XW9M、PJR-T2M6（発生した項目）、PJR-6WFA（個票の `targets`）
