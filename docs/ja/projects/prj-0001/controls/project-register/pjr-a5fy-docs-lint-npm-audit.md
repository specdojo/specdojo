---
specdojo:
  id: prj-0001:pjr-a5fy-docs-lint-npm-audit
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
  registered_at: "2026-11-19T10:03:09Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-5CTM
  commit_type: fix
  commit_scope: deps
---

# PJR-A5FY docs-lint の配る依存の npm audit を解消する

## 1. 概要

別に publish する @specdojo/docs-lint の配る依存に残る npm audit の high 1 件と moderate・low を、上げる・overrides・上流待ちのどれで直すか決めて反映する

## 2. 入力

- 2026-11-19 に packages/docs-lint で npm audit --omit=dev を実行すると 16 件（low 3・moderate 12・high 1）。high は markdownlint-cli@0.49.1 が引く markdown-it@14.3.2（<=14.3.2、GHSA-vfgh-jcmw-g37q）。moderate には fast-uri・glob・js-yaml・katex・minimatch・smol-toml がある。
- ルートの npm audit は packages/docs-lint の依存を見ないため、PJR-5CTM の完了条件の確認では検出されなかった。PJR-5CTM の executor は、ルートと同じく docs-lint の markdownlint-cli を ^0.50.0 へ上げることを勧めている。
- 利用者は 2026-11-19 に、5CTM の範囲を広げず別の todo として担当 ARC・期限 11 月末で起票することを承認した。

## 3. 完了条件

- `packages/docs-lint` の配る依存（`npm audit --omit=dev` の対象）の high と moderate について、依存ごとに「上げる（版）」「`overrides`」「上流待ち（理由と追跡先）」のどれにするかを、個票の対応結果に表で書く。今より古い版へ下げる直し方は使わない。
- `packages/docs-lint/package.json`・`package-lock.json` は保護された設定のため executor は変えない。変更案（`dependencies`・`devDependencies`・`overrides` の差分）を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと orchestrator が feature ブランチで行う。
- 依存の版を上げるためにコードの変更が要る場合は、executor が `packages/docs-lint/src` と対応するテストを直す。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- 反映の後に、orchestrator が次を確かめる。`packages/docs-lint` の `npm audit --omit=dev` の high と moderate が 0、または上流待ちとして記録したものだけ。docs-lint の `npm run typecheck` と、ルートの `npm run check`・`npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run test:integration`・`npm run lint:md` が通る。
- `CHANGELOG.md` は変えず、個票の対応結果の `### <n>.<m>. CHANGELOG に書く事項`（Markdown の連番ルールに従う）に区分（追加・変更・不具合修正など）と行の文案を書く。影響がなければ「なし」と書く。

## 4. 作業内容

| No  | 作業                                                      | 担当         | 状態 | メモ             |
| --- | --------------------------------------------------------- | ------------ | ---- | ---------------- |
| 1   | 配る依存の high・moderate の直し方を決めて表に書く        | ARC          | open | -                |
| 2   | `package.json`・lock の変更案を書く                       | ARC          | open | -                |
| 3   | 変更案を feature ブランチで反映し、audit と検証を確かめる | orchestrator | open | 利用者の承認の後 |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-5ctm-npm-audit-high|PJR-5CTM]]（ルートの npm audit の解消。本項目の由来）
- `packages/docs-lint/package.json`
