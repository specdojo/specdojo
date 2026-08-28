---
specdojo:
  id: prj-0001:pjr-8qa1-waza-guide-md-cli-overview-guide-md-waza
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-08T12:33:02Z"
  completed_at: "2026-08-08T12:00:00Z"
  register_events:
    - v: 1
      id: reg_ae589fd748cb1aba776af1970382c194
      ts: "2026-08-08T12:33:02Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "exec(register PJR-8QA1): waza-guide.md新設(cli-overview-guide.mdをWaza名称へ改称)とサイドバー・相互参照リンク更新"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: waza-guide.md新設(cli-overview-guide.mdをWaza名称へ改称)とサイドバー・相互参照リンク更新
        - field: description
          from: ""
          to: SpecDojo は道場のメタファーとして、実践の型（rulebook/recipe/sample/template）を「Kata」、進め方（`approach`）を「Ryu」、`specdojo` CLI コマンド群を「Waza」と呼ぶ整理を採用した。既存の [[specdojo:cli-overview-guide]] は `specdojo` CLI 全体の入口ガイドであり、この「Waza」に相当するため、`waza-guide.md` へ改称し、id・H1 を Waza の枠組みに合わせて更新する。
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: _TODO_
        - field: registered
          from: ""
          to: _TODO_
        - field: due
          from: ""
          to: _TODO_
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: eae70c0129e5f546fd2a0ee18b331c69423d2455
    - v: 1
      id: reg_bdcded08bdd9facf8354326f4b47acb3
      ts: "2026-08-09T10:55:22Z"
      action: close
      actor: SpecDojo Test
      from_status: open
      to_status: done
      reason: "exec(register PJR-9P5Q): 既存登録項目を個票 frontmatter へ一括移行する"
      changes:
        - field: status
          from: open
          to: done
        - field: description
          from: SpecDojo は道場のメタファーとして、実践の型（rulebook/recipe/sample/template）を「Kata」、進め方（`approach`）を「Ryu」、`specdojo` CLI コマンド群を「Waza」と呼ぶ整理を採用した。既存の [[specdojo:cli-overview-guide]] は `specdojo` CLI 全体の入口ガイドであり、この「Waza」に相当するため、`waza-guide.md` へ改称し、id・H1 を Waza の枠組みに合わせて更新する。
          to: cli-overview-guide.mdをwaza-guide.mdへリネームし、id・frontmatter・H1(遂行の技活用ガイド/Waza Guide)を更新する。サイドバー表示名(遂行の技活用)と、約30ファイルに及ぶ相互参照リンクを追従修正する。
        - field: owner
          from: _TODO_
          to: ARC
      legacy_commit: dbac152079df02ec9bbad154a3253c043e10655a
      previous_event_id: reg_ae589fd748cb1aba776af1970382c194
    - v: 1
      id: reg_fe28c00c57df21410ae457677ca3b7b0
      ts: "2026-08-09T14:39:40Z"
      action: update
      actor: SpecDojo Test
      from_status: done
      to_status: done
      reason: "exec(register PJR-EQAQ): 登録簿日時をregistered_at・completed_atへ移行する"
      changes:
        - field: registered
          from: _TODO_
          to: "2026-08-08"
        - field: completed
          from: "-"
          to: "2026-08-08"
      legacy_commit: 38201bef867f3cc1454db6b748fc979ed3f2fa8f
      previous_event_id: reg_bdcded08bdd9facf8354326f4b47acb3
---

# PJR-8QA1 waza-guide.md新設(cli-overview-guide.mdをWaza名称へ改称)とサイドバー・相互参照リンク更新

## 1. 概要

cli-overview-guide.mdをwaza-guide.mdへリネームし、id・frontmatter・H1(遂行の技活用ガイド/Waza Guide)を更新する。サイドバー表示名(遂行の技活用)と、約30ファイルに及ぶ相互参照リンクを追従修正する。

SpecDojo は道場のメタファーとして、実践の型（rulebook/recipe/sample/template）を「Kata」、進め方（`approach`）を「Ryu」、`specdojo` CLI コマンド群を「Waza」と呼ぶ整理を採用した。既存の [[specdojo:cli-overview-guide]] は `specdojo` CLI 全体の入口ガイドであり、この「Waza」に相当するため、`waza-guide.md` へ改称し、id・H1 を Waza の枠組みに合わせて更新する。

## 2. 完了条件

