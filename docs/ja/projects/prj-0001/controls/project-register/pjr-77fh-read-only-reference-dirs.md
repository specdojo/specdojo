---
specdojo:
  id: prj-0001:pjr-77fh-read-only-reference-dirs
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-23T10:55:54Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-EKGQ
  commit_type: feat
  commit_scope: config
---

# PJR-77FH 参照だけに使うディレクトリを設定で宣言できるようにする

## 1. 概要

repos は exec の変更の対象、external_projects は起票の対象で、読むだけのリポジトリを宣言できない。specdojo.config.json と local の設定で参照のディレクトリを宣言し、読み取りだけを許す

## 2. 入力

- 利用者の依頼（2026-11-23）: repos と `external_projects` のほかに、単なる参照だけの設定を specdojo.config.json と specdojo.local.config.json に書けるようにする。v0.10.0 に入れる

## 3. 完了条件

- 参照だけに使うディレクトリ（ほかのリポジトリのコード・文書など）を宣言できる設定を足す（利用者の依頼、2026-11-23）。今の `repos` はプロダクトのリポジトリとして exec の変更・worktree・統合の対象になり、`external_projects` は別のリポジトリの登録簿への起票の対象で、どちらも「読むだけ」の用途に使えない。オーケストレーターの指示は「宣言していないリポジトリは参照も変更もしない」としているため、読むだけのリポジトリを宣言する手段が要る。
- 設定のキーの名前（例: `references`・`read_only_paths`）と置き場所（トップレベルか project か、両方か）を executor が決め、理由を個票の対応結果に書く。各項目は少なくとも別名と `path` を持つ。
- `specdojo.config.json` と `specdojo.local.config.json` の両方に書ける。local では、既存の別名の `path` の差し替えと、新しい別名の追加ができる（`repos`・`external_projects` の上書きの規則にそろえる）。上書きの後に、共有の設定と同じ検証を受ける。linked worktree では、主の作業ツリーのルートから `path` を解決する（PJR-EKGQ と同じ考え方）。存在しない `path` の扱いを決める。
- 宣言した参照のディレクトリは、読み取りだけを許す。`orchestrator launch` は、参照のディレクトリを読める範囲に足す（provider ごとに、読み取りだけを許す形にできるなら読み取りだけにする）。exec の executor・reviewer にも読ませるかを executor が決め、読ませる場合は書き込みを許さない。worktree・統合・commit の対象にはしない。
- `specdojo config show` に、参照のディレクトリと解決したパスを出す。
- オーケストレーターの指示の本文（SSOT）の「宣言していないリポジトリは参照も変更もしない」の行を、参照のディレクトリを読んでよいことに直す案を、個票の対応結果と報告の `handoff` に書く（指示の本文は保護された設定のため、反映は利用者の承認のもとでオーケストレーターが行う）。
- 単体テストを足す（設定の検証、local の上書き、worktree での解決、`launch` の読める範囲、書き込みを許さないこと）。
- 設定リファレンスと、関連するガイド・コマンドリファレンスを直す。
- v0.10.0 に入れる（利用者の決定、2026-11-23）。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。統合の後に orchestrator が `exec smoke` を流し、参照のディレクトリを宣言した設定で `config show` と `orchestrator launch --dry-run`（あれば）を確かめてから close する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
