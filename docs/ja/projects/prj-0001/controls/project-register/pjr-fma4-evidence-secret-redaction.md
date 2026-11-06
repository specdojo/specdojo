---
specdojo:
  id: prj-0001:pjr-fma4-evidence-secret-redaction
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  registered_at: "2026-11-05T22:17:51Z"
  derived_from:
    - PJR-2WC2
---

# PJR-FMA4 実行記録へ書く前の伏せ字を広げ、秘密の混入を検査する

## 1. 概要

生のログを全文残すため、redactSensitiveText の対象を広げ、commit の hook か CI で実行記録への秘密の混入を検査する

## 2. 入力

- 由来: PJR-2WC2 で生のログを全文 Git に残すと決めた。push 先は github.com/specdojo/specdojo で、記録は push される（2026-11-06）
- orchestrator の調査: 追跡中の実行記録（evidence 3,099 件と plans・results・trials・events）に API キー・トークン・秘密鍵・個人のメールアドレスは見つからなかった。`[REDACTED]` は 1 件（2026-11-06）
- orchestrator の調査: `src/shared/text.ts` の `redactSensitiveText` が伏せるのは `Bearer …`、`sk-…`・`gh?_…`、`password=…` などの「名前=値」だけ。AWS・Google・Slack のキー、JWT、秘密鍵、URL に埋め込まれた認証情報は対象外（2026-11-06）
- 委任: 検査に gitleaks などの道具を使うか自前の検査を足すかは executor が選び、理由を個票の対応結果に記録する。`package.json` や hook の設定など保護された設定の変更は、案を個票の対応結果に書き、反映は利用者の承認のもとで行う（2026-11-06）

## 3. 完了条件

- `src/shared/text.ts` の `redactSensitiveText` が、既存の形式に加えて次を伏せ字にする: AWS のアクセスキー（`AKIA`・`ASIA` で始まる 20 文字）、Google の API キー（`AIza` で始まる 39 文字）、Slack のトークン（`xox` で始まる形式）、GitHub の fine-grained token（`github_pat_`）、JWT（`eyJ` で始まる 3 区画）、秘密鍵の PEM ブロック（`BEGIN … PRIVATE KEY` から `END … PRIVATE KEY` まで全体）、URL に埋め込まれた認証情報（`https://user:pass@host` の `user:pass`）、Anthropic の `sk-ant-` 形式。
- 単体テストを足す。形式ごとに伏せ字になること、伏せ字の後に元の値が残らないこと、語の一部（例: `task-judgement`、`risk-assessment`）や通常の URL を伏せ字にしないことを確かめる。
- 実行記録に秘密が入っていないかを調べる検査のスクリプトを足す。入口は依存のない環境（`node_modules` のない linked worktree）でも動く plain JS（`.mjs`）とし、指定したファイル（hook では staged のファイル）を調べ、見つけたら終了コード 1 でファイル・行・種類を出す。値そのものは出力しない。
- 検査の形式の定義は `redactSensitiveText` と同じ正本から取るか、二重に持つ場合は両者の一致をテストで確かめる。どちらにするかは executor が決め、理由を個票の対応結果に書く。gitleaks などの外部の道具を使うかも executor が決め、理由を書く。
- 追跡中の実行記録（`docs/ja/projects/prj-0001/execution/` 配下）に検査を実行し、検出が 0 件であること（または検出があれば、ファイルと種類だけ）を個票の対応結果に書く。値は書かない。
- `lefthook.yml`・`package.json`・`.github/workflows/` は保護された設定として変えない。hook や CI への登録の案（追加する設定の全文）を個票の対応結果に書き、pipeline では報告の `handoff` にも書く。反映は利用者の承認のもとで行う。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` が通り、親の検証が通る。
- CHANGELOG は未公開の版の節に書き、公開済みの版の節を変えない。

## 4. 作業内容

| No  | 作業                                   | 担当     | 状態 | メモ |
| --- | -------------------------------------- | -------- | ---- | ---- |
| 1   | 伏せ字の形式を足し、テストを足す       | executor | open | -    |
| 2   | 検査のスクリプトを足し、テストを足す   | executor | open | -    |
| 3   | 既存の実行記録に検査を流し、結果を書く | executor | open | -    |
| 4   | hook と CI への登録の案を書く          | executor | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- PJR-2WC2: 由来の issue（生のログを全文残す決定）
