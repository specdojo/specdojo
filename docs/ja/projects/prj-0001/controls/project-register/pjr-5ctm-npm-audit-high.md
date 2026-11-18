---
specdojo:
  id: prj-0001:pjr-5ctm-npm-audit-high
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  difficulty: medium
  owner: ARC
  registered_at: "2026-11-18T12:18:01Z"
  due_on: "2026-11-30"
---

# PJR-5CTM npm audit の high を解消する（配る依存を先に）

## 1. 概要

npm audit の high 15 件を解消する。配る依存（tinyglobby・fdir・picomatch・fast-uri）を先に直し、開発用は依存ごとに上げるか外すかを決める。古い版へ下げる直し方は使わない

## 2. 入力

- 利用者の依頼（2026-11-18）: npm audit で high が多く出るようになったので直したい
- orchestrator の調べ（2026-11-18）: npm audit は high 15・moderate 18・low 3・critical 0。--omit=dev では high 3（tinyglobby・fdir・picomatch）と moderate 1（fast-uri）。tinyglobby は実行時の依存
- orchestrator の調べ（2026-11-18）: 開発用の high は vitest・markdownlint-cli・remark-cli・ajv-cli・vite・markdown-it などの推移的な依存。npm audit の直し方には vitest@3.1.4・markdownlint-cli@0.33.0 など今より古い版へ下げる案が混じる
- 利用者の決定（2026-11-18）: 直し方は推奨の案 1。executor が依存ごとの直し方を調べて個票の対応結果に書き、package.json・package-lock.json（保護された設定）への反映は利用者の承認のもと orchestrator が feature ブランチで行う

## 3. 完了条件

- 配る依存（`npm audit --omit=dev` の対象）の high と moderate を解消する直し方を決める。依存ごとに、上げる版と、上げられない場合に `overrides` を使うかを、個票の対応結果に表で書く。
- 開発用の high（12 件）について、依存ごとに「上げる」「`overrides`」「外す（使っていないツール）」「上流待ち（理由と追跡先）」のどれにするかを、個票の対応結果に表で書く。今より古い版へ下げる直し方（`npm audit fix --force` が示す `vitest@3.1.4`・`markdownlint-cli@0.33.0` など）は使わない。
- `package.json`・`package-lock.json` は保護された設定のため executor は変えない。変更案（`dependencies`・`devDependencies`・`overrides` の差分）を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと orchestrator が feature ブランチで行う。
- npm registry へつながらず調べられない依存がある場合は、そのことと調べられなかった範囲を個票の対応結果に書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- 反映の後に、orchestrator が次を確かめる。`npm audit --omit=dev` の high と moderate が 0。全体の high が上流待ちとして記録したものだけ。`npm run check`・`npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run test:integration`・`npm run docs:build` が通る。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。

## 4. 作業内容

| No  | 作業                                                      | 担当         | 状態 | メモ                       |
| --- | --------------------------------------------------------- | ------------ | ---- | -------------------------- |
| 1   | 配る依存の high・moderate の直し方を調べて表に書く        | ARC          | open | `npm audit --omit=dev`     |
| 2   | 開発用の high の直し方を依存ごとに決めて表に書く          | ARC          | open | 古い版へ下げる案は使わない |
| 3   | `package.json`・`package-lock.json` の変更案を書く        | ARC          | open | 対応結果と `handoff`       |
| 4   | 変更案を feature ブランチで反映し、audit と検証を確かめる | orchestrator | open | 利用者の承認の後           |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-p318-security-automation|PJR-P318]]
