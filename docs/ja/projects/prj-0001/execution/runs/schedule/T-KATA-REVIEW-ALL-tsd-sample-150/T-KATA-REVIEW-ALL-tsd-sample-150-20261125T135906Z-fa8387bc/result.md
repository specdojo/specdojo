---
specdojo:
  id: prj-0001:xer-t-kata-review-all-tsd-sample-150-20261125t135906z-fa8387bc
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-tsd-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-tsd-sample-150/T-KATA-REVIEW-ALL-tsd-sample-150-20261125T135906Z-fa8387bc/plan.md
  started_at: "2026-11-25T13:59:15.606Z"
  completed_at: "2026-11-25T14:06:32.570Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:tsd-sample
    - specdojo:tsd-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）として、tsd-sample を同じ接頭辞の sample（`tsd-index-sample`）、`based_on` の参照先（`prj-overview-sample`・`opd-index-sample`）、用語と共通サンプル文脈に照らして確認し、食い違い 3 件を tsd-sample 側で直した。
- 相手側を直すべき 2 件（`tsd-index-sample`）は変更せず、直す案を findings と handoff に残した。
- grade の F001 は `vp-pm-dependency-risk` の指摘で、kata のレビューでは使わない観点のため R5 では直していない。F002〜F006 は前の段までの版で解消済みだった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 6.1. 開発端末の初期構築手順 | 「商品マスター」と書いているのは sample 群でこの文書だけで、ほかの sample と `opd-index-sample` の変更管理は「商品マスタ」と書く。 | 「商品マスタ」に直した。 | vp-qe-kata-conformance（sample 相互の用語の一致。samples 配下では「商品マスタ」66 件、「商品マスター」1 件） | - |
| R5-2 | R5 | 8.1. データの永続化と再起動時の挙動 | 会計を入力し直す主体を「店番」と書いているが、`based_on` の `opd-index-sample` は役割名として「店番担当」を定義している。 | 「店番担当が記録の有無を確かめてから入力し直す」に直した。 | vp-qe-kata-conformance（参照先の役割名との一致） | - |
| R5-3 | R5 | 8.2. バックアップの取得 | 取得失敗の検知後を「方針に従い失敗として扱い」としか書いておらず、`opd-index-sample` の監視・アラート方針にある「P2 として `DEV` に再取得を依頼する」に当たる優先度と取り直す主体がない。 | 「方針に従い P2 として扱い、`DEV` がバックアップ環境で `/app/backup.sh` を手動で実行して取り直す」に直した。 | vp-qe-kata-conformance、vp-dev-change-impact（`opd-index-sample` の監視・アラート方針の閉店後のバックアップの行） | - |
| R5-4 | R5 | tsd-index-sample の 2.2. 参照先の役割と適用条件 | tsd-sample の行は参照する場面が「DB の構築、接続トラブルの調査、スキーマ変更」だけで、tsd-sample の冒頭が挙げる「バックアップからの復元」がない。 | 相手側の `docs/ja/specdojo/samples/tsd-index-sample.md` の該当行の参照する場面に「バックアップからの復元」を足す案。本タスクでは変更していない。 | vp-qe-kata-conformance | - |
| R5-5 | R5 | tsd-index-sample の 1. 技術スタック一覧（CI/CD の行） | GitHub Actions の担当責務が「ESLint・Vitest の実行と、main 更新時の Fly.io へのデプロイ」だけで、tsd-sample の 6.3. スキーマ変更とマイグレーションの運用が前提とする、本番デプロイ前の `npx prisma migrate deploy` の実行がない。 | 相手側の `docs/ja/specdojo/samples/tsd-index-sample.md` の CI/CD の行の担当責務に「デプロイ前のマイグレーション適用」を足す案。本タスクでは変更していない。 | vp-dev-change-impact | 要判断 |
| R5-6 | R5 | 1.3. 他文書との関係 | grade の F001（`tsd-hosting.md` と `tsd-ci.md` の `_TODO_` に作成担当・時期・課題 ID がない）は `vp-pm-dependency-risk` の指摘で、kata-guide の「kata の観点の組」はこの観点を kata の段のレビューでは使わないとしているため、R5 では直さなかった。F002〜F006 は前の段までの版ですでに直っていた。 | - | kata-guide の「kata の観点の組」。担当や時期を書くと、Sample 記述標準が禁じる「文書を作る役割の割り当て」に当たるおそれがある。選ばなかった案は、`tsd-hosting.md` と `tsd-ci.md` の `_TODO_` を 10. 未解決事項と解決経路へ課題 ID 付きで移すこと。 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/tsd-sample.md`: 用語と役割名の整合のために 3 箇所を直した（3 行追加・3 行削除）。6.1 の「商品マスター」を「商品マスタ」に統一した。8.1 の会計を入力し直す主体を「店番」から `opd-index-sample` の役割名「店番担当」へ直した。8.2 のバックアップ取得失敗時の扱いに、P2 の優先度と、`DEV` がバックアップ環境で `/app/backup.sh` を手動で実行して取り直す手順を足した。

## 3. 申し送り

- 確認した検査で、適用されるものはすべて通過した。runner 実行の `lint-md-changed`・`lint-fm-changed`・`lint-mermaid`・`lint-d2`・`test-docs`・`validate-schema` と、executor 実行の prettier の確認が対象である。
- R5-1: R5 / 6.1. 開発端末の初期構築手順 / 「商品マスター」と書いているのは sample 群でこの文書だけで、ほかの sample と運用方針・設計（opd-index-sample の変更管理）は「商品マスタ」と書く / 「商品マスタ」に直した / vp-qe-kata-conformance（sample 相互の用語の一致。samples 配下では「商品マスタ」66 件、「商品マスター」1 件） / -
- R5-2: R5 / 8.1. データの永続化と再起動時の挙動 / 会計を入力し直す主体を「店番」と書いているが、`based_on` の opd-index-sample は役割名として「店番担当」を定義している / 「店番担当が記録の有無を確かめてから入力し直す」に直した / vp-qe-kata-conformance（参照先の役割名との一致） / -
- R5-3: R5 / 8.2. バックアップの取得 / 取得失敗の検知後を「方針に従い失敗として扱い」としか書いておらず、opd-index-sample の監視・アラート方針の「P2 として `DEV` に再取得を依頼する」に当たる優先度と取り直す主体がない / 「方針に従い P2 として扱い、`DEV` がバックアップ環境で `/app/backup.sh` を手動で実行して取り直す」に直した / vp-qe-kata-conformance、vp-dev-change-impact（opd-index-sample の監視・アラート方針の閉店後のバックアップの行） / -
- R5-4: R5 / tsd-index-sample の 2.2. 参照先の役割と適用条件 / tsd-sample の行は参照する場面が「DB の構築、接続トラブルの調査、スキーマ変更」だけで、tsd-sample の冒頭が挙げる「バックアップからの復元」がない / - / 相手側の docs/ja/specdojo/samples/tsd-index-sample.md の該当行の参照する場面に「バックアップからの復元」を足す案。vp-qe-kata-conformance / -
- R5-5: R5 / tsd-index-sample の 1. 技術スタック一覧（CI/CD の行） / GitHub Actions の担当責務が「ESLint・Vitest の実行と、main 更新時の Fly.io へのデプロイ」だけで、tsd-sample の 6.3. スキーマ変更とマイグレーションの運用が前提とする、本番デプロイ前の `npx prisma migrate deploy` の実行がない / - / 相手側の docs/ja/specdojo/samples/tsd-index-sample.md の CI/CD の行の担当責務に「デプロイ前のマイグレーション適用」を足す案。vp-dev-change-impact / 要判断
- R5-6: R5 / 1.3. 他文書との関係 / grade の F001（`tsd-hosting.md` と `tsd-ci.md` の `_TODO_` に作成担当・時期・課題 ID がない）は `vp-pm-dependency-risk` の指摘で、kata-guide の「kata の観点の組」はこの観点を kata の段のレビューでは使わないとしているため、R5 では直さなかった。F002〜F006 は前の段までの版ですでに直っていた / - / kata-guide の「kata の観点の組」。担当や時期を書くと、Sample 記述標準が禁じる「文書を作る役割の割り当て」に当たるおそれがある。選ばなかった案は、`tsd-hosting.md` と `tsd-ci.md` の `_TODO_` を 10. 未解決事項と解決経路へ課題 ID 付きで移すこと / 要判断
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/tsd-sample.md だけで、plan・result・個票を変更していないため）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がないため）

## 4. 進め方と実践の型の適用

sample-maintenance の進め方に従い、R5 の観点で tsd-sample を `tsd-index-sample`・`opd-index-sample`・`prj-overview-sample` と用語に照らして照合した。矛盾時は rulebook を正とする方針で、sample 側の記述だけを直した。`tsd-index-sample` 側の不整合 2 件は変更せず案だけを残した。F001 は kata の観点の組に含まれない `vp-pm-dependency-risk` の指摘で、担当や時期を書くと Sample 記述標準が禁じる文書を作る役割の割り当てに当たるおそれがあるため、見送って要判断とした。F002〜F006 は前の段までの版で解消済みで、今回は再編集していない。
