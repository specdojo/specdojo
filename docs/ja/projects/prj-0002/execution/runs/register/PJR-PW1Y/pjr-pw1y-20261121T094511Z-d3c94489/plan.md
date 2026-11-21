---
specdojo:
  id: prj-0002:xep-pjr-pw1y-20261121t094511z-d3c94489
  type: exec-plan
  rulebook: none
  task_id: PJR-PW1Y
  name: "Continuous Specification Engineering の定義の文と略称を決めて正本にまとめる"
  mode: edit
  status: ready
  project_id: prj-0002
  origin: register
  owner: BA
---

# Edit Plan: PJR-PW1Y Continuous Specification Engineering の定義の文と略称を決めて正本にまとめる

## 1. このタスクで行うこと

プロジェクト登録簿の項目 PJR-PW1Y「Continuous Specification Engineering の定義の文と略称を決めて正本にまとめる」に対応する。

PJR-WBWX の決定を受け、分野の定義の文・近い概念との関係の表・略称の扱いを正本にまとめ、README・概要ガイド・specdojo-lp への反映の範囲を決める

## 2. 対象項目

- `id`: PJR-PW1Y
- `type`: todo
- `priority`: medium
- `owner`: BA
- `due`: 2026-11-30
- `個票`: `docs/ja/projects/prj-0002/controls/project-register/pjr-pw1y-cse-definition.md`
- `result`: `docs/ja/projects/prj-0002/execution/runs/register/PJR-PW1Y/pjr-pw1y-20261121T094511Z-d3c94489/result.md`

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- PJR-WBWX で、分野の正式名称を Continuous Specification Engineering とし、Spec道 を愛称、SpecDojo をその道場と位置付けることが決まった。
- 略称の扱いは PJR-WBWX で未決のまま残した。CSE は Computer Science and Engineering とぶつかる。
- 「Specification」だけでは範囲が狭く聞こえるため、定義の文で成果物の体系・判断の記録・型と評定・運用中の維持まで含むことを補う。
- 関係を示す近い概念は SDD（仕様駆動開発）・Docs as Code・Continuous Requirements Engineering。
- 影響先は README・概要ガイド（specdojo-overview-guide）・specdojo-lp。

## 3. 進め方

1. 個票（存在する場合）を読み、目的・完了条件・制約を把握する。登録簿の一覧は大きいため読まない。
2. 個票に完了条件がある場合はそれを作業の基準にする。無い場合はタイトルと説明から完了条件の仮説を立て、記録する。pipeline では個票の対応結果と executor の報告の `handoff` に書き、result を直接書ける実行形式では result に明記する。
3. 関連する成果物・設計書・実装を確認し、対象ファイルを特定して変更する。
4. 個票が存在する場合は、個票の作業内容・対応結果セクションを実施内容で更新する。作業内容の表は、各行の状態とメモを実績に合わせる。終えた行は状態を `done` にし、`_TODO_` を残さない。executor が実行できない行（grade の起動など）は状態を `open` のまま残し、その理由をメモに書く。理由のない `done` 以外の行や `_TODO_` の残る行があると、post-review と `register close` は完了にしない。
5. 個票の完了条件が result への記載を求める場合、pipeline の executor は個票の対応結果と報告の `handoff` の両方に書く。reporter と runner が result の申し送りへ反映する。executor は result を直接編集しない。
6. 判断に迷う箇所は _TODO_ / _ASSUMPTION_ で残し、根拠と次のアクションを記録する。pipeline では個票の対応結果と報告の `handoff` に書き、result を直接書ける実行形式では result に書く。

### grade result から展開された finding

- なし

plan に展開された finding は、message と同じ viewpoint ID の判定根拠に照らして解消する。未解消、根拠不足、または判断不能の場合は、理由と次のアクションを記録する。pipeline では個票の対応結果と報告の `handoff` に書き、result を直接書ける実行形式では result に書く。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。

## 4. 完了手順

1. 「進め方」に従って対応を完了する。
2. 共通規約に従って、必要な整形・静的検査を実行する。
3. result に実施内容・変更ファイル・申し送りを記入する。pipeline では executor は実施内容・変更ファイル・検証結果を報告し、申し送りを `handoff` に記載する。reporter と runner が result を記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。
4. 登録簿（`pjr-index.md`）の行と個票のステータス項目は変更しない。状態遷移（review / close など）は runner と人間が行う。

## 5. 異常終了の条件

- 前提不足・対象ファイル不明・静的検査未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は登録簿の状態を変更せず、終了コードと標準エラー出力で runner に結果を返す。

## 再開の指示（2026-11-21T10:50:43.798Z）

利用者が再開の前に足した指示である。これまでの申し送りとあわせて、この指示に従って作業を続ける。

- PJR-9TSG の個票 pjr-9tsg-lp-changelog-release-2026-11-02.md と plan pjr-9tsg-20261102T110745Z-28a990e7-plan.md にある、ラベル付きの外部 URL「`[SpecDojo](https://specdojo.org/)`」の 2 か所を bare URL（例: `本番の SpecDojo（https://specdojo.org/）`）に直し、npm run validate:history-links を exit 0 で通す。この 2 か所のほかは PJR-9TSG の文書を変えない。完了条件の外の修正なので、PJR-PW1Y の個票の対応結果に記録する。
- 利用者の判断で略称を CSpE に決めた。specdojo-philosophy の章「略称の扱い」を、正式な略称を CSpE とする内容に書き直す。初出は「Continuous Specification Engineering（CSpE）」とし、読み方を「シー・スペック・イー（英語では see-spec-ee）」と書く。理由には、CSE・CSEng・ConSE を避けた理由（Computer Science and Engineering や Continuous Software Engineering と取り違えられる）と、Sp が入ることで仕様の分野だと読み取れることを書く。Spec道 は日本語での愛称として残す。
- PJR-PW1Y の個票の対応結果と、反映の todo PJR-P8G7・PJR-KGH2・PJR-T1TH の個票の記述を、略称 CSpE の決定にそろえる（「略称は設けない」とした記述を残さない）。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0002/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
