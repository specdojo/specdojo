---
specdojo:
  id: prj-0001:pjr-gv43-remove-deprecated-commands-0-10
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-20T23:57:32Z"
  derived_from:
    - PJR-BSCK
---

# PJR-GV43 0.10.0 で非推奨の 9 コマンドと where の別名を消す

## 1. 概要

PJR-BSCK で非推奨にした timeline where・timeline build・exec note・exec link・exec estimate・exec migrate-records・grade migrate・register migrate・config migrate-members と、各コマンドの where の別名を 0.10.0 で消す

## 2. 入力

- PJR-BSCK で 9 コマンドと where の別名を非推奨にし、help と実行時の警告に 0.10.0 で消すと書いた（2026-11-21 にビルド済みの CLI で確かめた）
- PJR-BSCK の完了条件「警告を出した版の次の版で消す（消す前に使われ方をもう一度確かめる）」を、利用者の判断でこの項目へ分けた

## 3. 完了条件

- 消す前に、次の場所で 9 コマンド（`timeline where`・`timeline build`・`exec note`・`exec link`・`exec estimate`・`exec migrate-records`・`grade migrate`・`register migrate`・`config migrate-members`）と各コマンドの `where` の別名の使われ方をもう一度確かめ、結果を個票の対応結果に書く。
  - このリポジトリの `src`・`tools`・`templates`・`package.json`・`.specdojo`・routine の定義
  - `../specdojo-prj-0002` の `.specdojo` と `package.json`
- 9 コマンドと `where` の別名を、CLI の登録・実装（`src/dashboard/timeline-build.ts`・`src/exec/migrate-records.ts`・`src/register/maintenance-commands.ts`・`src/grade/command-inspect.ts`・`src/shared/where-alias.ts`・`src/shared/specdojo-config.ts` など）・テストから消す。ほかのコマンドが使う関数は残す。
- 非推奨の警告の仕組み（`src/shared/deprecation.ts`）は、消した後もほかで使っていれば残し、使われなくなれば消す。どちらにしたかを対応結果に書く。
- 9 コマンドと別名に触れている文書（`docs/ja/specdojo/references/command-reference.md`・`docs/ja/specdojo/guides/` のガイド・`tml-rulebook`・`pm-members-rulebook` など）を直す。過去の版の移行ガイド（`release-v0-3-0-migration-guide.md` など）は、書かれた時点の記録として変えない。
- `CHANGELOG.md` は変えない。個票の対応結果の `### 5.1. CHANGELOG に書く事項` に、区分（削除）と行の文案を書く。消したコマンドと、代わりの操作を利用者向けに書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                   | 担当 | 状態 | メモ |
| --- | -------------------------------------- | ---- | ---- | ---- |
| 1   | 使われ方を確かめて対応結果に書く       | DEV  | open | -    |
| 2   | CLI の登録・実装・テストから消す       | DEV  | open | -    |
| 3   | 文書を直す                             | DEV  | open | -    |
| 4   | CHANGELOG に書く事項を書き、検証を通す | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
