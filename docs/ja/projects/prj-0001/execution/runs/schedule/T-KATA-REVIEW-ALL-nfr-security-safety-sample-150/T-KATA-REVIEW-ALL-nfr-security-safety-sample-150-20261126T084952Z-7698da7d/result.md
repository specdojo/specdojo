---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-security-safety-sample-150-20261126t084952z-7698da7d
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-security-safety-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-security-safety-sample-150/T-KATA-REVIEW-ALL-nfr-security-safety-sample-150-20261126T084952Z-7698da7d/plan.md
  started_at: "2026-11-26T08:50:03.949Z"
  completed_at: "2026-11-26T08:58:43.334Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-security-safety-sample
    - specdojo:nfr-security-safety-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `nfr-security-safety-sample` を関連 sample と突き合わせ、sample 側で 4 件を修正した。具体的には、`nfr-sec-012` の手順の置き場所、運用手順リンクの表示名、`nfr-sec-009` の記録対象、`based_on` の 4 点である。
- 相手側（非機能要件インデックス）を直す案と、脆弱性の点検手順の置き場所の判断は、findings に残した。
- grade の F001 と F005 は、kata ガイドがレビューの段で使わないとする観点なので R5 では扱わなかった。F002 から F004 は、前の段で解消済みの状態だった。
- 検査は、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が passed だった。ほかは変更種別により `not_applicable` だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 6. 関連ドキュメント導線、4. 測定・検証方法 / 運用手順の行 | `nfr-sec-012`（脆弱性の点検）の手順も `opr-access-control-sample` にあるとしていたが、その sample にもほかの sample にも脆弱性の点検手順がない。検証先も権限の棚卸し記録になっていた。 | 運用手順の行の範囲を `nfr-sec-009`〜`nfr-sec-011` に絞り、`nfr-sec-012` を「（なし）」の行に分けた。`nfr-sec-012` の検証先を「月次点検の記録」にした。相手側の案: 脆弱性の点検手順を運用手順の全体構成（`opr-sample`）か、新しい運用手順の分冊に置く。 | `vp-qe-kata-conformance`（適用先との整合）、`vp-dev-change-impact` | - |
| R5-2 | R5 | 6. 関連ドキュメント導線 / 運用手順へのリンクの表示名 | 表示名「アカウント付与・剥奪」は相手の文書の章の名前で、H1「運用手順（権限・アカウント）」と合っていない。 | 表示名を「運用手順（権限・アカウント）」にした。 | `vp-qe-kata-conformance`（kata 相互）、`opr-access-control-sample` の H1 | - |
| R5-3 | R5 | 3. 機密性・安全性要件一覧 / `nfr-sec-009` | 監査ログの記録対象に、`opd-access-control-sample` の監査ログの章が定める「緊急権限の間の操作」がない。 | 内容に「とその間の操作」を足した。 | `vp-qe-kata-conformance`（kata 相互） | - |
| R5-4 | R5 | Frontmatter / `based_on` | 本文は横断ルール（`scp-SEC-001`、診断ログの定め）を根拠にしているが、`based_on` に横断ルールの sample がない。 | `based_on` に `specdojo:sysd-cross-cutting-policy-sample` を足した。 | `vp-dev-change-impact`（根拠を変えたときに見直す文書を辿れるようにするため） | - |
| R5-5 | R5 | 非機能要件インデックスのカテゴリ一覧の機密性・安全性の行（相手側） | インデックスは「店番担当以外がつけ残高や価格を見たり変えたりできない」とするが、本書と運用方針では店番は価格の変更とつけ残高の訂正ができず、管理（店主代表）だけができる。 | 相手側のため変更していない。案: `nfr-index-sample` のその行を「権限のない人がつけ残高や価格を変えたり、顧客情報を店外へ出したりできない」にする。 | `vp-qe-kata-conformance`（kata 相互） | - |
| R5-6 | R5 | 6. 関連ドキュメント導線 | 脆弱性の点検手順の置き場所が未決で、R5-1 では「（なし）」とし、決まるまでは記録に残すだけとした。 | - | 置き場所は別の文書をまたぐ判断になるため決めなかった。選ばなかった案は、運用手順（権限・アカウント）の sample に章を足すこと（権限の運用手順の範囲に合わない）。 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-security-safety-sample.md`: `based_on` に `specdojo:sysd-cross-cutting-policy-sample` を追加した。`nfr-sec-009` の内容に「とその間の操作」を追記した。関連ドキュメント導線では、運用手順の行を `nfr-sec-009`〜`nfr-sec-011` に絞り、表示名を「運用手順（権限・アカウント）」にした。`nfr-sec-012` は「（なし）」の行に分け、検証先を月次点検の記録にした。

## 3. 申し送り

- R5-1: R5 / 6. 関連ドキュメント導線、4. 測定・検証方法 / 運用手順の行は `nfr-sec-012`（脆弱性の点検）の手順も [[specdojo:opr-access-control-sample]] にあるとしていたが、その sample にもほかの sample にも脆弱性の点検手順がない。検証先も権限の棚卸し記録になっていた / 運用手順の行の範囲を `nfr-sec-009`〜`nfr-sec-011` に絞り、`nfr-sec-012` を「（なし）」の行に分けた。`nfr-sec-012` の検証先を「月次点検の記録」にした / `vp-qe-kata-conformance`（適用先との整合）、`vp-dev-change-impact`。相手側の案: 脆弱性の点検手順を運用手順の全体構成（`opr-sample`）か、新しい運用手順の分冊に置く / -
- R5-2: R5 / 6. 関連ドキュメント導線 / 運用手順へのリンクの表示名「アカウント付与・剥奪」は相手の文書の章の名前で、H1「運用手順（権限・アカウント）」と合っていない / 表示名を「運用手順（権限・アカウント）」にした / `vp-qe-kata-conformance`（kata 相互）、`opr-access-control-sample` の H1 / -
- R5-3: R5 / 3. 機密性・安全性要件一覧 / `nfr-sec-009` の監査ログの記録対象に、[[specdojo:opd-access-control-sample]] の監査ログの章が定める「緊急権限の間の操作」がない / 内容に「とその間の操作」を足した / `vp-qe-kata-conformance`（kata 相互） / -
- R5-4: R5 / Frontmatter / 本文は横断ルール（`scp-SEC-001`、診断ログの定め）を根拠にしているが、`based_on` に横断ルールの sample がない / `based_on` に `specdojo:sysd-cross-cutting-policy-sample` を足した / `vp-dev-change-impact`（根拠を変えたときに見直す文書を辿れるようにするため） / -
- R5-5: R5 / 非機能要件インデックスのカテゴリ一覧の機密性・安全性の行（相手側） / インデックスは「店番担当以外がつけ残高や価格を見たり変えたりできない」とするが、本書と運用方針では店番は価格の変更とつけ残高の訂正ができず、管理（店主代表）だけができる / - / `vp-qe-kata-conformance`（kata 相互）。相手側の案: [[specdojo:nfr-index-sample]] のその行を「権限のない人がつけ残高や価格を変えたり、顧客情報を店外へ出したりできない」にする / -
- R5-6: R5 / 6. 関連ドキュメント導線 / 脆弱性の点検手順の置き場所が未決で、R5-1 では「（なし）」とし、決まるまでは記録に残すだけとした / - / 置き場所は別の文書をまたぐ判断になるため決めなかった。選ばなかった案は、運用手順（権限・アカウント）の sample に章を足すこと（権限の運用手順の範囲に合わない） / 要判断
- 申し送り: grade の finding のうち F001（`vp-po-decision-readiness`）と F005（`vp-ops-release-readiness`）は、kata ガイドの「kata の観点の組」がレビューの段で使わないとする観点なので、R5 では扱わなかった。F002（期限を起算日つきの表現にした）、F003（測定方法に管理と本部連携がある）、F004（`stc-*` を置かない行がある）は、前の段で直った状態になっていた。
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイル（plan・result・個票）を変更していない）

## 4. 進め方と実践の型の適用

関連 sample（権限・アカウントの運用方針と運用手順、横断ルール、非機能要件インデックス）と突き合わせ、sample 側だけを修正した。相手側を直すべき点は変更せず、案を findings に書いた。F001 と F005 は R5 の観点外として扱わなかった。
