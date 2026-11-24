---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opr-index-sample-140-20261124t223847z-20598a9e
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opr-index-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opr-index-sample-140/T-KATA-REVIEW-ALL-opr-index-sample-140-20261124T223847Z-20598a9e/plan.md
  started_at: "2026-11-24T22:38:56.074Z"
  completed_at: "2026-11-24T22:52:21.926Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-index-sample
    - specdojo:opr-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R4（正しさ）を実施した。sample の主張を schema と根拠の `opd-index-sample` に突き合わせ、grade の F001（日次の在庫確認の対象「人気商品」の範囲が未定義）を直した。
- F001 は日次の在庫確認の行を、`PO` が運用開始前に固定した人気商品の一覧の照合に具体化して解消した。これで完了条件「対象商品すべてで一致」を判定できる。
- ほかの主張は確かめた範囲で正本と一致し、誤りはなかった。確かめられなかったのは正本のない駄菓子屋の業務上の仮定（夜間バックアップの再実行回数など）で、共通サンプル文脈と食い違わないため確かめの対象外とした。
- executor が実行した `prettier --check` と `markdownlint-cli2` は成功した。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も成功した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-index-sample.md`: 日次・閉店後の在庫確認の行を 1 行修正した。操作を「`PO` が運用開始前に固定した人気商品の一覧の在庫数を棚と照らし、欠品した商品を記録する」とした。完了条件は「一覧の商品すべてで在庫数が一致するか、差を調整して記録した」とした。これで grade F001 の対象範囲の曖昧さを解消し、`vp-qe-verifiability` に沿って判定できるようにした。根拠は `opd-index-sample` の「SLO・SLA・KPI」で、対象商品と除外条件を記録の開始前に固定するとある。

## 3. 申し送り

- R4-2 は R5 で判断が必要である。本書は「分冊は障害対応だけ」とし、`opd-monitoring`・`opd-incident-management`・`opd-access-control`・`opr-incident` を「予定」としている。一方で、同じ系列の `opd-monitoring-sample`・`opd-incident-management-sample`・`opd-access-control-sample`・`opr-incident-sample` などの sample が存在する。同じ系列の sample どうしの整合の問題なので、`vp-qe-kata-conformance` の観点で R5 に任せる。
- R4-1: R4 / 日次/週次/月次点検手順（日次・閉店後の在庫確認の行） / 確認対象の「人気商品」の範囲が決まっておらず、完了条件「対象商品すべてで一致」を判定できない（grade F001） / 操作を「`PO` が運用開始前に固定した人気商品の一覧の在庫数を棚と照らし…」、完了条件を「一覧の商品すべてで在庫数が一致するか、差を調整して記録した」にした / `vp-qe-verifiability`。opd-index-sample の「SLO・SLA・KPI」に、対象商品と除外条件を記録の開始前に固定するとある / -
- R4-2: R4 / 関連ドキュメント導線 / 「分冊は障害対応だけ」とし、`opd-monitoring`・`opd-incident-management`・`opd-access-control`・`opr-incident` を「予定」としている。一方で同じ系列の sample として opd-monitoring-sample・opd-incident-management-sample・opd-access-control-sample・opr-incident-sample・opr-monitoring-sample・opr-batch-sample・opr-change-sample・opr-access-control-sample・opr-backup-restore-sample・opr-support-sample がある / - / 同じ系列の sample どうしの整合の問題のため R5 に任せる（`vp-qe-kata-conformance`）。R5 で、本書の章を分冊への参照に替えるか、分冊の sample を本書の文脈と切り離して扱うかを決める / 要判断
- 確かめ1: frontmatter `type: operations` / 正本 docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml / grep で読み取り / 一致 / 17 行目の enum に `operations` がある
- 確かめ2: `rulebook: specdojo:opr-index-rulebook`・`based_on: specdojo:opd-index-sample`・wikilink [[specdojo:opd-index-sample]] / 正本 docs/ja/specdojo/rulebooks/opr-index-rulebook.md、docs/ja/specdojo/samples/opd-index-sample.md / ファイルと id を読み取り / 一致 / rulebook の `sample: specdojo:opr-index-sample` と、opd-index-sample の存在を確認した
- 確かめ3: 営業時間 10:00〜18:00、月次点検は毎月の最初の休業日 / 正本 opd-index-sample（対象範囲、定期運用方針） / 読み取り / 一致 / 34 行目と 151 行目
- 確かめ4: P1〜P3 の条件と連絡期限（P1 は 15 分、応答がなければ `PO` へ。P2 は当日の閉店まで。P3 は次の月次点検） / 正本 opd-index-sample（SLO・SLA・KPI、体制・責任分界） / 読み取り / 一致 / 52 行目、77〜81 行目
- 確かめ5: P1 が 30 分で再開できなければ `PO` の判断で紙の販売控えへ切り替える / 正本 opd-index-sample（障害対応方針） / 読み取り / 一致 / 97 行目
- 確かめ6: 自動の通知は死活と夜間バックアップの 2 つ。バックアップの失敗は P2 として扱う / 正本 opd-index-sample（監視・アラート方針） / 読み取り / 一致 / 85〜90 行目
- 確かめ7: バックアップは閉店後の日次締めの後に取得する。月次で検証用の環境へ復元し、販売件数を比べる。復元できなければ P2 / 正本 opd-index-sample（バックアップ・リストア方針） / 読み取り / 一致 / 119〜128 行目
- 確かめ8: 監査ログの保管は 1 年。付与・剥奪の承認者は `PO`。剥奪は店番をやめた日のうち / 正本 opd-index-sample（権限・アカウント運用） / 読み取り / 一致 / 137〜141 行目
- 確かめ9: つけ残高の確認時間は月 3 回計り、1 分以内とする / 正本 opd-index-sample（SLO・SLA・KPI） / 読み取り / 一致 / 49 行目
- 確かめ10: 営業時間中の変更は P1 の復旧に必要な場合だけ `PO` の承認で行う。ロールバックは `DEV` が行う / 正本 opd-index-sample（変更管理） / 読み取り / 一致 / 113 行目
- 確かめ11: 夜間バックアップの再実行は 1 日 2 回まで。同じ日付の取得は同じ世代を上書きする / 正本なし（駄菓子屋の業務上の仮定） / - / 確かめられない / 共通サンプル文脈とは食い違わないため、確かめの対象外とした

## 4. 進め方と実践の型の適用

sample-maintenance の R4 として実施した。plan に展開された finding は F001（minor / `vp-qe-verifiability`）の 1 件で、`opd-index-sample` の「SLO・SLA・KPI」を規範の根拠として修正し、解消した。 主張ごとの確かめは次のとおり。 | 主張 | 正本 | 結果 | | --- | --- | --- | | frontmatter `type: operations` | `deliverable-frontmatter.schema.yaml` の enum | 一致 | | `rulebook` と `based_on` の id、wikilink | `opr-index-rulebook` と `opd-index-sample` | 一致 | | 営業時間 10:00〜18:00、月次点検は毎月の最初の休業日 | `opd-index-sample`（対象範囲、定期運用方針） | 一致 | | P1〜P3 の条件と連絡期限 | `opd-index-sample`（SLO・SLA・KPI、体制・責任分界） | 一致 | | P1 が 30 分で再開できなければ `PO` の判断で紙の販売控えへ切り替える | `opd-index-sample`（障害対応方針） | 一致 | | 自動通知は死活と夜間バックアップの 2 つ。バックアップの失敗は P2 | `opd-index-sample`（監視・アラート方針） | 一致 | | バックアップの取得時機、月次の復元検証、復元できなければ P2 | `opd-index-sample`（バックアップ・リストア方針） | 一致 | | 監査ログの保管は 1 年。付与・剥奪の承認者は `PO`。剥奪は店番をやめた日のうち | `opd-index-sample`（権限・アカウント運用） | 一致 | | つけ残高の確認時間は月 3 回計り、1 分以内 | `opd-index-sample`（SLO・SLA・KPI） | 一致 | | 営業時間中の変更は P1 の復旧に必要な場合だけ `PO` が承認。ロールバックは `DEV` | `opd-index-sample`（変更管理） | 一致 | | 夜間バックアップの再実行は 1 日 2 回まで。同じ日付の取得は同じ世代を上書きする | 正本なし（駄菓子屋の業務上の仮定） | 確かめられない（共通サンプル文脈と食い違わないため対象外） | 維持した記述は、上の表で一致した主張と、共通サンプル文脈の仮定である。rulebook と矛盾して rulebook を正とした箇所はない。frontmatter の `status` は `draft` のまま据え置いた。
