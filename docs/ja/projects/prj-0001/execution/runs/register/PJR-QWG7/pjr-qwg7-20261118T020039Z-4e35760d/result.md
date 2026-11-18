---
specdojo:
  id: prj-0001:xer-pjr-qwg7-20261118t020039z-4e35760d
  type: exec-result
  task_id: PJR-QWG7
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-QWG7/pjr-qwg7-20261118T020039Z-4e35760d/plan.md
  started_at: "2026-11-18T02:00:39.936Z"
  completed_at: "2026-11-18T02:20:05.495Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- mm-rulebook・pr-rulebook から Frontmatter の項目表と冒頭の定型文を外して全体方針の「共通の運用」でドキュメントメタ情報標準を参照し、崩れた表を直した（約 93%）。mm-sample・pr-sample は外す記述がなく変更なし。個票の作業内容・対応結果を更新した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/mm-rulebook.md`: 変更、+11 / -23 行
- `docs/ja/specdojo/rulebooks/pr-rulebook.md`: 変更、+5 / -18 行

## 3. 申し送り

- 大きさの目安に届かない: rulebook は約 93%（mm 857→798 字、pr 893→833 字）。元々 1,000 字未満で運用の記述は外した 2 か所だけで、残りは Frontmatter と型固有の判断のため、目安に合わせて削らなかった。
- sample は変更なし（mm 393 字、pr 494 字）。役割や承認の段落、文書品質の検査、判断の言い直しを持たず、7 割の目安に合わせて削ると完成例として欠けるため。
- 変更案（範囲外）: 両 rulebook は rulebook 作成標準の「内容充実化」（必須章ごとに 3 項目以上、推奨表の列定義）を満たさない章がある。mm-rulebook の禁止事項の「過度に」に判断の条件がない。grade の結果を見て別の項目で扱うかを決める。
- 型の grade（作業内容の 3）は統合の後に orchestrator が流す。
- CHANGELOG の文案は個票の「CHANGELOG に書く事項」に書いた。保護された設定の変更は不要。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
