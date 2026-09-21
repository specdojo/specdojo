---
specdojo:
  id: prj-0001:pjr-ywph-register-plan-grade-findings
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: low
  owner: DEV
  registered_at: "2026-09-21T03:59:49Z"
  due_on: "2026-10-15"
---

# PJR-YWPH register の todo 用 plan に関連文書の grade finding を展開する

## 1. 概要

PJR-XKKS で grade の結果と finding は成果物の本文コメントから `execution/grade/results/<doc-id>.yaml` のサイドカーへ移った。agent への finding 提示は plan 生成時の展開（`_GRADE_FINDINGS_`）に一本化したが、展開が入っているのは fully-guided と maintenance 系・bootstrap の exec テンプレート 6 本だけで、register の todo 用 plan（`xep-register-template`）にはない。

PJR-EQDB（Kata の finding 解消）の再周回では、オーケストレーターが個票に対象 Kata と finding 件数を転記して補った。result には「個票にて grade 指摘の内容を確認し」とあり、サイドカーを直接読んだ痕跡がなかった。register 項目で Kata や成果物の finding 解消を扱う場合に、同じ手当てを毎回人手で行うのは無駄である。

### 1.1. 決定事項

- register の todo 用 plan 生成で、個票の「関連ドキュメント」に wikilink された文書のうちサイドカーを持つものについて、`_GRADE_FINDINGS_` と同じ形式（severity / rule / line / anchor / message、id は渡さない）で finding を plan 本文へ展開する。
- 展開する文書数と finding 数に上限を設け（例: 文書 10 件、finding 各 20 件）、超過分は件数だけを示してサイドカーのパスを案内する。plan の遅延ロード性（PJR-JSWE）を保つ。
- サイドカーがない、または finding が 0 件の文書は「finding なし」として 1 行で示す。

## 2. 完了条件

- `exec plan --register` / `exec run --register` が生成する plan に、関連ドキュメントの finding が上記の形式と上限で展開されている。
- 展開の有無・上限・サイドカー未存在の扱いを単体テストで検証している。
- `xep-register-template` と `register-operation-guide` に展開の仕様が記載されている。
- `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                                                                                      | 担当 | 状態 | メモ                                              |
| --- | --------------------------------------------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------- |
| 1   | 個票の関連ドキュメントからサイドカーを解決し、上限付きで finding を展開する処理を `exec-plans` に追加する | DEV  | open | codex-expert-executor / gemma-reporter / worktree |
| 2   | `xep-register-template` に展開位置と扱いの指示を追加し、テストと guide を更新する                         | DEV  | open | 作業 1 と同一タスク                               |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-xkks-grade-sidecar]]
- [[prj-0001:pjr-eqdb-kata-cdfd-stsd-rulebook-findings]]
- [[prj-0001:pjr-jswe-agent-workflow-plan-vs-skills]]
- `src/exec-plans.ts`
- `docs/ja/specdojo/exec-templates/xep-register-template.md`
