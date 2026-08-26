---
specdojo:
  id: prj-0001:pjr-5yw6-agent-trial-base-and-reporter
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  owner: ARC
  registered_at: "2026-08-26T10:37:28Z"
  due_on: "2026-08-31"
  block_reason: "integrate failed: git commit -m exec(register PJR-5YW6): trialで完了済みtodoを起点に指定しreporterも比較できるようにする -- docs/ja/projects/prj-0001/controls/project-register/pjr-5yw6-agent-trial-base-and-reporter.md docs/…"
---

# PJR-5YW6 trialで完了済みtodoを起点に指定しreporterも比較できるようにする

## 1. 概要

PJR-NW9V で新設した exec trial には2つの制約がある。試行の起点が HEAD 固定のため、完了済みの todo を使うと作業が既に統合済みで比較にならない。また reporter は全試行で共有されるため、executor の差だけを切り出せる一方で LLM 全体の性能を比較できない。起点コミットを指定できるようにし、executor と reporter を組で指定する方式も選べるようにする。reporter の成否を客観指標として記録し、構造化出力を返せたかや形式リトライの回数を比較できるようにする。

## 2. 完了条件

- 試行の起点コミットを指定できる。指定しない場合は現在と同じく HEAD を起点とする。
- 完了済みの todo を課題として使える。その作業が統合される前のコミットを起点に指定すれば、agent は「まだ何もされていない状態」から plan を実行する。実際に統合された成果が正解として参照できるため、評価の基準に使える。
- 指定した起点と plan の組み合わせが妥当かを確認できる。plan が参照する成果物が起点時点に存在しない場合など、成立しない組み合わせを実行前に検出するか、少なくとも記録に残す。
- executor と reporter を組で指定できる。LLM 全体の性能を比較する用途に対応する。
- reporter を全試行で共有する現在の方式も残る。executor の差だけを切り出す用途に対応する。どちらの方式で実行したかが記録に残る。
- reporter の成否が客観指標として記録される。構造化出力を返せたか、形式リトライの回数、失敗理由の分類が比較できる。現在の指標は executor 側が中心である。
- 既存の `exec trial` の利用方法が壊れない。起点も reporter の指定方法も、省略時は現在と同じ動作になる。
- 実リポジトリの git 設定と履歴を変更しない。`core.bare` の変更や、テスト用フィクスチャのコミット混入を起こさない。git を扱うテストは一時ディレクトリで隔離した環境変数のもとで実行する。1回目の実行ではこれが守られず、メインリポジトリが bare 化して worktree を破棄した（PJR-A99J）。
- 規約や生成物の文言を変えた場合、既存テストの期待値が新しい仕様と整合していることを確認する。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit`、`npm run test:integration` が成功する。

### 調査済みの事実

- 起点の仕組みは実装済みである。`exec-trial.ts` が `baseCommit` を記録し（594行目で `rev-parse HEAD`）、worktree 作成時に `startPoint` として渡している（618行目）。現在は HEAD 固定であり、指定可能にするのが変更点である。
- `--reporter-by` の説明は「Shared reporter agent used to assess structured output」であり、全試行で共有する設計である。executor の差を切り出すには正しいが、LLM 全体の比較には対応しない。
- 比較の材料は既にある。PJR-0FCT を qwen で実行した際、executor は成功したが reporter は3回とも JSON でなく自然文を返した。所要時間は約53分である。同じ plan と起点で gemma を実行すれば直接比較できる。

## 3. 作業内容

| No  | 作業                                                       | 担当 | 状態 | メモ                               |
| --- | ---------------------------------------------------------- | ---- | ---- | ---------------------------------- |
| 1   | 試行の起点コミットを指定できるようにする                   | ARC  | done | `--base`を追加。省略時はHEAD       |
| 2   | 起点と plan の組み合わせが成立するかを確認できるようにする | ARC  | done | plan内の参照パスを起点ツリーと照合 |
| 3   | executor と reporter を組で指定する方式を追加する          | ARC  | done | `--pair executor=reporter`を追加   |
| 4   | reporter の成否を客観指標として記録する                    | ARC  | done | 状態、再試行回数、失敗分類を記録   |

## 4. 対応結果

- `exec trial run`へ`--base <revision>`を追加した。指定値を完全なcommitへ解決してworktreeの起点に使い、省略時は従来どおりHEADを使う。比較記録には指定値、解決済みcommit、実行開始時のHEADを統合済み成果の参照commitとして保存する。
- plan内でコード記法またはMarkdownリンクにより参照されたリポジトリ相対パスを抽出し、起点commitのツリーに存在するか実行前に確認する。plan自体の有無、参照パス別の結果、欠落一覧、警告を比較記録へ保存し、`status`でも表示する。古い起点にplan自体がなくても、現在指定したplan内容を全trialへ共通で渡す。
- 従来の`--agent`と任意の共有`--reporter-by`を維持し、代替指定として2組以上の`--pair <executor>=<reporter>...`を追加した。比較記録へ`reporter_mode`（`none` / `shared` / `paired`）を保存し、paired方式では組ごとに独立したtrial ID、worktree、branch、reporter commandを使う。
- reporterの客観指標へ状態、形式再試行回数、失敗分類を追加した。構造化出力、形式試行回数、outcome、失敗理由という既存情報に加え、`reported_blocked` / `invalid_output` / `invocation_failure` / `rate_limit`を区別できる。
- unit testへ従来の共有方式とreporterなし方式の互換性、paired方式の記録、plan参照パス抽出、reporter失敗分類の回帰ケースを追加した。CLIリファレンスとexec運用ガイドへ起点指定、互換性確認、2つのreporter指定方式、記録指標を反映した。
- 残課題はない。実リポジトリのGit状態を変更する処理は追加せず、既存の隔離済み`gitEnvironment()`とagent実行前後のGit状態検査を維持した。

## 5. 関連ドキュメント

- 拡張する仕組み: [[prj-0001:pjr-nw9v-agent-comparison-trial|PJR-NW9V 同一タスクを複数agentで試行し性能を比較できるようにする]]
- 比較材料となる実行: [[prj-0001:pjr-0fct-test-unit-rerun-after-fix|PJR-0FCT 共通規約のtest実行に関する記述の矛盾を解消する]]
- 生ログ保全（失敗理由の分類に使える）: [[prj-0001:pjr-kaqv-agent-raw-stderr-retention|PJR-KAQV agent失敗時の生のstderrを保全する]]
- exec の運用: [[specdojo:exec-operation-guide|exec運用ガイド]]
- 実装: `src/exec-trial.ts`
