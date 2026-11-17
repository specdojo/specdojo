---
specdojo:
  id: prj-0001:pjr-v0fq-exec-sequential-batch
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  owner: sol-executor
  registered_at: "2026-11-13T14:08:14Z"
  commit_type: feat
  commit_scope: exec
---

# PJR-V0FQ 複数の exec run・grade を順に流す仕組みを用意する

## 1. 概要

前の run が終わってから次の run・grade・ビルドを順に流し、前が失敗したら止めるか続けるかを選べるようにする（orchestrator のシェルスクリプトの置き換え）

## 2. 入力

- 2026-11-12〜13 の型の整備と夜間の実行で、orchestrator が手作業やシェルスクリプトで補った

## 3. 完了条件

- 複数の実行（`exec run --register`・`exec run --auto --track`・`exec resume --task`・`grade run`・`docs:build` などの検査）を、1 つの定義で順に流せる。定義は、既存の job（`docs/ja/projects/<project-id>/jobs/`）の形を広げるか、新しい種類を足すかを検討し、理由を書く。
- 各段で、前の段が失敗したときに止めるか続けるかを選べる。段の結果（成功・失敗・延期）と理由を、run の記録に残す。
- 前の実行が lock を持っている間は待ってから始め、待つ上限も決められる。完了の判定はログの文字列ではなく、終了コードと実行の状態で行う。
- **agent の種類に頼らない**：Claude Code の「後ろの処理が終わったら会話を再開する」機能などに頼らず、cron と routine（`routine run --due`）だけで最後まで動く。オーケストレーターが Claude Code・Codex・Antigravity のどれでも、同じ定義で同じに動く。
- 今回 orchestrator がシェルスクリプトで行った流れ（例: 止まったタスクの再開 → `--auto --track` のループ → 次の register 項目の実行）を、この仕組みの定義で書けることを確かめ、例として残す。
- 関連する設計・ガイド・CLI リファレンスを直している。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。
- 2 回目の実行（2026-11-17）: 1 回目は既存の command Job に `task.steps` を足す方式で作ったが、次の 2 点で親の検証が通らず、統合先（PJR-MJ8V の `src/exec/run/shared.ts` の変更）との同期もできなかったため、最新の develop から作り直す。
  - `src/job` から `src/exec` を import して `no-restricted-imports` に反した（`job` は `exec` を import しない）。共通の処理が要る場合は `src/shared` に置くか、`exec` 側から `job` を呼ぶ向きにする。
  - 失敗した段のある run の記録の `state` が `failed` にならず `running` のまま残った（`tests/src/exec/job-sequence.integration.test.ts`）。段の失敗・停止で run の状態を確定させる。

## 4. 作業内容

| No  | 作業                                       | 担当         | 状態 | メモ                                                                                                                     |
| --- | ------------------------------------------ | ------------ | ---- | ------------------------------------------------------------------------------------------------------------------------ |
| 1   | 定義方式と責務境界を決定                   | sol-executor | done | command Job の `task.steps` を採用。順序制御と lock は exec 側に実装                                                     |
| 2   | 定義・materialize・Run 記録・schema を実装 | sol-executor | done | 停止／継続、状態判定、有限待機、段の実行上限、失敗時の状態確定に対応                                                     |
| 3   | 回帰テストを追加                           | sol-executor | done | 定義の不正値、段の状態と evidence、retry、子 exec、lock・実行時間上限、YAML サンプル表示を対象化。実行は親 runner に委譲 |
| 4   | 設計・標準・運用ガイド・CLI・定義例を更新  | sol-executor | done | resume → auto track → register → grade → build と routine / cron の例を追加                                              |
| 5   | sandbox 内の検証と申し送りを記録           | sol-executor | done | build、CLI スモーク、定義例 schema、整形・文書検査。親検証は runner が実行                                               |

## 5. 対応結果

### 5.1. 実施内容と判断

