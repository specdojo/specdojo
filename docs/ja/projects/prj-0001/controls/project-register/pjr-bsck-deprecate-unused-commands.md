---
specdojo:
  id: prj-0001:pjr-bsck-deprecate-unused-commands
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: low
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-16T11:00:14Z"
  due_on: null
  derived_from:
    - PJR-C5AF
  commit_type: refactor
  commit_scope: cli
---

# PJR-BSCK 使われていない・移行用・非推奨のコマンドを非推奨にし、次の版で消す

## 1. 概要

使われていない・移行用・非推奨のコマンドに非推奨の警告を出し、次の版で消す。コマンドの数を減らし、利用者が覚える範囲と保守の負担を小さくするため（PJR-C5AF）。

## 2. 入力

- PJR-C5AF の消す候補: timeline where・build、exec note・link・estimate、exec migrate-records・grade migrate・register migrate・config migrate-members
- 次の版で help と実行時に非推奨の警告を出し、代わりの操作を示す。その次の版で消す。消す前に、利用者のリポジトリとガイドでの使われ方をもう一度確かめる

## 3. 完了条件

- 対象のコマンドが、help と実行時に非推奨の警告と代わりの操作を出す。
- コマンドリファレンスとガイドに、非推奨と消す予定の版が書かれている。
- 警告を出した版の次の版で、対象のコマンドを消す（消す前に使われ方をもう一度確かめる）。
- `npm run check` と親の検証が通る。

## 4. 作業内容

| No  | 作業                             | 担当 | 状態 | メモ                                                                                                                       |
| --- | -------------------------------- | ---- | ---- | -------------------------------------------------------------------------------------------------------------------------- |
| 1   | 非推奨の警告と代わりの操作を足す | DEV  | done | 対象9コマンドの help description と実行時警告に非推奨・代わりの操作を実装                                                  |
| 2   | リファレンスとガイドを更新する   | DEV  | done | コマンドリファレンスおよび関連ガイド（timeline-design-guide、plan-result-lifecycle-guide、register-operation-guide）を更新 |
| 3   | 次の版で消す                     | DEV  | open | 次期マイナー版（0.10.0）で削除するため、本版（0.9.x）では非推奨警告と案内にとどめ open のまま残す                          |

## 5. 対応結果

PJR-C5AF で選定された使われていない・移行用・非推奨の 9 コマンドについて、help の description および実行時に非推奨警告（`warnDeprecated`）と代わりの操作を出力するように変更した。あわせて、コマンドリファレンスおよび関連ガイドに非推奨であることと削除予定の版（0.10.0）を明記した。

対象コマンドと代わりの操作:

1. `timeline where`: `specdojo where timeline` を使用（`where-alias.ts` で警告と削除予定版 0.10.0 を案内）
2. `timeline build`: `specdojo dashboard build` を使用し、ドメインと依存関係は register epic に移行
3. `exec note`: 個票の対応結果や実行記録にメモを直接記録
4. `exec link`: 個票の `depends_on` またはカタログで依存関係を宣言
5. `exec estimate`: 個票の `difficulty` や `priority` で見積もりを管理
6. `exec migrate-records`: 新形式の実行記録配置（`execution/runs/`）が標準のため移行操作は不要
7. `grade migrate`: 結果サイドカー（YAML）が標準形式のため、`grade run` を使用
8. `register migrate`: 個別個票ファイル（`pjr-*.md`）および外部イベントファイル（`events/*.yaml`）が標準形式のため移行操作は不要
9. `config migrate-members`: `.specdojo/agent-members.yaml` に直接 agent 定義を記述

作業 No 3（次の版で消す）は、利用者の移行期間を設けて次期マイナー版（0.10.0）で削除するため、本版では非推奨警告の追加にとどめ `open` として残す。削除の前に、利用者のリポジトリとガイドでの使われ方をもう一度確かめる。

`where` 別名の警告文を削除予定版（0.10.0）の表記へ変えたため、`tests/src/commands/where.integration.test.ts` の期待値を合わせた。

### 5.1. CHANGELOG に書く事項

- 区分: 変更
- 文案: 使われていない・移行用・非推奨の 9 コマンド（`timeline where`/`build`、`exec note`/`link`/`estimate`、`exec migrate-records`、`grade migrate`、`register migrate`、`config migrate-members`）を非推奨にし、help と実行時に代わりの操作と削除予定版（0.10.0）の警告を出すように変更

## 6. 関連ドキュメント

- [[prj-0001:pjr-c5af-command-inventory]]