- `docs/ja/specdojo/guides/cli-overview-guide.md` が `docs/ja/specdojo/guides/waza-guide.md` へリネームされ、frontmatter の `id` が `specdojo:waza-guide` になっている。
- H1 が「遂行の技活用ガイド」、その直下の英語名行が「Waza Guide」になっている。
- 本文の実質的な内容（CLIの役割、標準ディレクトリ構成、初期設定、project解決順序、代表フロー）は変更前の [[specdojo:cli-overview-guide]] の内容を維持している。
- 冒頭付近に、「Waza」が説明用の愛称・分類であり、CLI コマンド名や frontmatter のフィールド名を変更するものではない旨の注記がある。
- `.vitepress/sidebar-config.ts` の該当エントリが `guide("遂行の技活用", "waza-guide")` に更新され、「遂行体系で回す」グループ内の位置（先頭）が変わっていない。
- リポジトリ内で `cli-overview-guide` を参照している既存ファイル（他ガイド・standard・template等、約30件）のリンク・id参照が新しいファイル名・idに追従修正されている。
- `npm run lint:md` がエラーなく通る。
- `npm run docs:build` がエラーなく通る。

## 3. 作業内容

| No  | 作業                                                                          | 担当 | 状態 | メモ                                            |
| --- | ----------------------------------------------------------------------------- | ---- | ---- | ----------------------------------------------- |
| 1   | `cli-overview-guide.md` を `waza-guide.md` へリネームする                     | ARC  | done | `git mv` でリネーム                             |
| 2   | frontmatter の `id`、H1、英語名行を更新し、Waza の位置づけの注記を追記する    | ARC  | done | id=`specdojo:waza-guide`、H1=遂行の技活用ガイド |
| 3   | `.vitepress/sidebar-config.ts` の該当エントリを更新する                       | ARC  | done | `guide("遂行の技活用", "waza-guide")` へ更新    |
| 4   | リポジトリ内の相互参照リンク（約30件）を新しいファイル名・idへ追従修正する    | ARC  | done | アクティブ文書10件を追従修正、履歴は方針参照    |
| 5   | `npm run lint:md` / `npm run docs:build` を実行し、エラーがないことを確認する | ARC  | done | 両方ともエラーなし                              |

## 4. 対応結果

- `docs/ja/specdojo/guides/cli-overview-guide.md` を `git mv` で `waza-guide.md` へリネームし、frontmatter `id` を `specdojo:waza-guide`、H1 を「遂行の技活用ガイド」、英語名行を「Waza Guide」へ更新した。
- 冒頭に、「Waza（遂行の技）」が CLI 全体像を説明するための愛称・分類であり、CLI のコマンド名や frontmatter のフィールド名を変更するものではない旨の注記を追記した。本文の実質的な内容（CLIの役割、標準ディレクトリ構成、初期設定、project解決順序、代表フロー）は変更していない。
- `.vitepress/sidebar-config.ts` の「遂行体系で回す」グループ先頭を `guide("遂行の技活用", "waza-guide")` へ更新した（グループ内の位置は不変）。
- 相互参照を追従修正したアクティブ文書: [[specdojo:kata-guide]]、[[specdojo:orchestrator-operation-guide]]、[[specdojo:specdojo-overview-guide]]（`based_on` を含む）、[[specdojo:use-case-guide]]、[[specdojo:command-reference]]、[[specdojo:directory-layout-reference]]、[[specdojo:reference-authoring-standard]]、[[specdojo:id-and-file-naming-standard]]（命名例）、`docs/ja/index.md`。
- 履歴蓄積ファイル（過去の result・他項目の個票）内の記述は凍結記録として原則そのままとし、リンク切れとなる live wikilink（`pjr-0157-cli-verb-taxonomy.md` の関連ドキュメント）のみ `[[specdojo:waza-guide]]` へ更新した。バックティック内の literal 記述や過去のファイルパス記録は変更していない。
- `npm run lint:md` と `npm run docs:build` はいずれもエラーなく完了した。`register build` により `generated/pjr-views.md` は再生成される。

## 5. 関連ドキュメント

- 変更対象: [[specdojo:cli-overview-guide]]（改称後は `specdojo:waza-guide`）
- 対になるガイド: [[specdojo:kata-guide]]（Kata/Waza の対応関係）
- 上位構成の根拠: [[specdojo:practice-system-composition-guide]]
- サイドバー設定（`docs/` 外ファイル）: `.vitepress/sidebar-config.ts`
- 対になる登録項目: [[prj-0001:pjr-a45t-ryu-guide-md-kata-guide-md-approach]]（ryu-guide.md 新設）
