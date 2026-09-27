---
specdojo:
  id: prj-0001:pjr-vjp8-viewpoint-document-kinds-coverage-check
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  owner: DEV
  registered_at: "2026-09-27T11:30:16Z"
---

# PJR-VJP8 観点の document_kinds で判断漏れの rulebook を検出する検証を追加する

## 1. 概要

PJR-H220 の決定（選択肢 B）を実装する。

PJR-AG7B で、観点の適用範囲を `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml` の `document_kinds` で宣言するようにした。宣言は rulebook ID の include / exclude の列挙で行う。2026-09-27 時点では次の 2 観点が exclude を列挙している。

- `vp-arc-single-responsibility`: 21 件
- `vp-ba-business-value`: 12 件

rulebook を追加しても、これらの観点で新しい rulebook の扱いを判断したかどうかを確かめる手段がない。判断が漏れると、当てはまらない観点が適用されて review / grade で的外れな指摘が出るか、逆に必要な観点が外れる。

## 2. 完了条件

- `document_kinds` を宣言した観点ごとに、include / exclude / 既定（適用する）のどれとも判断されていない rulebook を一覧にする検証がある。
- 「既定のまま適用する」と判断したことを記録する方法が決まっており、記録済みの rulebook は一覧に出ない。記録方法（例: 明示の include への列挙、判断済みの一覧）と、その理由を対応結果に記録する。
- 検証は `npm run check` に含まれる。error にするか warning にするかを決め、その理由を対応結果に記録する。
- 検証の出力に、観点 ID と判断が漏れている rulebook ID が含まれる。
- 現状の 107 件の rulebook について、2 観点の判断が記録され、検証が通る状態になっている。判断の記録で既存の include / exclude の結果（どの rulebook に観点が適用されるか）が変わらない。
- rulebook を 1 件追加した場合に検証が漏れを検出すること、判断を記録すれば通ることを確かめるテストがある。
- rulebook の作成手順（`rulebook-authoring-standard.md` または関連する recipe）に、観点の判断を記録することと検証の存在が書かれている。

## 3. 作業内容

| No  | 作業                                       | 担当 | 状態 | メモ                             |
| --- | ------------------------------------------ | ---- | ---- | -------------------------------- |
| 1   | 判断済みの記録方法を決める                 | DEV  | done | 既存の宣言の結果を変えないこと   |
| 2   | 検証を実装し `npm run check` に組み込む    | DEV  | done | `npm test` 経由で組み込んだ      |
| 3   | 既存 107 件について 2 観点の判断を記録する | DEV  | done | 現在の適用結果をそのまま記録する |
| 4   | テストと作成手順への記載を追加する         | DEV  | done | -                                |

## 4. 対応結果

- 記録方法: `document_kinds` に `confirmed_default`（rulebook ID の列挙）を追加した。列挙していない rulebook を既定の結果（`exclude` の観点では適用、`include` の観点では対象外）のままにすると判断したことを記録する。
  - 明示の `include` に列挙する案は採らなかった。`include` と `exclude` は同時に指定できず、`exclude` を使う観点へ `include` を足すと適用判定が変わるためである。`confirmed_default` は適用判定（`viewpointAppliesToDocument`）で参照しないため、記録しても既存の結果は変わらない。
  - schema（`pm-review-viewpoints.schema.yaml`）へ `confirmed_default` を追加した。`include` か `exclude` のどちらかと一緒に書く場合だけ許可する。
- 検証: `src/viewpoint-document-kinds-check.ts` を追加した。`include` / `exclude` / `confirmed_default` のいずれかを宣言した観点ごとに、次を観点 ID と rulebook ID の組で報告する。
  - どこにも載っていない rulebook（判断漏れ）。
  - 存在しない rulebook ID（改名・削除の追従漏れ）。
  - 複数の欄に重ねて書かれた rulebook。
- error / warning: error にした。漏れは観点が的外れに適用される状態を放置することになり、直す作業は ID を 1 行足すだけで軽い。warning は `npm run check` の出力に埋もれて見落とされやすい。
- `npm run check` への組み込み: executor の権限では `package.json` と `lefthook.yml` を編集できなかった。そのため、リポジトリの共通観点に対して検証を実行するテストを `tests/src/viewpoint-document-kinds-check.test.ts` に置き、`npm run check` に含まれる `npm test` で実行されるようにした。単独では `npx tsx src/viewpoint-document-kinds-check.ts` で実行できる。
- 判断の記録: `vp-ba-business-value` に 95 件、`vp-arc-single-responsibility` に 86 件を `confirmed_default` として記録した。`exclude` との合計はどちらも 107 件である。`exclude` は変更していないため、適用される rulebook は変わらない。
- テスト: rulebook を 1 件追加すると漏れが報告され、判断を記録すると通ることを確認するテストを追加した。`confirmed_default` が適用判定を変えないことのテストも `tests/src/review-plan.test.ts` に追加した。
- 手順: `rulebook-authoring-standard.md` の運用ルールと `review-guide.md` に、観点の判断を記録することと検証があることを追記した。
- 残課題: 専用の npm script（例: `validate:viewpoint-kinds`）を `check` へ追加し、rulebook と観点 YAML の変更時に pre-commit で検証する設定は、`package.json` と `lefthook.yml` を編集できる作業で行う。プロジェクトのオーバーレイ（`extends` で継承した `pm-review-viewpoints.yaml`）は、今回の検証の対象外とした。

## 5. 関連ドキュメント

- PJR-H220（本項目の決定）、PJR-AG7B（`document_kinds` の導入）
- [[specdojo:review-guide]]
- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`
