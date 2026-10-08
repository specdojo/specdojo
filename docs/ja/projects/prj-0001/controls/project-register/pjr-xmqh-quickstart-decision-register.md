---
specdojo:
  id: prj-0001:pjr-xmqh-quickstart-decision-register
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-10-08T03:45:28Z"
  due_on: null
  completed_at: "2026-10-08T14:47:42Z"
  conclusion: quick-start ガイドの冒頭に、init から question・decision・設計書の更新・change-request・ログの確認までを 10 分で体験する流れを加えた。公開物で手順どおりに動くことを確かめた
---

# PJR-XMQH 仕様の判断台帳としてのクイックスタートを作る

## 1. 概要

question の起票 → decision で決める → 設計書を 1 つ更新 → 後日 change-request で直す、までを 10 分で体験できるクイックスタートを作る。kata を事前に用意しなくても始められることを示す。

普及戦略（[[prj-0001:pjr-nyzr-adoption-strategy]]）の段階 0 の施策で、入口を register（記帳）にする方針の最初の体験になる。選択式の init（[[prj-0001:pjr-6qda-interactive-init]]）を起点にする。

## 2. 完了条件

- 「10 分で体験する」流れを、quick-start ガイドの冒頭（既存の詳しい手順の前）に置く。README の「記帳ひとつから始められます」から、この流れへ案内する。
- 流れは、共通サンプル文脈（駄菓子屋）を題材に、次の順で進む。各手順に、実行するコマンドか、オーケストレーターへの話しかけ方の例を示す。
  1. `npm install --save-dev specdojo` と `npx specdojo init`（質問の答え方の例を示す）
  2. 迷っていること（例: 「支払い方法をどこまで扱うか」）を question として記帳する（起票）
  3. decision で決める（選択肢・理由・決定を書いて close する）
  4. 決めたことを設計書へ反映する。kata を事前に用意しなくても始められるよう、成果物カタログを使わない 1 つの Markdown（例: 簡単な基本方針の文書）を作るか更新する
  5. 後日の変更を change-request として記帳し、設計書を直す
  6. 生成された決定ログ・課題ログなどの一覧を確かめる
- 道場の言葉（記帳・起票・型・実戦・評定）を PJR-QGP4 の範囲で使う。標語は「決めて、書いて、鍛え続ける。」。
- 「次に進む」として、成果物カタログ（型）と実戦（exec）、評定（grade）への入口を短く案内する。
- 本文のコマンドは、`npx specdojo` で統一し、実際に動く形にする（存在しないオプションを書かない）。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                                            | 担当         | 状態 | メモ                     |
| --- | ----------------------------------------------- | ------------ | ---- | ------------------------ |
| 1   | クイックスタートの「10 分で体験する」流れを書く | DEV          | done | quick-start ガイドの冒頭 |
| 2   | 公開物で手順どおりに試す                        | orchestrator | done | 手順どおりに動いた       |

## 4. 対応結果

- 実施内容: [[specdojo:quick-start-guide|Quick Start ガイド]] の冒頭に `10分で体験する — 仕様の判断台帳` を追加し、既存の章を 1 つずつ繰り下げた。駄菓子屋きぬやの「支払い方法をどこまで扱うか」を題材に、導入と `npx specdojo init`（質問への答え方の例）→ question の起票 → decision で決めて close → 成果物カタログを使わない設計書（`payment-policy.md`）の作成 → change-request の起票と設計書の修正・close → `register build` と生成される一覧・決定ログ・変更要求ログの確認、の順に、コマンドとチャットの例を示した。「次に進む」に型と実戦・評定と講評への入口を置いた。
- README: 「記帳ひとつから始められます。」の直後に、この流れへの案内を追加した。
- コマンドの確認: `init` の質問文と既定値、`register add` / `close` / `build` のオプション、close 時の状態（decision と question は `decided`、change-request は `done`）、生成ログのパスを CLI のソースと照合した。
- 残課題: 公開物で手順どおりに試す作業（No 2）は統合後に orchestrator が行う。
- 公開物での確認（orchestrator、2026-10-08）: tarball を新しいリポジトリに入れ、`init` → question と decision の起票 → decision の close（`--status` なしで `decided` になる）→ change-request の起票と close → `register build` までを手順どおりに実行し、決定ログ・変更要求ログなどが生成されることを確かめた。
- 残課題: 末尾の「実戦（exec）」の案内のコマンドに `--executor-by` / `--reporter-by` がなく、担当が未定の項目ではそのままでは動かない（init の終了時の案内には正しい例が出る）。codex の executor は 1 回目に利用制限で止まり、claude-expert-executor で再開して仕上げた。

## 5. 関連ドキュメント

- [[prj-0001:pjr-nyzr-adoption-strategy]]（普及戦略）
- [[prj-0001:pjr-qgp4-naming-spec-do]]（呼び方と道場の言葉）
