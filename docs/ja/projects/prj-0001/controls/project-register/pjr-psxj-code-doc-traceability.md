---
specdojo:
  id: prj-0001:pjr-psxj-code-doc-traceability
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-11-03T23:02:58Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-GEZN
  commit_type: docs
  commit_scope: register
---

# PJR-PSXJ コードの変更と要件・仕様・設計の文書のズレに気づける仕組みを決める

## 1. 背景

成果物と根拠のコードの対応（evidence_refs）を使い、コードが変わったときに直すべき要件・仕様・設計の文書が分かり、直す作業につながる仕組み（対応の粒度、ズレの検出、変更時の知らせ、retrofit の自動起票、文書を先に直す運用）を決める

## 2. 入力

- 利用者の課題: 概念データフロー図（cdfd）を作ったが、機能を足すと cdfd の内容とコードがズレていく。トレーサビリティを確保し、コードが変わったら相応する要件定義・仕様書・設計書を直す、または直すことに気づけるようにしたい（2026-11-04）
- 既存の部品: カタログの `evidence_refs`（成果物ごとの根拠のコードのパス。cdfd-overview は src/specdojo.ts など粒度が粗い）、approach retrofit（`evidence_refs` を読み一致とズレを判定して直す。起票しないと動かない）、grade の `content_hash`（文書側の鮮度だけ）、`based_on` と trc-requirements-to-specs / trc-requirements-to-tests の rulebook（文書間の対応）、commit の Refs（コードの変更から登録簿の項目へたどれる）（2026-11-04）
- 候補の手: (1) `evidence_refs` をコマンドの領域のディレクトリ単位に整える、(2) 文書ごとに最後に照合した根拠のコードの版を記録し、それ以降に根拠が変わった文書を一覧にするコマンド（dashboard にも出す）、(3) todo の統合時に変えたファイルから `evidence_refs` を逆にたどり、関係する文書を result と申し送りに警告として出す、(4) routine で (2) の一覧を確かめ、ズレた文書ごとに retrofit の todo を起票する、(5) 大きな変更は change-request で文書を先に直してから実装する運用（2026-11-04）
- 推奨の順序は 1→2→3 で、4 は 2 の一覧が実用的な量に収まるのを確かめてから足す。照合の記録（最後に照合した版）を文書の frontmatter・result・カタログのどこに持つかが設計の要。今回の cdfd 3 文書を最初の対象にして試す（2026-11-04）
- 利用者の決定: 推奨の 2 手を先に行う。(a) 再 export だけのファイルなど、根拠にならないファイルを指す `evidence_refs` を検出する検査を足す。(b) カタログの見直し（catalog-planning）の段に、状態遷移や判定の本体を含むファイルが `evidence_refs` にあるかの確認を入れる。候補 (2)〜(5) は後に回す（2026-11-06）
- orchestrator の調査: 成果物 203 件のうち 93 件に `evidence_refs` があり、参照は 181 件（ディレクトリ単位は 0 件）。最多の `src/exec/exec.ts`（56 回）は 2 行の re-export で根拠にならない。次いで `src/catalog.ts` 22 回、`src/register.ts` 15 回。stsd-register-entry の retrofit は、状態遷移の本体のファイルが参照から漏れていて止まった（2026-11-06）

## 3. 検討した選択肢

| 選択肢 | 内容   | 利点   | 懸念   |
| ------ | ------ | ------ | ------ |
| A      | _TODO_ | _TODO_ | _TODO_ |

## 4. 決定内容

_TODO_: 採択した内容を明確に記載する。

## 5. 採択理由

- _TODO_: 判断根拠を記載する。

## 6. 承認

| 項目     | 内容   |
| -------- | ------ |
| 決定者   | _TODO_ |
| 決定日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 7. 影響範囲とフォローアップ

| 項目       | 内容   |
| ---------- | ------ |
| 影響範囲   | _TODO_ |
| 必要な対応 | _TODO_ |
| 追跡先     | _TODO_ |

## 8. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
