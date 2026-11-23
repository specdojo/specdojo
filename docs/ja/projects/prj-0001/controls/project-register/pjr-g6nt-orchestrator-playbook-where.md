---
specdojo:
  id: prj-0001:pjr-g6nt-orchestrator-playbook-where
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-23T02:38:54Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-2P7C
  depends_on:
    - PJR-9170
  commit_type: feat
  commit_scope: config
---

# PJR-G6NT 運用メモの雛形と specdojo where playbook を足し、指示の本文の案を書く

## 1. 概要

運用メモの雛形を作れるようにし、where で場所を引けるようにする。オーケストレーターの指示の本文を、where で引いた運用メモを読む形に直す案を書く

## 2. 入力

- 利用者の問い（2026-11-23）: オーケストレーターのプロジェクトごとの知見を playbook にまとめているが、正式な機能か。オーケストレーターの答えは、正式ではない（型・置き場所・見つけ方が決まっていない）

## 3. 完了条件

- PJR-2P7C の決定に従い、運用メモの雛形を作れるようにし（`register scaffold` と同じ形、または `config scaffold` の一部）、`specdojo where playbook --project <id>` で場所を引けるようにする。置き場所の既定と、設定で変えられるかを決め、設定リファレンスに書く。
- オーケストレーターの指示の本文（SSOT と各環境の薄いラッパー）を、「`specdojo where playbook` で引いた運用メモがあれば、作業を始める前に読む」に直す案を書く。指示の本文と `CLAUDE.md`・`AGENTS.md` は保護された設定のため、案を個票の対応結果と報告の `handoff` に書き、反映は利用者の承認のもとでオーケストレーターが行う。
- prj-0001 の今の運用メモが、雛形の置き場所の既定と食い違う場合の移し方を書く。
- 単体テストを足す（`where playbook` の解決、雛形の作成）。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json`・`CLAUDE.md`・`AGENTS.md`・`templates/` の agent の定義など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- 関連する設計・ガイド・CLI リファレンスを直す。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                                                  | 担当 | 状態 | メモ                                                                                        |
| --- | --------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------------------------------------------------- |
| 1   | `playbook_path`（設定）・`where playbook`・`playbook scaffold` の実装 | BA   | done | `src/project/playbook.ts` を新設し、`where` と CLI 入口へ接続した。                         |
| 2   | 単体テストと統合テストの追加                                          | BA   | done | `tests/src/project/playbook.test.ts` を新設し、`where` の統合テストへ `playbook` を足した。 |
| 3   | 設定リファレンス・コマンドリファレンスの更新                          | BA   | done | `playbook_path` の既定と変更方法、`where playbook`、`playbook scaffold` を書いた。          |
| 4   | 指示の本文の案・移し方・CHANGELOG の文案を対応結果へ記載              | BA   | done | 保護された設定のため案のみ。反映は利用者の承認のもとでオーケストレーターが行う。            |
| 5   | `npm run typecheck`・`lint:ts`・`test:unit`・`lint:md` の実行         | BA   | open | 親 runner が実行する検証のため executor は流さない（`lint:ts` の error 0 は確認済み）。     |

## 5. 対応結果

### 5.1. 実施内容

- 設定 `playbook_path`（任意、`base_path` からの相対のファイルパス）を足した。スキーマ `specdojo-config.schema.yaml` にも反映した。
- 既定の置き場所は `030-project-management/pm-orchestrator-playbook.md`（`base_path` 配下）とした。prj-0001 の今の置き場所と一致するため、prj-0001 は設定を足さずにそのまま引ける。
- `specdojo where playbook --project <id>` は、`project:` と `playbook:` の 2 行を表示する。ファイルがなければ `(does not exist)` を付け、終了コード 0 で終わる。指示の本文は「あれば読む」なので、無いことは失敗にしない。
- `specdojo playbook scaffold --project <id> [--dry-run]` は、`where playbook` のパスへ template（`pm-orchestrator-playbook-template`）から雛形を作る。`_PROJECT_ID_` と `_PROJECT_NAME_` をプロジェクト ID に置き換える。既存のファイルは上書きせず失敗する。
- 設定リファレンスとコマンドリファレンス（`where` の節と新設の運用メモの雛形の節）を直した。

### 5.2. 決めた内容と理由

- 雛形の作り方は、`config scaffold` の一部ではなく独立した `playbook scaffold` にした。`config` は `.specdojo/` の設定を扱うコマンドで、文書の生成とは責務が違うため。`register scaffold` と同じく project の解決は `--project`・`SPECDOJO_PROJECT`・`current_project` の順。
- `_PROJECT_NAME_` はプロジェクト名の設定が無いため、プロジェクト ID で埋める。
- 設定は `base_path` 基準の相対パス 1 キー。既定を持たせたのは、設定なしで別のプロジェクトでも同じ場所に残せるようにするため。

### 5.3. 指示の本文の案

対象は `.agents/specdojo-orchestrator.agent.md`（SSOT）と各環境の薄いラッパー。本文は 4 つのラッパーとバイト一致で保つ。次の 1 行を差し替える。

現状:

```text
- プロジェクトの文書にオーケストレーター向けの運用メモがあれば、作業を始める前に読む。
```

案:

```text
- 作業を始める前に `specdojo where playbook --project <id>` を実行する。表示されたパスにファイルがあれば（`(does not exist)` が付かなければ）、そのオーケストレーター運用メモを読む。無ければ読まずに進める。運用メモの雛形は `specdojo playbook scaffold` で作れる。
```

`CLAUDE.md` と `AGENTS.md` の 11 行目（prj-0001 の運用メモのパスを直接書いた行）は、反映後に次へ差し替えるか削除できる。

```text
- prj-0001 を扱う対話型オーケストレーターは、作業の前に `specdojo where playbook --project prj-0001` で引いた運用メモを読む。
```

### 5.4. 今の運用メモの移し方

- prj-0001 の運用メモは `030-project-management/pm-orchestrator-playbook.md` にあり、既定と食い違わない。移す作業は要らない。
- 別のプロジェクトで既存の運用メモが既定と違う場所にある場合は、次のどちらかにする。
  - 設定を足す: `.specdojo/specdojo.config.json` の該当 project へ `"playbook_path": "<base_path からの相対パス>"` を足す（保護された設定のため、利用者の承認のもとで行う）。
  - ファイルを移す: 既定のパスへ `git mv` し、文書 ID（`<project>:pm-orchestrator-playbook`）は変えない。ID を変えないので、`[[id]]` の参照は直さなくてよい。直接パスを書いた `CLAUDE.md` などの参照だけ直す。
- 運用メモがまだ無いプロジェクトは `specdojo playbook scaffold` で作る。

### 5.5. CHANGELOG に書く事項

- 区分: Added（v0.10.0）
- 行の文案: `specdojo where playbook` と `specdojo playbook scaffold` を追加。オーケストレーターの運用メモの場所を設定 `playbook_path`（既定 `030-project-management/pm-orchestrator-playbook.md`）から引き、雛形を作れるようにした。

### 5.6. 残課題

- 指示の本文（SSOT と 4 つのラッパー）と `CLAUDE.md`・`AGENTS.md` の反映は、利用者の承認のもとでオーケストレーターが行う。
- 作業内容 No.5 は親 runner の検証。

## 6. 関連ドキュメント

- [[prj-0001:pjr-2p7c-orchestrator-playbook-kata]]
- [[specdojo:pm-orchestrator-playbook-rulebook]]
- [[specdojo:pm-orchestrator-playbook-template]]
- [[specdojo:command-reference]]
- [[specdojo:specdojo-config-reference]]
