---
specdojo:
  id: prj-0001:xer-pjr-3mts-20261117t212149z-9e1c5a1b
  type: exec-result
  task_id: PJR-3MTS
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-3MTS/pjr-3mts-20261117T212149Z-9e1c5a1b/plan.md
  started_at: "2026-11-17T21:21:50.302Z"
  completed_at: "2026-11-17T21:35:36.927Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- uis-open-document-by-id を specdojo.openById の文言と分岐に合わせて新規作成し、uis-rulebook（6,025→4,472 字、74%）と uis-sample（8,493→5,945 字、70%）から共通の運用の記述と同じ判断の言い直しを外した。個票の作業内容 1〜3 を done、4（grade）は open のまま残し、対応結果を記入した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/uis-rulebook.md`: 変更、+41 / -108 行
- `docs/ja/specdojo/samples/uis-sample.md`: 変更、+98 / -121 行
- `docs/ja/product/010-business-specs/040-user-interface-model/uis-open-document-by-id.md`: 追加、+84 / -0 行

## 3. 申し送り

- 統合の後に orchestrator が型（uis）と成果物（uis-open-document-by-id）を grade し、結果を個票に書く（作業内容の 4、executor は未実行）。
- 決めた点: uis-rulebook のファイル名の規則を `uis-&lt;番号&gt;-&lt;短い日本語名&gt;.md` から `uis-&lt;term&gt;.md` に改め、カタログの path（`uis-open-document-by-id.md`）と ID の規則にそろえた。ほかに uis の成果物はなく、影響はこの 1 件だけ。
- 決めた点: uis-rulebook の対象に「エディタ拡張の入力欄」を足した（利用者が選んだ案 A によるため）。文書 ID は、同じディレクトリの bds・clis に合わせて名前空間なしの `uis-open-document-by-id` にした。
- 画面仕様の `_UNDECIDED_` が 2 点ある: (1) 索引にある ID のファイルがないとき、拡張は独自の表示を出さず VS Code のコマンド失敗の表示に任せている。(2) 索引のファイルを消しても読み込み済みの索引を使い続ける（読み直すのは作成と変更のときだけ）。完了条件の外のため実装は変えず、記録だけにした。
- CHANGELOG の文案（追加 1 行・変更 1 行）は個票の対応結果の「CHANGELOG に書く事項」の節にある。保護された設定の変更は不要だった。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
