---
specdojo:
  id: prj-0001:pjr-qtz7-external-register-commit-message
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  difficulty: easy
  registered_at: "2026-11-21T09:06:40Z"
---

# PJR-QTZ7 外部プロジェクトへの register add --commit で、-m の段落がカンマで件名につながる

## 1. 課題内容

external_projects へ register add --commit -m を複数渡すと、各段落が改行ではなくカンマで連結され、本文と Co-Authored-By の行が件名の1行に入る。また相手のリポジトリの commit-msg hook で commit が失敗したとき、CLI は書き込んだファイルの一覧と「not committed」だけを示し、失敗の理由（hook の出力）を出さない。段落を git commit -m と同じに扱い、commit の失敗の理由を示す

## 2. 入力

- 発端は利用者のプロジェクト coderdojo-lessons-specdojo（SpecDojo 0.9.2、2026-11-21）。
- register add --project `<外部の別名>` --commit -m `<件名>` -m `<本文>` -m `<Co-Authored-By>` で起票したところ、相手のリポジトリの commit の件名が「`<件名>`,`<本文>`,`<Co-Authored-By>`」の1行（275 文字・414 文字）になった。この2件（PJR-FGKB・PJR-F6MC）の commit は orchestrator がメッセージだけを作り直した。
- 別の起票では、本文の1行が commitlint の body-max-line-length（100 文字）を超え、相手の commit-msg hook で commit が失敗した。CLI の出力は「The register changes were written but not committed:」とファイルの一覧だけで、理由は手で git commit を流して初めて分かった。個票とイベントは相手の作業ツリーに未 commit のまま残った（PJR-7KQT）。
- help の -m の説明は「each value becomes a paragraph, as in git commit -m」で、ローカルの project への起票ではそのとおりに動く。

## 3. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 4. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
