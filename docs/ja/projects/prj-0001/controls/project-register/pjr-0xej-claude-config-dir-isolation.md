---
specdojo:
  id: prj-0001:pjr-0xej-claude-config-dir-isolation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-08-25T22:47:29Z"
  due_on: "2026-10-31"
  register_events:
    - v: 1
      id: reg_4de0b8b1d1d9ecee6dd204904525fae2
      ts: "2026-08-25T22:49:27Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs(register): PJR-0XEJ claude系agentの設定ディレクトリ分離を起票する"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: claude系agentの設定ディレクトリを分離して並行実行できるようにする
        - field: description
          from: ""
          to: PJR-E6HG で特定したとおり、Claude Code は起動のたびに共有の設定ファイルを書き換えるため、複数の claude プロセスが並行すると競合して JSON パースに失敗する。Claude Code 側に修正の予定はない。CLAUDE_CONFIG_DIR で設定ディレクトリを分離すると、実測では設定ファイル・セッション・バックアップまで含めて分離されることを確認した。ただし分離先は未認証状態であるため、専用プロファイルの認証をどう扱うかが課題となる。分離により claude 系 agent をオーケストレーターの待機なしで実行できるようにする。
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: ARC
        - field: registered
          from: ""
          to: "2026-08-26"
        - field: due
          from: ""
          to: "2026-10-31"
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: 791c6e157b8b2fd6f29f9a6bcd88d5958868b76e
---

# PJR-0XEJ claude系agentの設定ディレクトリを分離して並行実行できるようにする

## 1. 概要

PJR-E6HG で特定したとおり、Claude Code は起動のたびに共有の設定ファイルを書き換えるため、複数の claude プロセスが並行すると競合して JSON パースに失敗する。Claude Code 側に修正の予定はない。CLAUDE_CONFIG_DIR で設定ディレクトリを分離すると、実測では設定ファイル・セッション・バックアップまで含めて分離されることを確認した。ただし分離先は未認証状態であるため、専用プロファイルの認証をどう扱うかが課題となる。分離により claude 系 agent をオーケストレーターの待機なしで実行できるようにする。

### 調査済みの事実

- 共有設定ファイルは約49 KB で、内容の大半は対話 UI のための状態である。ヒントの表示履歴（`tipsHistory` 37件、`tipLifetimeShownCounts` 36件）、機能フラグのキャッシュ（`cachedGrowthBookFeatures` 546件）、利用統計（`numStartups` など）が占める。headless 実行に本質的に必要なのはアカウント情報とプロジェクトごとの信頼・許可設定程度である。
- 書き込みは起動のたびに発生し、ファイル全体の書き直しになる。書き込みを抑止するオプションは CLI にも公開ドキュメントにも見当たらない。
- `CLAUDE_CONFIG_DIR` を指定して実行したところ、分離先に設定ファイル・`sessions`・`projects`・`backups` が生成され、共有設定とは独立することを実測で確認した。ただし分離先は未認証であり、`Not logged in` で終了する。

## 2. 完了条件

- 専用の設定ディレクトリで claude 系 agent を実行できる。認証をどう扱うかが決まり、記録されている。同一アカウントで複数プロファイルを持つことの可否も確認する。
- 認証情報の複製を伴う方式は採らない。既存の設定ディレクトリをコピーして渡す方式は、秘密を扱わない運用方針に反するため対象外とする。
- `exec-defaults.yaml` の `command_template` または起動処理から、agent ごとに環境変数を渡せる。設定できるのは既定の分離先であり、agent の evidence や設定ファイルから任意の環境変数を注入できないようにする。
- claude 系 agent を実行しながらオーケストレーターが並行して作業しても、共有設定の競合による失敗が発生しないことを確認できている。executor と reporter の双方で確認する。
- 分離先が未認証の場合の挙動が定義されている。実行前に検出して分かる形で失敗するか、従来の設定へ退避するかを決める。認証切れに気づかないまま実行が失敗し続ける状態を作らない。
- 実現できない場合は、その理由と代替（codex 系での統一、オーケストレーターの待機）を記録して完了とする。本項目は手段の実現性の確認を含む。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit`、`npm run test:integration` が成功する。

## 3. 作業内容

| No  | 作業                                                                             | 担当 | 状態 | メモ                                      |
| --- | -------------------------------------------------------------------------------- | ---- | ---- | ----------------------------------------- |
| 1   | 専用プロファイルの認証方法と、同一アカウントでの複数プロファイルの可否を確認する | ARC  | open | 実現性の判断。認証操作は利用者が行う      |
| 2   | agent ごとに環境変数を渡す仕組みを設計し、注入経路を限定する                     | ARC  | open | 任意の環境変数を agent 側から注入させない |
| 3   | 分離先が未認証の場合の挙動を決めて実装する                                       | ARC  | open | 気づかないまま失敗し続ける状態を作らない  |
| 4   | claude 系 agent と並行作業して競合が起きないことを確認する                       | ARC  | open | executor と reporter の双方               |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- 根本原因の記録: [[prj-0001:pjr-e6hg-claude-reporter-json-failure|PJR-E6HG claude-reporterがJSON解析失敗で再現性をもってブロックする]]
- agent の起動設定: [[specdojo:exec-config-guide|exec設定ガイド]]
- agent の権限方針: [[prj-0001:pjr-3s8q-agent-writable-config-scope|PJR-3S8Q agent が書き込める設定の範囲]]
