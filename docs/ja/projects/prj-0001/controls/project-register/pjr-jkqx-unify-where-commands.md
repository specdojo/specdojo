---
specdojo:
  id: prj-0001:pjr-jkqx-unify-where-commands
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
  registered_at: "2026-11-16T11:00:17Z"
  due_on: null
  derived_from:
    - PJR-C5AF
  commit_type: refactor
  commit_scope: cli
---

# PJR-JKQX 場所を表示する where を 1 つのコマンドにまとめる

## 1. 概要

場所を表示する 6 つの where を 1 つのコマンドにまとめる。同じ種類の操作が系統ごとに分かれて数を増やしているため（PJR-C5AF）。

## 2. 入力

- PJR-C5AF のまとめる候補: exec・catalog・schedule・timeline・job・routine の where（6 つ）を、specdojo where `<種類>` か project の下の 1 つにまとめる。古いものは非推奨の別名として 1 版残す

## 3. 完了条件

- 場所を表示する操作が 1 つのコマンドで行え、種類を引数で選べる。
- 古い 6 つの where は非推奨の別名として 1 版残り、警告を出す。
- リファレンス・ガイド・オーケストレーターの定義が新しいコマンドを使う。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。影響がなければ「なし」と書く（PJR-EPQ3）。
- `npm run check` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                 | 担当 | 状態 | メモ                                                                                                             |
| --- | ------------------------------------ | ---- | ---- | ---------------------------------------------------------------------------------------------------------------- |
| 1   | まとめたコマンドの形を決めて実装する | DEV  | done | `where <kind>` を追加し、6種類の既存処理を共有した                                                               |
| 2   | 古い where を非推奨の別名にする      | DEV  | done | 1版の互換入口として残し、標準エラーへ移行先と削除予定を警告する。通常のヘルプからは隠した                        |
| 3   | 文書を更新する                       | DEV  | done | リファレンス・ガイド・CLI仕様・オーケストレーター設計と配布用 OpenCode 定義を更新。保護設定の案は第5章に記録した |

## 5. 対応結果

### 5.1. 実装と判断

- `specdojo where <kind> --project <id>` を採用した。種類は `exec`・`catalog`・`schedule`・`timeline`・`job`・`routine`。保存先の照会は系統に共通する操作なので、project 配下にさらに階層を増やさず、最上位に集約した。
- 各系統の表示処理を関数として取り出し、新入口と旧入口で共有した。標準出力、設定不足・未知の project のエラー、終了コード、種類ごとの project 解決を維持する。引数なし・未知の種類は Commander が拒否する。
- 旧6入口は導入する版の1版だけ残し、次の版で削除する。警告は既存の `warnDeprecated` を使い、標準エラーへ移行先と削除予定を表示する。通常のヘルプでは新入口へ誘導するため旧入口を隠す。
- [[specdojo:command-reference|CLIコマンドリファレンス]]、[[specdojo:waza-guide|遂行の技活用ガイド]]、[[specdojo:routine-operation-guide|routine運用ガイド]]、[[clis-exec-commands|CLI仕様（exec コマンド群）]]、[[sysd-orchestrator-agent-settings|オーケストレーター設定]] を新構文へ更新した。配布用 `templates/opencode/agents/specdojo-orchestrator.md` の許可も `specdojo where *` へ置き換えた。

### 5.2. 保護設定への変更案

保護された設定は変更していない。完了条件の例外規定に従い、次の案を利用者の承認後に feature ブランチで反映する。

1. `.agents/specdojo-orchestrator.agent.md` のコマンド地図に「保存先の確認 / `where` / `where <kind> --project <project-id>`」の行を追加する。読み取り系の説明でも `where <kind>` を使う。
2. `.opencode/agents/gemma-orchestrator.md` と `.opencode/agents/qwen-orchestrator.md` の `permission.bash` で、`"specdojo exec where*": allow` を `"specdojo where *": allow` へ置き換える。配布テンプレートの許可は本タスクで更新済みである。
3. `npm run orchestrator:sync` で SSOT 本文を全ラッパー・配布テンプレートへ同期し、`npm run lint:orchestrator-sync` で一致を確認する。同期は frontmatter を保持するため、手順2の許可は別途反映する。

### 5.3. 検証

- 一時 fixture で6種類の新旧入口を直接起動し、標準出力・終了コードの一致、旧入口だけの標準エラーへの警告、引数不足・未知の種類・未知の project の非0終了を確認した。子プロセス起動は sandbox で `EPERM` になるため、手動確認は同一プロセスで Commander に入力した。
- `tests/src/commands/where.integration.test.ts` に実CLIの回帰テストを追加した。新旧入口の互換性、設定不足、project の環境変数と明示指定、ファイル一覧、照会時にファイルを作らないこと、ヘルプを検証する。実行は親 runner の `test-integration` に委ねる。
- 変更ファイルの Prettier 整形、`npm run check:src-imports`、`node --import tsx tools/catalog-validate-if-configured.mjs`、`npm run validate:history-links`、`npm run lint:orchestrator-sync` は通過した。catalog の既存文書未作成・再エクスポートの参照に関する警告は残るがエラーはない。
- `npm run check` のうち、型検査・lint・schema・単体／統合テストは pipeline の重複実行禁止に従って親 runner に委ねる。残りの検査は上記のとおり executor が実施した。集約コマンド `npm run check` 自体の通過確認は runner またはホスト側で行う。

### 5.4. CHANGELOG に書く事項

- 追加: `specdojo where <kind>` で exec・catalog・schedule・timeline・job・routine の保存先を確認できるようにした。
- 変更: 旧 `<kind> where` は1版の移行期間中だけ互換入口として残し、標準エラーへ新構文と削除予定を警告する。通常のヘルプ・利用文書は新構文を案内する。

## 6. 関連ドキュメント

- [[prj-0001:pjr-c5af-command-inventory]]
