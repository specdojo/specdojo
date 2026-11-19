---
specdojo:
  id: prj-0001:pjr-p318-security-automation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
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

- `.github/dependabot.yml` を作る。npm の依存は週 1 回更新し、開発用の依存はまとめて 1 本の PR にする。脆弱性の修正（security updates）は随時 PR になるようにする。GitHub Actions の版も週 1 回更新する。
- 配る依存の audit を CI に入れる。PR と publish（`publish-specdojo.yml`）の前に `npm audit --omit=dev --audit-level=high` を流し、該当があれば止める。開発用の audit は結果を報告するだけで止めない。上流が直すまで止まる場合の、期限付きの例外の手順を書く。
- CodeQL（`javascript-typescript`）を PR ごとと週 1 回で流す workflow を入れる。
- secret scanning・push protection と、npm publish の provenance の設定の手順を書く。GitHub の設定は利用者が行う。
- workflow と Dependabot の設定が保護された設定に当たる場合は、executor は変えず、案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- specdojo の routine で週 1 回 audit を見て登録簿へ起票する案が、今の routine で実現できるかを調べ、結論を個票の対応結果に書く。できない場合に要る機能は、起票の案として書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- 設定の書き方を関係する文書（運用・リリースの手順など）へ反映する。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。
- `npm run lint:md` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                           | 担当 | 状態 | メモ                  |
| --- | ---------------------------------------------- | ---- | ---- | --------------------- |
| 1   | Dependabot の設定を書く                        | ARC  | open | npm と GitHub Actions |
| 2   | CI に配る依存の audit の関門を入れる           | ARC  | open | PR と publish の前    |
| 3   | CodeQL の workflow を入れる                    | ARC  | open | PR ごとと週 1 回      |
| 4   | GitHub の設定の手順と routine の案の調べを書く | ARC  | open | 設定は利用者が行う    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-5ctm-npm-audit-high|PJR-5CTM]]