- 既存の command Job を `task.command` または `task.steps` の排他指定へ拡張した。新しい種類では入力・冪等キー・attempt・routine の仕組みを重複させるため、既存 Job の拡張を選んだ。定義検証・凍結は `src/job`、順序制御・排他・evidence は `src/exec/run/job-sequence.ts` と `job-lock.ts` が担当し、禁止されている job → exec の import は追加していない。
- 各段の `on_failure` は自身の失敗・延期後に停止するか続行するかを表す。既定は停止。段の結果は `attempts[].steps` に逐次保存し、失敗・延期を含む Run は必ず `failed` に確定する。全段成功だけを成功とし、CLI は失敗を含めば 1、延期だけなら 75 を返す。段の evidence は attempt ごとに別の参照先を持つ。
- 完了判定は終了コードを基本に、必要な段で `completion` が指定する JSON / YAML / Markdown frontmatter の状態も確認する。ファイル・キー欠落、不正内容、未指定の状態は失敗。ログの成功文字列やプロセス名は使わない。
- sequence は project lock を排他的に保持し、`task.lock_wait_seconds`（既定3600秒）まで待機する。上限超過は全段を延期として記録し、precondition と agent を起動しない。同じ Run の二重起動を guard で拒否し、子 exec には既存の token 検証による lock 継承を使う。grade など別の lock を待つ段には `timeout_seconds` で処理を含む実行上限を指定でき、POSIX では時間超過時に子プロセス群を停止する。
- retry は保存済みの定義で先頭から再実行する方式を採用した。成功した前処理を飛ばす汎用規則は設けず、既存 resume・grade の安定した Run ID・冪等な検査を使う。旧 attempt の段の結果は保持する。
- 実 agent を呼ばない CLI スモークで、失敗時の停止／継続、状態による延期、実行時間上限、lock 待機上限、子 exec の lock 継承、`routine run --due` による完走を確認した。Git 未初期化の command Job でも evidence を残せるよう、Git 差分を取得できる場合だけ取得する処理にした。

### 5.2. 検証と後続確認

- 再開時の修正: 親検証で指摘された新ガイドの英語名・必須導入ブロックを補い、`job-sequence.yaml` を成果物型のないサンプルとして YAML 表示テストの全件一覧へ登録した。設計の責務表と標準の手順分類も `task.steps` に合わせた。
- 再開後の `npm run build`、定義例の schema 検査、既存9件の `job validate`、Prettier、catalog、履歴リンク、実行時 import の依存宣言検査は通過した。catalog には既存の警告がある。前回は定義例を一時 project へ配置した `job validate` と CLI dry-run で全段の解決を確認し、スモークで生成した Run JSON の schema 適合も確認した。単体・統合テストと lint・型検査・schema 全体検査は、pipeline の指定に従い親 runner が再実行し、その結果を最終根拠とする。
- 実 agent による resume → auto → register → grade の実行は利用枠を消費するため sandbox では起動していない。統合後、運用メモの手順で PJR-JSEY に本項目を加えて動作確認する。承認済みの実対象と provider 設定で定義例を実行し、同じ Run の retry も確認する。
- 保護された設定の変更案、未決定の設計判断はない。result は reporter / runner が executor evidence と本節の判断・検証・申し送りを反映する。

### 5.3. CHANGELOG に書く事項

- 追加: command Job の `task.steps` で exec・grade・ビルドを順次実行できる。段ごとの失敗時の停止／継続、終了コードと状態ファイルによる完了判定、有限の lock 待機、実行時間上限、attempt ごとの段の結果・理由・evidence を記録し、routine / cron から agent の会話機能に依存せず起動できる。

## 6. 関連ドキュメント

- [[prj-0001:sysd-job-execution|Job実行設計]]
- [[specdojo:job-definition-standard|Job 定義標準]]
- [[specdojo:routine-operation-guide|routine運用ガイド]]
- [[specdojo:command-reference|CLIコマンドリファレンス]]
- [[specdojo:job-sequence-guide|順次実行 Job の例]]
