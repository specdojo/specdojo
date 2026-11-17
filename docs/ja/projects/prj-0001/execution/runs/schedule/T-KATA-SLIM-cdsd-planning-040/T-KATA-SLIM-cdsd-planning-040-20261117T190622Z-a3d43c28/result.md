---
specdojo:
  id: prj-0001:xer-t-kata-slim-cdsd-planning-040-20261117t190622z-a3d43c28
  type: exec-result
  task_id: T-KATA-SLIM-cdsd-planning-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-cdsd-planning-040/T-KATA-SLIM-cdsd-planning-040-20261117T190622Z-a3d43c28/plan.md
  started_at: "2026-11-17T19:06:28.682Z"
  completed_at: "2026-11-17T19:33:44.200Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - cdsd-planning
    - specdojo:cdsd-rulebook
---

# Edit Result

## 1. 実施内容

- `cdsd-rulebook` から、どの成果物にも共通する文書運用の記述を外し、共通の正本への参照に置き換えた。外した記述は、役割の表と段落、status・公開承認・改訂と廃止・未決事項の管理手順、文書品質の検査、共通の禁止事項である。全体方針には「共通の運用」を 1 項目だけ置いた。
- 残した記述は、データストアの更新・確認担当、管理境界、正本区分、業務の照合手順と合格条件、良い例・悪い例である。全見出し、本文 5 章の必須・条件付き区分、標準 6 列、Frontmatter は変更していない。
- 大きさは、空白と改行を除いた文字数で 6,900 字から 5,134 字になった（74.41%）。目安の 8 割以下を満たしている。sld 試行と同じく表の区切り行を除くと 6,052 字から 4,472 字（73.89%）である。
- executor が実行した `npx prettier --check` と `git diff --check` は成功した。runner が実行した `lint:fm`、`lint:md`、`lint:mermaid`、`lint:d2`、`validate:schema`、`test:unit`、`test:integration` も成功した。`lint:ts` と `typecheck` は変更種別により非適用だった。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/cdsd-rulebook.md`: 役割の表と段落、status・公開承認・改訂と廃止・未決事項の管理手順、文書品質の検査、共通の禁止事項を削除した。全体方針に「共通の運用」を 1 項目置き、役割は適用先のメンバー定義、status・承認・改訂と廃止・未決事項の引き継ぎは `document-metadata-standard` への参照とした。章名、必須・条件付きの区分、標準 6 列、型固有の判断基準、業務の照合手順、良い例・悪い例は維持した。差分は 27 行追加、48 行削除である。

## 3. 申し送り

- sample への変更案（今回は未変更、矛盾時は更新した rulebook を正とした）: `cdsd-sample` について次を整理する。概要の役割段落、照合手順末尾の文書整形・lint と rulebook 内コマンドへの参照、確認事項の管理区分・担当・判断時期・追跡先の列、末尾の公開承認・draft 維持の段落である。管理単位ごとの更新責務、業務判断と照合条件、未決の論点・影響・当面の制約は残す。recipe と template は Frontmatter で `not-needed` のため変更不要である。
- 共通正本への変更案: `document-metadata-standard` は人による ready 昇格、改訂・廃止時の PO 承認、未決事項の引き継ぎを定めている。一般的な公開判断で提示する次の項目を明記すると、削除した共通運用を補える。公開対象、閲覧範囲、個人情報や非公開情報の有無、未解決指摘と影響、承認・保留・差し戻しの判断、新規作成時を含む未決事項の引き継ぎである。今回の編集対象外のため、変更案として申し送る。
- 変更ファイルは docs/ja/specdojo/rulebooks/cdsd-rulebook.md のみ。役割表・役割段落、status・公開承認・改訂廃止・未決事項の管理手順、文書品質の検査、共通禁止事項を削除し、全体方針の「共通の運用」1項目へ集約した。データストアの更新・確認担当、管理境界、正本区分、業務の照合手順・合格条件、良い例・悪い例は維持した。
- 文字数はファイル全体から空白・改行を除去して測定（表の区切り行を含む）。変更前6,900字、変更後5,134字、比率74.41%。SLD試行と同様に表の区切り行も除く場合は6,052字→4,472字（73.89%）。全見出し、本文5章の必須・条件付き区分、標準6列、Frontmatterが変更されていないことも照合済み。
- 判断根拠: rulebook-authoring-standard、document-metadata-standard、共通実行規約、SLD試行個票の「他の型へ広げるときの一覧」、改訂済みsld-rulebook、共通レビュー観点の `vp-arc-conciseness`、CDSDカタログ、planning・execution・sharingの成果物、cdsd-sample、既存grade記録を確認した。planning・sharingに見られる対象欠落や検証不足は要件を緩める理由とはせず、網羅性・粒度・参照対応・検証要件を維持した。planに展開されたfindingはなし。gradeサイドカーは変更・再評価していない。
- sampleへの変更案: cdsd-sample の概要の役割段落、照合手順末尾の文書整形・lintとrulebook内コマンドへの参照、確認事項の管理区分・担当・判断時期・追跡先列、末尾の公開承認・draft維持の段落を整理する。管理単位ごとの更新責務、販売・集計・締めの業務判断と照合条件、未決の論点・影響・当面の制約は残す。今回はsampleを変更せず、矛盾時は更新したrulebookを正とした。recipe・templateはFrontmatterで `not-needed` のため変更なし。
- 共通正本への変更案: document-metadata-standard は人によるready昇格、改訂・廃止時のPO承認と未決事項の引き継ぎを定めている。一方、一般的な公開判断で提示する公開対象・閲覧範囲・個人情報や非公開情報の有無・未解決指摘と影響、承認・保留・差し戻しの判断、および新規作成時を含む未決事項の引き継ぎを明記すると、削除した共通運用を補える。今回の編集対象外のため変更案として申し送る。
- executor段の指示に従いresultは編集していない。上記の実施内容・変更ファイル・判断根拠・文字数・変更案をreporterがresultへ転記する。親runnerが担当するlint・schema・test等は重複実行していない。
- 適用外の検証: `npm run validate:schema:file`（変更はMarkdownのrulebookのみで、YAMLファイルの変更がない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票・既存plan・resultを変更していない。）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下の成果物変更がない。）

## 4. 進め方と実践の型の適用

rulebook-maintenance として、`rulebook-authoring-standard`、`document-metadata-standard`、共通実行規約、sld 試行の個票（「他の型へ広げるときの一覧」）、改訂済みの `sld-rulebook`、`vp-arc-conciseness`、cdsd のカタログと planning・execution・sharing の成果物、`cdsd-sample`、既存の grade 記録を根拠に見直した。plan に展開された finding はなかった。planning・sharing の成果物に見られる対象欠落や検証不足は、rulebook の要件を緩める理由にせず、網羅性・粒度・参照対応・検証要件を維持した。共通運用の記述は正本への参照に置き換え、型固有の判断基準は維持した。grade サイドカーは変更も再評価もしていない。
