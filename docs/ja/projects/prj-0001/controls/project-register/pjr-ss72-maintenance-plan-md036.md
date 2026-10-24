---
specdojo:
  id: prj-0001:pjr-ss72-maintenance-plan-md036
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-24T13:41:02Z"
  due_on: "2026-10-31"
---

# PJR-SS72 rulebook-maintenance の plan が markdownlint（MD036）で止まる

## 1. 課題内容

カタログと pm-roles のない利用者の project で、kata の見直しの plan のレビュー観点の欄が `_MISSING_` だけの段落になり、着手の checkpoint の commit が hook の markdownlint（MD036）で止まる。

- 起きた条件: specdojo 0.4.5。`catalog_path` と `pm-roles.yaml` がない。owner は BA、approach は `rulebook-maintenance`、対象は利用者の kata（`edu-scratch:lsd-rulebook`）。
- 起きたこと: worktree での着手の checkpoint（`exec(register <PJR-ID>): start`）の commit が hook の markdownlint で失敗し、項目が `waiting` になった。作業ツリーでの待ち状態の記帳の commit も同じ plan を含めて失敗し、記帳が作業ツリーに残った。
- エラー: `plans/<stem>-plan.md:51 error MD036/no-emphasis-as-heading Emphasis used instead of a heading [Context: "MISSING"]`
- 報告元: 利用者の project（coderdojo-lessons-specdojo の prj-0001）のPJR-BC1Z（派生元 PJR-BR5A）。

## 2. 影響範囲

| 観点         | 影響                                                                                                       |
| ------------ | ---------------------------------------------------------------------------------------------------------- |
| スコープ     | カタログか role の観点を持たない利用者の project で、kata の見直しの approach（`*-maintenance`）を使えない |
| スケジュール | 利用者は approach を外した todo として流し直す必要がある                                                   |
| コスト       | 原因の調査と、待ち状態の記帳・残ったファイルの手作業での片付けが要る                                       |
| 品質         | approach を外すと見直しの手順が plan に入らず、個票の完了条件で補う必要がある                              |
| 関係者       | kata を見直す利用者                                                                                        |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | `xep-rulebook-maintenance-template.md` の「このロールが重視するレビュー観点:」の下で `_OWNER_ROLE_VIEWPOINTS_` が単独の段落になっている。`ownerRoleFields`（`src/exec/plans-core.ts`）は、owner の role に当てはまる観点がないと `MISSING` を返すため、段落が `_MISSING_` だけになる（報告時の見立て） |
| 対応策   | 観点や責務がないときも、plan が markdownlint を通るようにする。例: 「該当する観点なし」と書く、または `_MISSING_` をリストの項目にする。ほかの maintenance の雛形も同じ形かを確かめる                                                                                                                  |
| 依存事項 | なし                                                                                                                                                                                                                                                                                                   |
| 完了条件 | カタログと pm-roles のない project で、`*-maintenance` の plan が markdownlint を通り、着手の checkpoint を通る。この条件を確かめる test がある                                                                                                                                                        |

### 3.1. 完了条件（追記）

- v0.4.6 の範囲とする（2026-10-24、利用者が承認）。上の表の完了条件を満たす。
- `rulebook-maintenance`・`recipe-maintenance`・`sample-maintenance`・`template-maintenance` と `<種類>-authoring` の plan の雛形のすべてで、観点や責務の欄が空のとき（`_MISSING_` になるとき）にも、markdownlint を通る形になる。どの雛形を直したかを result に書く。
- 単体テストで、カタログと pm-roles のない project の `*-maintenance` の plan が markdownlint を通ることを確かめる。
- plan の生成を変えるため、統合の後に `exec run --register` を 1 回流して動作を確かめる（PJR-JSEY）。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [Unreleased]` の節に書く（なければ作る）。

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- 報告元: 利用者の project（coderdojo-lessons-specdojo の prj-0001）のPJR-BC1Z
