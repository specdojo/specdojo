---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-ccd-project-planning-040-20261118t140547z-1204d319
  type: exec-result
  task_id: T-KATA-SLIM-2-ccd-project-planning-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-ccd-project-planning-040/T-KATA-SLIM-2-ccd-project-planning-040-20261118T140547Z-1204d319/plan.md
  started_at: "2026-11-18T14:05:52.527Z"
  completed_at: "2026-11-18T14:36:38.541Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - prj-0001:ccd-project-planning
    - specdojo:ccd-mermaid-rulebook
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/rulebooks/ccd-mermaid-rulebook.md` から、共通の運用に関する記述（役割、`ready` 昇格などの承認フロー、静的検査コマンド、未解決事項の担当列、用語定義表、共通規約の再掲）を削除し、全体方針への参照に置き換えました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/ccd-mermaid-rulebook.md`: 共通の運用記述を削除し、正本（ドキュメントメタ情報標準など）への参照に整理しました。あわせて、用語定義表を削除したため第 2 章を「位置づけと用語定義」から「位置づけ」へ変更しました。

## 3. 申し送り

- 大きさの測り方: sld の試行と同じく、空白（改行を含む）と表の区切り行を除いた文字数。前 6,601 字、後 5,275 字（79.9%）。区切り行を含むと 8,052 字から 6,611 字、バイト数は 20,794 B から 17,067 B。
- 章名の変更: rulebook の第 2 章を「位置づけと用語定義」から「位置づけ」に変え、用語の表（7 語）を外した。表の内容は全体方針と「関係種別と役割名」の表の言い直しで、rulebook 作成標準の「用語定義が不要な場合は章を『位置づけ』とする」に当たるため。成果物の章名（目的と適用範囲、概念クラス図、関連定義と多重度の根拠、参照業務データ辞書、未解決事項）と必須・条件付きの区分は変えていない。
- rulebook の記述ガイドの小節名「検証と改訂時の確認」を「整合性の照合と改訂時の確認」に変え、静的検査の小節（`npm run lint:md`・`npm run lint:fm`・`npm run lint:mermaid`）を外した。キーと多重度の業務上の妥当性は構文検査ではなく照合で判定する 1 文と、照合の手順の 2 項目は残した。
- sample の変更案（この段では変更していない）: `docs/ja/specdojo/samples/ccd-sample.md` の「未解決事項」の表の 3 列目は、開発担当・店主代表・技術メンターの担当と解消の条件を書いている。rulebook の本文要件（論点、影響と当面の扱い、解消時に直す箇所）に合わせ、担当を外して、解消時に直す箇所と照合の条件だけにする。冒頭の段落の技術メンター・同行レビュー担当の使い方も、役割ではなく判断の場面として書くか外す。
- recipe と template は `not-needed` のため対象がない。ccd-mermaid-rulebook が frontmatter の includes で取り込む記法の rulebook はない。
- 共通の正本への追記: 不要。外した記述は、ドキュメントメタ情報標準の「成果物の値制約」と「文書の改訂・廃止とライフサイクル変更管理」で賄える。
- rate limit後に sol-executor から opus-executor へ切り替え、2026-11-18T14:09:56.880Z に再開

## 4. 進め方と実践の型の適用

rulebook-maintenance
