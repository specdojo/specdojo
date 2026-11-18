---
specdojo:
  id: prj-0001:pjr-p318-security-automation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: ARC
  registered_at: "2026-11-18T12:18:15Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-5CTM
  depends_on:
    - PJR-5CTM
---

# PJR-P318 依存の更新と脆弱性・コードの検査を定期的に回す仕組みを入れる

## 1. 概要

Dependabot（週 1 回の依存の更新と脆弱性の修正の PR）、CI の npm audit の関門（配る依存の high で止める）、CodeQL（PR ごとと週 1 回）を入れる

## 2. 入力

- 利用者の依頼（2026-11-18）: package の更新やコードの検査などのセキュリティ対策を定期的に実行したい
- 利用者の決定（2026-11-18）: orchestrator の推奨の 1〜3 を採る。1. Dependabot（週 1 回、開発用の依存はまとめて 1 本の PR、脆弱性の修正は随時）、2. CI の audit の関門（PR と publish の前に npm audit --omit=dev --audit-level=high、開発用は報告だけ）、3. CodeQL（TypeScript、PR ごとと週 1 回）
- orchestrator の推奨（2026-11-18）: specdojo の routine で週 1 回 audit を見て登録簿へ起票する案（4）は、routine から任意のコマンドを流せるかを確かめてから決める。GitHub の secret scanning・push protection と npm publish の provenance も合わせて勧めた
- orchestrator の調べ（2026-11-18）: 今ある検査は .github/workflows/check-evidence-secrets.yml（実行の記録の秘密の検査）だけ。Dependabot・CodeQL・audit の CI は無い

## 3. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
