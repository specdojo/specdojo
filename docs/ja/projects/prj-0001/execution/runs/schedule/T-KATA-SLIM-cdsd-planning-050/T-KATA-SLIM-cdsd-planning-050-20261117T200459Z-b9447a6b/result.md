---
specdojo:
  id: prj-0001:xer-t-kata-slim-cdsd-planning-050-20261117t200459z-b9447a6b
  type: exec-result
  task_id: T-KATA-SLIM-cdsd-planning-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-cdsd-planning-050/T-KATA-SLIM-cdsd-planning-050-20261117T200459Z-b9447a6b/plan.md
  started_at: "2026-11-17T20:05:10.448Z"
  completed_at: "2026-11-17T20:32:22.474Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - cdsd-planning
    - specdojo:cdsd-sample
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/samples/cdsd-sample.md` から文書の運用の記述と、同じ判断の言い直しを外した。空白を除き表の区切り行も除いた文字数は 5,838 字から 3,573 字になり、比は約 61% で、目安の 7 割以下に収まった。
- grade の指摘 F001 を解消した。販売記録の行の CLI 参照を現金販売の確定までの操作に限り、つけ販売の確定は未作成の `specdojo:cdfd-sales` で扱うと明記した。
- 判断の基準・値・例外・未決事項の論点は変えていない。rulebook・recipe・template は変更していない。
- runner の検証では `lint:fm`、`lint:md`、`lint:mermaid`、`lint:d2`、`validate:schema`、`test:unit`、`test:integration` が成功した。`lint:ts` と `typecheck` は変更種別により非適用だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cdsd-sample.md`: 役割の段落、末尾の公開承認と agent の段落、QE の文書品質の段落、未決事項の表の担当・判断時期・追跡先候補の列と前置き文、照合の表の「不一致時」の列を外した。隣接領域の表と参照文は概要の 1 段落にまとめ、仕様との対応は「管理単位ごとの参照対応」の表だけに集約した。価格を遡らない制約は「生成元と利用制約」の表を正とした。販売記録の行は CLI 参照を現金販売に限り、つけ販売の確定は `specdojo:cdfd-sales` で扱うと明記した(F001)。

## 3. 申し送り

- `cdsd-rulebook` は `recipe: not-needed`・`template: not-needed` のため、template などへの変更案はない。
- 外した運用の記述のうち、QE の再照合を経て締めへ渡す流れ、根拠のない見直し案の振り分け(未合意なら変更要求、採用なら決定記録)、公開前の PO の承認は結論の変更にあたる。ただし、いずれも文書の運用の記述であり、sample が担う判断の基準ではない。
- 大きさ（空白を除き、表の区切り行も除いた文字数）: 前 5,838 字（区切り行を含めると 7,807 字・20,374 B）、後 3,573 字（同じく 4,882 字・13,338 B）。比は約 61%。
- 外した記述: 冒頭の役割の段落、末尾の公開承認と agent の `draft` 維持の段落、「生成元と利用制約」の前の担当の説明文、照合の表の前置きの段落、QE の文書品質（Prettier・lint）の段落、未決事項の表の担当・判断時期・追跡先候補の列と前置き文、「訂正・不整合時の扱い」で各行に書いていた問い合わせ先と復旧手順の参照（予定手順 `specdojo:cop-sales-reconciliation` は表の前の 1 文にまとめた）、照合の表の「不一致時」の列（「訂正・不整合時の扱い」を参照する 1 文に置き換えた）。
- 言い直しをまとめた箇所: 「対象と隣接領域」の表と辞書・概念クラス図への参照文を、概要の範囲の 1 段落にした。仕様との対応は「管理単位ごとの参照対応」の表 1 か所だけにした。価格を遡らない制約は「生成元と利用制約」の表を正とし、「訂正・不整合時の扱い」の価格変更の行を外した。5 単位の網羅の確認は、照合の表の「一覧の網羅」の行へ移した。
- 指摘 F001 の解消: 販売記録の行の CLI 参照を「現金販売の確定までの操作」に限り、つけ販売の確定は未作成の `specdojo:cdfd-sales` で扱うとした。根拠は `clis-sample` の概要で、対象を単一店舗の現金販売に限り、つけ販売を対象外としている。
- 結論の変更: 判断の基準・値・例外・未決事項の論点は変えていない。運用の記述として外したのは、QE の再照合を経てから締めへ渡す流れ、根拠のない見直し案を未合意なら変更要求・採用なら決定記録へつなぐ振り分け、公開前の PO の承認である。
- rulebook・recipe・template は変えていない。`cdsd-rulebook` は `recipe: not-needed`・`template: not-needed` のため、変更案もない。
- 適用外の検証: `npm run validate:history-links`（変更したのは sample 1 件だけで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

参照の向きを「成果物 → sample」にして `cdsd-sample` を見直した。手本は sld の試行と改訂済みの `sld-sample` で、構造・必須項目・禁止事項は rulebook を正とした。F001 は `clis-sample` の概要が対象を単一店舗の現金販売に限り、つけ販売を対象外としていることを根拠に、CLI 参照を現金販売に限る形で解消した。根拠不足で見送った finding はない。運用の記述は rulebook が担うため sample から外した。同じ判断は 1 か所の表を正とし、ほかの章は章タイトルで参照する形にした。
