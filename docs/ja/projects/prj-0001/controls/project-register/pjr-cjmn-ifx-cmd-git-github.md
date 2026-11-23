---
specdojo:
  id: prj-0001:pjr-cjmn-ifx-cmd-git-github
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  owner: ARC
  registered_at: "2026-11-15T09:55:52Z"
  completed_at: "2026-11-22T14:07:08Z"
  conclusion: ifx-cmd-git-cli と ifx-cmd-github-cli を draft で作り、カタログに登録し、ifx-index と ifd-specdojo の PATH-07 の留保の追跡先を付け替えた。未決の点は _UNDECIDED_ で残した
  commit_type: docs
  commit_scope: ifx
---

# PJR-CJMN Git・GitHub の外部コマンド連携仕様（ifx-cmd-git-cli・ifx-cmd-github-cli）を作る

## 1. 概要

Git と GitHub CLI の連携仕様を ifx-cmd の型で作り、ifx-index と ifd-specdojo からつなぐ

## 2. 入力

- kata-wave-1 で ifx-index と ifd-specdojo を確定するとき、Git・GitHub 連携の詳細仕様が未着手のため期限付きの留保とした（indie が 2026-11-15 に承認、PJR-TN43）
- ifx-index の Git と GitHub の 2 件（詳細契約は未着手）と、ifd-specdojo の PATH-07（GitHub 接続の経路・認証・失敗後の保持範囲）をまとめて扱う。手本は ifx-cmd-ai-provider-cli

## 3. 完了条件

- `ifx-cmd` の型（rulebook と sample）に従い、Git の外部コマンド連携仕様（`ifx-cmd-git-cli`）と GitHub CLI の外部コマンド連携仕様（`ifx-cmd-github-cli`）を新しく作る。手本は `ifx-cmd-ai-provider-cli` とする。どちらも `status: draft` で作る。
- 中身は実装（`src/` の git と gh の呼び出し）と設定を読んで書き、根拠のファイルを示す。分からない点は `_UNDECIDED_` で残し、推測で埋めない。
- `ifx-cmd-github-cli` に、ifd-specdojo の PATH-07 の論点（GitHub 接続の経路・認証・失敗後の保持範囲）を扱う章を置く。
- 2 文書をカタログへ登録する（利用者の決定、2026-11-22、indie）。
- `ifx-index` の Git と GitHub の 2 件と、ifd-specdojo の PATH-07 の留保の追跡先を、新しい 2 文書へ付け替える。変えるのは留保と参照の行だけとし、ready の文書の `status` は変えない。
- 型の grade は統合の後に orchestrator が流す。executor は grade を実行しない。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                                                                      | 担当 | 状態 | メモ                                                                |
| --- | ----------------------------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------------------------- |
| 1   | `src/shared/git.ts` などと devcontainer・exec設定ガイドを読み、git と gh の呼び出しを確認 | ARC  | done | git は spawnSync で起動。gh を起動する実装と git push・fetch はなし |
| 2   | `ifx-cmd-git-cli.yaml` を draft で作成                                                    | ARC  | done | schema 検証済み。未決は `_UNDECIDED_` で残した                      |
| 3   | `ifx-cmd-github-cli.yaml` を draft で作成し、PATH-07 の論点を整理                         | ARC  | done | 先頭コメントに経路・認証・失敗後の保持範囲を置いた                  |
| 4   | カタログへ 2 文書を登録                                                                   | ARC  | done | `dct-external-interface-specs.yaml`                                 |
| 5   | ifx-index の 2 件と ifd-specdojo の PATH-07 の留保・参照を付け替え                        | ARC  | done | `status` は変更なし                                                 |
| 6   | 型の grade の起動                                                                         | ARC  | open | 統合後に orchestrator が流す（executor は実行しない）               |

## 5. 対応結果

### 5.1. 実施内容

- `docs/ja/product/020-external-interface-specs/` に `ifx-cmd-git-cli.yaml` と `ifx-cmd-github-cli.yaml` を `status: draft` で作成した。手本は `ifx-cmd-ai-provider-cli`。両方とも schema 検証に通った。
- カタログ `dct-external-interface-specs.yaml` に 2 文書を登録した（利用者の決定、2026-11-22、indie）。
- `ifx-index.yaml` の Git・GitHub の 2 件の `spec_ref` を `TBD` から新文書へ変え、留保と参照のコメントを付け替えた。
- `ifd-specdojo.md` の PATH-07 の行と留保の行を、新文書（draft）への参照へ変えた。`status` は変えていない。

### 5.2. 調査で分かったこと（根拠）

- git は `src/shared/git.ts` の `gitResult` が `spawnSync("git", ["-C", cwd, ...])` で起動する。環境は `src/shared/git-environment.ts` で隔離し、index.lock と dubious ownership は再試行する。
- `src` に gh の起動と、git の push・fetch・pull・clone・remote の呼び出しはない。gh は devcontainer に導入され、認証は named volume に保管される。executor・reporter は gh と git push を deny し、オーケストレーターは読み取りだけを許す（exec設定ガイド）。
- このため `ifx-cmd-github-cli` は「SpecDojo が gh を呼ぶ契約」ではなく、現行の利用境界と未決の方針を記す文書にした。

### 5.3. 決めた内容と理由

- Git の契約はローカル操作に限った。リモートを呼ぶ実装がなく、ifx-index の注記も混ぜない方針のため。
- `ifx-cmd-git-cli` の `max_attempts` は 2 種の上限（index.lock と一時失敗）があり、schema の単一整数で表せないため `_UNDECIDED_` とした。
- PATH-07 の章は、YAML に章がないため `ifx-cmd-github-cli.yaml` の先頭コメントに 3 論点（経路・認証・失敗後の保持範囲）として置いた。
- gh の終了コード 4 は公式表と未照合のため、その旨を `_UNDECIDED_` で残した。

### 5.4. 残課題

- 両文書の `_UNDECIDED_`（時間上限、並列数、gh の書き込み操作の許可範囲、トークン種別・スコープ、gh 終了コードの照合）。
- cpd-specdojo-cli・cnd-specdojo・cxd-specdojo に `（未作成）` の記述が残る。本タスクの範囲外のため変えていない。後続で付け替えが必要。
- 型の grade は統合後に orchestrator が流す。

### 5.5. CHANGELOG に書く事項

- 区分: Documentation。
- 文案: Git CLI と GitHub CLI の外部コマンド連携仕様（`ifx-cmd-git-cli`・`ifx-cmd-github-cli`、draft）を追加し、外部システムI/F一覧の `spec_ref` を付け替えた。

## 6. 関連ドキュメント

- [[ifx-index]]
- [[ifd-specdojo]]
- [[prj-0001:dct-external-interface-specs]]
