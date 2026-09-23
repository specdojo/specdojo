---
specdojo:
  id: prj-0001:pjr-fkn1-kata-distribution-method
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-09-23T03:10:29Z"
  due_on: "2026-10-03"
---

# PJR-FKN1 kata の配布方式を node_modules 参照を既定とし eject で上書きする方式に決める

## 1. 背景

npm 公開後、利用プロジェクトは `npm install specdojo` と `npx specdojo config init` から Detached Unit を立ち上げる。空のリポジトリで実測したところ、register 系は単独で動作するが、次が動かない。

| コマンド                              | 結果                                                                                   |
| ------------------------------------- | -------------------------------------------------------------------------------------- |
| `register scaffold` / `add` / `build` | 成功                                                                                   |
| `dashboard build`                     | 成功                                                                                   |
| `catalog scaffold`                    | 失敗（`catalog_path not set`）                                                         |
| `exec plan --register`                | 失敗（`Template not found: docs/ja/specdojo/exec-templates/xep-register-template.md`） |

CLI は `specdojoRootDir()`（利用者のリポジトリルート）を基準に kata と schema を探す。npm package の `files` には `docs/ja/specdojo` と `docs/specdojo` が含まれ `node_modules/specdojo/docs/` として配布されるが、そこから利用リポジトリへ配置するコマンドが無い。README は「Use this template から作る」または「このリポジトリの `docs/ja/specdojo/` を参照する」と案内しており、npm 導入と両立していない。

配布対象の規模は次のとおり。

| 種別                                              | ファイル数 | 性質                             |
| ------------------------------------------------- | ---------- | -------------------------------- |
| `exec-templates`                                  | 31         | 機械入力。CLI の出力形式と密結合 |
| `schemas`                                         | 39         | 機械入力。CLI のバージョンと対応 |
| `templates`                                       | 62         | 成果物の雛形                     |
| `rulebooks` / `standards` / `samples` / `recipes` | 250        | 規範文書。人と agent が読む      |
| `guides` / `references` / `philosophy`            | 43         | SpecDojo 自体の説明              |

## 2. 検討した選択肢

| 選択肢 | 内容                                                  | 利点                                                      | 懸念                                                                                                    |
| ------ | ----------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| A      | 全量コピー。`kata install` で利用リポジトリへ配置する | 利用者のリポジトリだけで規範が完結し、docs サイトも作れる | 更新のたびに巨大な差分が出る。CLI と kata のバージョン不整合が起きる。取り込みが 3-way merge 問題になる |
| B      | 参照のみ。常に `node_modules` から読む                | 差分が出ず、更新は `npm update` だけ                      | 規範を変えられない。プロジェクト固有の rulebook を持てない                                              |
| C      | 参照を既定とし、上書きしたいものだけ eject する       | 更新が軽く、変更した分だけが git に残る                   | 解決順序の実装が要る。wikilink と docs サイトの解決に判断が要る                                         |

## 3. 決定内容

選択肢 C を採る。種別ごとに扱いを分ける。

| 種別                                              | 既定     | eject |
| ------------------------------------------------- | -------- | ----- |
| `exec-templates`                                  | 参照     | 不可  |
| `schemas`                                         | 参照     | 不可  |
| `templates`                                       | 参照     | 可    |
| `rulebooks` / `standards` / `samples` / `recipes` | 参照     | 可    |
| `guides` / `references` / `philosophy`            | 配布不要 | -     |

解決順序は「利用リポジトリの `docs/ja/specdojo/<path>` → 無ければ `node_modules/specdojo/docs/ja/specdojo/<path>`」とする。`docs/specdojo/schemas` も同様とする。

全量コピーは `kata install --all` として残し、docs サイトで kata も配信する場合やオフライン運用の選択肢とする。既定にはしない。

## 4. 採択理由

- 機械入力（schema と exec-templates）は CLI 実装と同時に変わる。コピーしておくと CLI だけ更新したときに食い違って壊れる。`package-lock.json` を唯一の真実にするほうが安全である。
- 4.1 MB・250 ファイルをコピーすると、kata を上げるたびに利用者のリポジトリへ巨大な差分が出る。exec の記帳 commit を嫌って Detached Unit を既定にしたのと同じ問題が別の形で戻る。
- eject したファイルだけが git に入るため、そのプロジェクトが何を変えたかが一目で分かる。[[specdojo:practice-system-composition-guide]] の「同じ完全 ID を維持して override する」とも整合する。
- 選択肢 B は、業界固有の variant や プロジェクト固有の rulebook を持てず、SpecDojo の前提と合わない。

## 5. 承認

| 項目     | 内容                                     |
| -------- | ---------------------------------------- |
| 決定者   | _TODO_                                   |
| 決定日   | _TODO_                                   |
| 承認方式 | commit                                   |
| 証跡     | _TODO_: close 時の遷移 commit を記載する |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                                                     |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 影響範囲   | kata と schema を参照する 13 ファイル 22 箇所、wikilink 解決、`index build`、worktree 実行、docs サイト生成、README と quick-start-guide |
| 必要な対応 | 実装は [[prj-0001:pjr-ypns-kata-resolution-and-commands]]、文書は同項目の作業として扱う                                                  |
| 追跡先     | [[prj-0001:pjr-ypns-kata-resolution-and-commands]]                                                                                       |

参照方式の弱点は、利用リポジトリだけを見ても適用中の規範が分からないことである。`package-lock.json` でバージョンは固定されるため再現できるが、レビュー時には参照が要る。`kata show <id>` のような閲覧コマンドと公開サイトへのリンクで補う。

## 7. 関連ドキュメント

- [[prj-0001:pjr-ypns-kata-resolution-and-commands]]
- [[prj-0001:pjr-tbhh-detached-unit-default]]
- [[specdojo:practice-system-composition-guide]]
- [[specdojo:quick-start-guide]]
- `README.md`
