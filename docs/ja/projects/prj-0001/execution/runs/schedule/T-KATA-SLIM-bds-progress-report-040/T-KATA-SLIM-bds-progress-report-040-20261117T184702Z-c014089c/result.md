---
specdojo:
  id: prj-0001:xer-t-kata-slim-bds-progress-report-040-20261117t184702z-c014089c
  type: exec-result
  task_id: T-KATA-SLIM-bds-progress-report-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-bds-progress-report-040/T-KATA-SLIM-bds-progress-report-040-20261117T184702Z-c014089c/plan.md
  started_at: "2026-11-17T18:47:10.091Z"
  completed_at: "2026-11-17T19:14:09.723Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - bds-progress-report
    - specdojo:bds-rulebook
---

# Edit Result

## 1. 実施内容

- BDS rulebook（`docs/ja/specdojo/rulebooks/bds-rulebook.md`）から、どの成果物にも共通する運用の記述を外し、共通の正本への参照に置き換えた。
- 全体方針に「共通の運用」を1項目だけ置き、役割は適用先のメンバー定義、status・承認・改訂と廃止・未決事項の引き継ぎはドキュメントメタ情報標準を参照する形にした。
- F001は、本文要件・記述ガイドの言い換えにとどまる用語表の5語を削除して解消した。
- F002は、下書きでは出所・確かめ方の未確定を明記してよく、受入確認までに解消することを明示した。無条件の禁止を修正して解消した。
- 空白を除いた文字数は6,899字から5,358字（77.66%）になり、目安の8割以下を満たした。
- Markdown 整形・差分検査と、runner の lint・schema・unit・integration の各検査は成功した。個別YAML schema・catalog・history-links の検査は対象外とした。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/bds-rulebook.md`: 役割の表と役割の段落、承認・改訂・文書検査の手順、未決事項の管理台帳の列、重複する用語表と共通禁止事項を削除した。全体方針に「共通の運用」を1項目置き、メンバー定義とドキュメントメタ情報標準を参照させた。帳票固有の判断基準、標準6列、対比例、業務の受入手順と合格条件、成果物の章名と必須区分は維持した。第2章は「位置づけと用語定義」から「位置づけ」へ改名した。F002の対応として、元にする記録や確かめ方のない表示項目は下書きで未確定と明記してよく、受入確認までに解消することを明示した。Frontmatter は変更していない。

## 3. 申し送り

- 共通正本への変更案: Rulebook記述標準の「各rulebookは具体的な追従対象と役割分担を定義する」を、「型固有の追従対象を定義し、役割分担は共通規約と適用先のメンバー定義を参照する」へ調整する案がある。標準自体は変更していない。
- sample への変更案: `bds-sample` の「読み手と利用目的」にある仕様確認担当の段落と、「メモ / 将来課題」の管理分類・担当・追跡先列、登録簿への転記段落、末尾の文書検査・確定承認の段落を同じ方針で整理する。sample は対象外のため未編集で、recipe・template は変更不要と executor が判断している。
- 実施内容・変更ファイル: `docs/ja/specdojo/rulebooks/bds-rulebook.md` のみ編集。役割表、承認・改訂・文書検査の手順、管理台帳の担当列、重複する用語表と共通禁止事項を削除。全体方針に「共通の運用」を1項目置き、メンバー定義とドキュメントメタ情報標準を参照した。帳票固有の判断基準、標準列、対比例、業務の受入手順と合格条件を維持した。result は executor の指示に従い未編集。
- 大きさ: 改行を含む空白を除いた全文字数は6,899字→5,358字（77.66%）。SLD試行と同様に表の区切り行も除いた場合は6,331字→5,022字（79.32%）。どちらも8割以下。
- 進め方と実践の型の適用: [[specdojo:rulebook-authoring-standard|Rulebook記述標準]]、[[specdojo:document-metadata-standard|ドキュメントメタ情報標準]]、[[specdojo:pm-review-viewpoints|共通レビュー観点一覧]] の `vp-arc-conciseness`・`vp-qe-omissions-consistency`、[[specdojo:ryu-guide|進め方ガイド]]、[[prj-0001:pjr-8s4t-sld-kata-slim-pilot|SLD試行]] と改訂済みSLD rulebookを根拠にした。BDS sample、週次進捗報告、Job実行設計、BDS rulebookと成果物のgrade結果、PJR-JFRXの対応結果も照合した。成果物側の既存指摘は文書起因であり、今回の編集対象には広げていない。condense由来の指摘はplanにない。
- finding対応: F001は用語表を削除して解消。指摘の語句の一部は現行表にないため、anchorと現行本文を照合し、本文要件・記述ガイドで判断できる5語を削除した。F002は下書きで出所・確かめ方の未確定を明記できること、受入確認までに解消すること、照合一致と未確定なしを合格条件とすることを明示し、無条件の禁止を修正して解消した。
- 構造の判断: 成果物に求める9章の名称・順序・必須区分、表示項目の標準6列、各章の記述ガイドを維持。rulebook第2章だけを「位置づけと用語定義」から「位置づけ」へ変更した。用語表の削除に伴う名称調整で、記述標準とSLD試行に従う。役割表の1.1節を削除し、第8章「運用ルール」は帳票の業務受入手順を残すため維持した。Frontmatterは変更していない。
- 共通正本への変更案: メタ情報標準の「成果物の値制約」と「文書の改訂・廃止とライフサイクル変更管理」で、外した状態・承認・改訂廃止・未決事項の引き継ぎを賄えるため追記不要。Rulebook記述標準の「各rulebookは具体的な追従対象と役割分担を定義する」は、今回の方針に合わせ「型固有の追従対象を定義し、役割分担は共通規約と適用先のメンバー定義を参照する」へ調整する案を申し送る。標準自体は変更していない。
- sampleへの変更案: [[specdojo:bds-sample|BDS完成例]] の「読み手と利用目的」にある仕様の確認担当の段落と、「メモ / 将来課題」の管理分類・担当・追跡先列、登録簿への転記段落、末尾の文書検査・確定承認の段落を同じ方針で整理する。業務上の作成・例外対応、未決事項の影響、限定受入の条件は残す。構造の正本は今回改訂したrulebookとする。sampleは対象外のため未編集。recipe・templateはともに `not-needed` で変更なし。
- 検証: Prettierと差分検査が成功。読み取り専用の比較でFrontmatter、成果物章名・必須区分、標準列の維持と文字数目標を確認した。親runner所有のlint・schema・型検査・テストは重複実行していない。既存の未追跡 `pipeline-state.json` は変更していない。
- 適用外の検証: `npm run validate:schema:file`（変更した成果物はMarkdown rulebookのみで、YAMLの変更がない。）
- 適用外の検証: `npm run validate:catalog`（成果物の変更は `docs/ja/specdojo/rulebooks/` 内のみで、`docs/ja/projects/` 配下の変更がない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票、既存plan、resultなどの履歴ファイルを編集していない。）

## 4. 進め方と実践の型の適用

根拠としたのは、Rulebook記述標準、ドキュメントメタ情報標準、共通レビュー観点一覧の `vp-arc-conciseness` と `vp-qe-omissions-consistency`、進め方ガイド、SLD試行（pjr-8s4t）と改訂済みSLD rulebook である。BDS sample、週次進捗報告、Job実行設計、BDS rulebookと成果物のgrade結果、PJR-JFRXの対応結果も照合した。F001・F002はいずれも解消した。章名と必須・条件付きの区分は維持し、変えたのは用語表の削除に伴う第2章名のみである。第8章「運用ルール」は帳票の業務受入手順を含むため残した。condense 由来の指摘は plan になかった。
