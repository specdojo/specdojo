---
specdojo:
  id: prj-0001:pjr-77fh-read-only-reference-dirs
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-23T10:55:54Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-24T01:45:00Z"
  conclusion: 読むだけの参照先を specdojo.config.json と specdojo.local.config.json の references で宣言できるようにし、対話のオーケストレーターには読むだけで公開するようにした
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

| No  | 作業                         | 担当               | 状態 | メモ                                                                                                        |
| --- | ---------------------------- | ------------------ | ---- | ----------------------------------------------------------------------------------------------------------- |
| 1   | 設定・local 上書き・パス検証 | DEV                | done | トップレベルに `references` を追加。実パスで管理リポジトリとの重なりを拒否する。                            |
| 2   | 起動時の参照権限・設定表示   | DEV                | done | provider 別の編集拒否と `config show` の解決パス表示を追加。exec には追加公開しない。                       |
| 3   | 単体テスト・schema・文書     | DEV                | done | 設定の異常系、local、linked worktree、起動引数・権限、evidence を追加・更新。テスト実行は親 runner の担当。 |
| 4   | 保護された指示の反映         | オーケストレーター | open | executor は保護された設定を編集できないため、5.2 の案を利用者の承認後に反映する。                           |
| 5   | 統合後の smoke・実 CLI 確認  | オーケストレーター | open | 実 agent を使う確認は sandbox 外の操作が必要。5.3 に従って close 前に実施する。                             |

## 5. 対応結果

### 5.1. 実装と判断

- 設定名を `references`、置き場所をトップレベルにした。読むだけの用途を `repos`・`external_projects` と分け、全 project で同じ参照先を共有するためである。別名をオブジェクトのキー、値を `{ "path": "../library" }` とする。
- local は同じ別名の `path` を差し替え、新しい別名を追加する。上書き後に共有設定と同じ検証を行い、`reference-path`・`reference-added` として設定表示・executor evidence に由来を記録する。evidence schema も拡張した。
- 相対パスの基準は linked worktree でも主の作業ツリーとする。存在しないパス、ファイル、絶対パス、未知のキーはエラーにする。symlink を解決した実パスがプロジェクトリポジトリ、全 project の `repos`、`external_projects` と一致・包含する場合も拒否する。書き込み許可との重複を防ぐためである。
- `orchestrator launch` は Claude Code の `Edit` deny、Copilot の `write` deny、OpenCode の `external_directory` allow と `edit` deny を加える。Codex は `workspace-write` の外部読み取りを使い、参照先を `--add-dir` に渡さない。追加の `writable_roots` と `/tmp`・`TMPDIR` の暗黙の書き込み許可も起動引数で外す。Claude Code・Copilot・OpenCode の規則はファイルツールの拒否であり、任意の shell・MCP を OS レベルで隔離するものではない。この制約と読み取り専用マウントの扱いを設定リファレンスに記載した。
- exec の executor・reviewer には参照先を追加公開しない。今回は対話時の調査を対象とし、編集・レビュー実行の権限を広げないためである。参照先はプロダクトリポジトリの解決に入れず、worktree・setup・commit・統合の対象にしない。
- `config show` は別名、設定パス、解決した実パス、`read-only`、共有/local の由来を表示する。設定リファレンス、コマンドリファレンス、オーケストレーター運用ガイドを更新した。v0.10.0 の追加機能として記載し、版番号の変更はリリース作業に委ねる。
- 設定検証・local 差し替えと追加・worktree 解決・権限・evidence schema の単体テストを追加した。指定された単体テスト・型検査・lint は親 runner が実行する。executor は result・状態項目・保護された設定・`CHANGELOG.md` を編集していない。
- executor の検証では Prettier、設定 schema、登録簿の生成、履歴リンク、catalog 検証が成功した。catalog の変更対象外の文書・参照に関する警告は残る。

### 5.2. 保護された指示の変更案

利用者の承認後に、オーケストレーターが `.agents/specdojo-orchestrator.agent.md` の「宣言していないリポジトリは参照も変更もしない」の行を含む箇条書きへ、次の内容を反映する。その後 `npm run orchestrator:sync` で provider 用ラッパー・配布テンプレートを同期する。executor はこの変更を行っていない。

> トップレベルの `references` に宣言されたディレクトリ（local で追加・パスを差し替えたものを含む）は読み取りだけを許す。参照先で編集・起票・worktree 作成・commit・統合を行わない。有効な別名とパスは `specdojo config show` で確かめる。`repos`・`external_projects`・`references` のいずれにも宣言していないリポジトリは参照も変更もしない。

既存の `repos` に対する実装者指定・feature branch・push 禁止の条件は維持する。共有/local の実設定への参照先の追加と `package.json` の版番号変更も、executor の変更対象に含めない。

### 5.3. 統合後の確認

オーケストレーターが `specdojo exec smoke --project prj-0001` を実行し、参照先を宣言した共有/local 設定で `specdojo config show --project prj-0001` を確認する。`orchestrator launch` に `--dry-run` は無いため、実 provider CLI を起動し、参照先を読めることとファイルツールの書き込みが拒否されることを確かめる。Codex は sandbox の参照先への書き込み拒否も確認する。Copilot は `copilot help permissions` に `write(path)` の glob 対応がある版を使用する。OpenCode は既存の V1 権限形式を使用する版が対象で、V2 移行は本項目の対象外とする。

### 5.4. CHANGELOG に書く事項

- 区分: 追加（v0.10.0）。
- 文案: 共有・local 設定の `references` で読むだけのディレクトリを宣言できるようにした。local のパス差し替え・別名追加、主 worktree 基準の解決、`config show` の実パス表示と provider 別の参照権限に対応した。参照先は exec の worktree・commit・統合の対象にしない。

## 6. 関連ドキュメント

- [[specdojo:specdojo-config-reference|設定リファレンス]]
- [[specdojo:command-reference|コマンドリファレンス]]
- [[specdojo:orchestrator-operation-guide|オーケストレーター運用ガイド]]
- [[prj-0001:pm-orchestrator-playbook|prj-0001 のオーケストレーター運用メモ]]
