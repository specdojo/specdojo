---
specdojo:
  id: prj-0001:pjr-2q0g-grade-conciseness-metrics
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  registered_at: "2026-11-17T12:53:26Z"
  derived_from:
    - PJR-0T83
  depends_on:
    - PJR-8S4T
  commit_type: feat
  commit_scope: grade
---

# PJR-2Q0G grade で文書の冗長さと膨らみを点数に反映する

## 1. 概要

手直しで文書が膨らんでも grade の点数が下がらないため、機械で測る大きさの指標と冗長性の観点の強化を組み合わせて、冗長さを verdict と点数に反映する

## 2. 入力

- PJR-0T83 の対応策 (3) にあたる。利用者が 2026-11-17 に、機械で測る指標と観点の強化を組み合わせる案（c）を選んだ
- orchestrator の調査（2026-11-17）: 冗長さを見る観点 vp-arc-conciseness は既定の重大度が minor で「長さだけでは fail にしない」とあり、verdict を needs-work にしない。点数は区分ごとの平均を重み付けしたもので、28 の観点のうち 1 つとして usability の区分の中で平均されるため、1 段下がっても点数は 1〜2 点しか動かない。sld-sample（運用・検証の章が約 28%）はこの観点で 4（満点）だった
- 手直しで膨らんだ例: PJR-CPZH の代替案比較は 27KB から 75KB（sample は 20KB）、PJR-Y5AC の品質管理計画は 5.4KB から 18.8KB（sample は 15.8KB）。どちらも grade の点数は上がっていた
- 上限の数値は、PJR-8S4T で sld を見直した結果（前後の大きさと grade の結果）を見てから決める

## 3. 完了条件

- grade が、LLM を使わずに機械で測る大きさの指標を記録する。少なくとも次の 3 つを含める。
  - 宣言された sample に対する、空白を除いた文字数の比
  - 前回の grade の時点からの増え方
  - 文書の運用・検証の章が全体に占める割合
- 指標が上限を超えたら finding を出し、程度に応じて minor か major にする。上限の数値は PJR-8S4T の結果（sld の前後の大きさと grade の結果）を根拠に決め、根拠を個票の対応結果に書く。上限は rubric などの設定で変えられる。
- `vp-arc-conciseness` の check と evidence を見直す。共通の正本（ドキュメントメタ情報標準など）にある運用の記述の再掲と、同じ判断の複数の章での言い直しを冗長として扱い、判断情報を失わずに削れる量が多い場合は major にできるようにする。機械の指標が出た文書では、どこを削れるかを finding に示す。
- 必要な記述まで削らせないため、上限を超えても判断に要る背景・制約・例外・完了条件が残っていれば減点しないことを、観点と指標の説明に書く。
- 既存の grade の結果の形式と、指標を持たない古い結果の読み込みは保つ。指標の追加で rubric の版が変わる場合は、`--rubric-outdated` で選べるようにする。
- 手直しで膨らんだ文書（PJR-CPZH の作り直し前の版、PJR-Y5AC の今の版）と sld-sample の今の版で、新しい指標と観点が膨らみを捕まえることを、単体テストか実際の grade で確かめて個票に書く。
- 関連する設計・ガイド・grade のリファレンスを直す。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。影響がなければ「なし」と書く（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                                              | 担当 | 状態 | メモ |
| --- | ----------------------------------------------------------------- | ---- | ---- | ---- |
| 1   | 機械の指標の定義と上限の決め方を設計する（PJR-8S4T の結果を使う） | DEV  | open | -    |
| 2   | 指標の計測と finding を grade に実装し、テストを足す              | DEV  | open | -    |
| 3   | `vp-arc-conciseness` の check と evidence を見直す                | DEV  | open | -    |
| 4   | 膨らんだ文書で捕まえられることを確かめる                          | DEV  | open | -    |
| 5   | 設計・ガイド・リファレンスを直す                                  | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-0t83-grade-rework-bloats-documents]]
- [[prj-0001:pjr-8s4t-sld-kata-slim-pilot]]
