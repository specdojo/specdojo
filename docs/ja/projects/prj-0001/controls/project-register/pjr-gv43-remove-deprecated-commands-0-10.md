---
specdojo:
  id: prj-0001:pjr-gv43-remove-deprecated-commands-0-10
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
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

| No  | 作業                                   | 担当 | 状態 | メモ                                                                  |
| --- | -------------------------------------- | ---- | ---- | --------------------------------------------------------------------- |
| 1   | 使われ方を確かめて対応結果に書く       | DEV  | done | 対応結果の「使われ方の確認」に記載                                    |
| 2   | CLI の登録・実装・テストから消す       | DEV  | done | 9 コマンドと where の別名を削除。typecheck・lint:ts・test:unit が通過 |
| 3   | 文書を直す                             | DEV  | done | command-reference、各ガイド、rulebook、product 文書を修正             |
| 4   | CHANGELOG に書く事項を書き、検証を通す | DEV  | done | 対応結果の「CHANGELOG に書く事項」に記載。親の検証は runner が実行    |

## 5. 対応結果

### 5.1. CHANGELOG に書く事項

- 区分: 削除
- 文案: `timeline where`・`timeline build`・`exec note`・`exec link`・`exec estimate`・`exec migrate-records`・`grade migrate`・`register migrate`・`config migrate-members` を削除した。`exec`・`catalog`・`schedule`・`job`・`routine` の `where` の別名も削除した。代わりの操作は次のとおり。`specdojo where <種類>`（`where` の別名）、`dashboard build`（`timeline build`）、個票の対応結果や実行記録（`exec note`）、個票の `depends_on` やカタログ（`exec link`）、個票の `difficulty` と `priority`（`exec estimate`）。`exec migrate-records`・`grade migrate`・`register migrate`・`config migrate-members` に代わるコマンドはない。旧記録の移行は `git mv` で手で行い、agent 定義は `.specdojo/agent-members.yaml` へ直接記述する。

### 5.2. 使われ方の確認

- 対象: このリポジトリの `src`・`tools`・`templates`・`package.json`・`.specdojo`・routine の定義、`../specdojo-prj-0002` の `.specdojo` と `package.json`
- 結果: 9 コマンドと各 `where` の別名を呼ぶ箇所は、CLI の登録・警告文・テスト・文書以外になかった。`../specdojo-prj-0002` にも呼び出しはなかった。
- 例外: `src/shared/specdojo-config.ts` の members 読込エラーが `config migrate-members` を案内していたため、手作業での移動を案内する文言に変えた。

### 5.3. 実施内容

- 削除: `src/shared/where-alias.ts`、`src/exec/migrate-records.ts`、`src/register/migration.ts`、対応するテスト。`src/dashboard/timeline.ts` は `where timeline` が使う `printTimelinePaths` だけを残した。
- 削除: `exec note`・`link`・`estimate` の登録と、呼び出し元がなくなった `runSimpleEventCommand`。`migrateInlineGrades`、`migrateAgentMembers`、`renderTimelineOrderMarkdown` も削除した。
- 残した: `buildTimeline`・`renderCatalogScaffoldMarkdown`（dashboard が使う）、`where` の各種別の出力関数（`src/commands/where.ts`）。
- 警告の仕組み `src/shared/deprecation.ts` は、`timeline_path` と `tml-index.yaml` の警告で使うため残した。
- 文書: `command-reference.md`、`plan-result-lifecycle-guide.md`、`register-operation-guide.md`、`timeline-design-guide.md`、`tml-rulebook.md`、`pm-members-rulebook.md`、`clis-exec-commands.md`、`sysd-index.md` を直した。過去の版の移行ガイドは変えていない。
- 検証: `npm run typecheck`・`npm run lint:ts`（エラー 0）・`npm run test:unit`・`npm run lint:md` が通過した。

### 5.4. 残課題

- `src/register/migrate-timestamps.ts` と、register の依存関係にある `migrateEmbeddedRegisterEvents`・`migrateRegisterEventsFromGit` は、`register migrate` の削除で呼び出し元がなくなった。別の項目で削除を判断する。
- `src/exec/core.ts` のイベント型（`note`・`link`・`estimate`）は、既存のイベントファイルを読むため残した。

## 6. 関連ドキュメント

- PJR-BSCK（非推奨にした項目）
