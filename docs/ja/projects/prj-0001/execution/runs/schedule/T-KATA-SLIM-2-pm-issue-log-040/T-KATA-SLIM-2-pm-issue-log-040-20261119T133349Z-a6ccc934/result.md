---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-pm-issue-log-040-20261119t133349z-a6ccc934
  type: exec-result
  task_id: T-KATA-SLIM-2-pm-issue-log-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-pm-issue-log-040/T-KATA-SLIM-2-pm-issue-log-040-20261119T133349Z-a6ccc934/plan.md
  started_at: "2026-11-19T13:33:54.675Z"
  completed_at: "2026-11-19T13:47:19.774Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - prj-0001:pm-issue-log
    - specdojo:pm-issue-log-rulebook
---

# Edit Result

## 1. 実施内容

- 共通の運用記述を排除し、正本への参照に置き換えるとともに、finding (F001-F005) への対応による改訂を実施しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/pm-issue-log-rulebook.md`: 共通の運用記述（用語表、Frontmatter 表）を削除し、`document-metadata-standard.md` への参照を追加しました。また、登録簿からの生成位置づけ（`pjr-rulebook`）を追記し、課題固有の意思決定者の定義や機密情報の禁止事項を追加することで finding (F001-F005) に対応しました。

## 3. 申し送り

- 大きさ: 空白と表の区切り行を除いた文字数で、前 1,262 字、後 1,555 字（123%）。8 割の目安を超えた。理由は、元の rulebook に外す記述がほとんどなく（外せたのは用語の表と Frontmatter の表だけ）、F003〜F005 の対応と、登録簿から生成する位置づけの節を足す必要があったため。
- 章名と必須の区分は変えていない。第 2 章の名前を『位置づけと用語定義』から『位置づけ』に変え、用語の表（pm-plan・pm-risk-register・pm-issue-log の言い直し）を外した。
- F003・F004: rulebook 側では、登録簿を使うプロジェクトでは `item_type: issue` の個票から `register build` が生成し、生成物は `rulebook: specdojo:pjr-rulebook` とし直接編集しないと位置づけに書いた。template（`specdojo:pm-issue-log-template`）が `rulebook: specdojo:pjr-rulebook` の派生ビューである点は rulebook と矛盾しなくなった。ただし template の Frontmatter には rulebook の参照がない。template の宣言を単独ログ用と生成ビュー用に分けるかは、template を対象とする段で判断する（変更案）。
- sample の変更案（この段の対象外）: (1) ステータスの『未着手・対応中・完了』と優先度の『高・中』を、登録簿の `item_status`・`priority` の値（open・in-progress など、high・medium・low）にそろえる。(2) 『優先度と期限』と『進捗レビュー』に、優先度の変更を決める者と完了を判定する者を足す。(3) 一覧の表と『優先度と期限』の表・『対応計画』の表で、優先度・期限・対応策が重複しているため削る。
- F001: 承認そのものは共通の運用（ドキュメントメタ情報標準）に任せた。課題固有の意思決定者は、優先度の変更を決める者、期限超過時のエスカレーション先、完了を判定する者を書かせる形にした。
- F002: 禁止事項に『個人情報・認証情報を内容や対応策に書き写す』を足した。公開可否の判断は共通の運用に任せた。
- 共通の正本への追記は不要と判断した。保護された設定の変更も不要だった。
- rate limit後に sol-executor から opus-executor へ切り替え、2026-11-19T13:35:39.791Z に再開

## 4. 進め方と実践の型の適用

共通の運用記述を削り、正本（`document-metadata-standard.md`）への参照に置き換えるとともに、finding に基づく不足定義（意思決定者、禁止事項、生成ビューとしての位置づけ）を追記し、rulebook の整合性を確保しました。
