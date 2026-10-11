---
specdojo:
  id: prj-0001:pjr-2t63-agent-members-split
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-05T22:59:51Z"
  due_on: null
  completed_at: "2026-10-07T13:32:07Z"
  conclusion: agent の定義を .specdojo/agent-members.yaml へ分け、名簿の読み込みで両ファイルを schema 検証して合成する。pm-members.yaml の agent はエラーにし（案 A）、pm-members.yaml の保護を外した。本リポジトリの agent 37 件を移行し、失われたコメントを補った
---

# PJR-2T63 agent の定義を pm-members.yaml から保護された設定へ分ける

## 1. 概要

`pm-members.yaml` には、人の名簿と agent の定義（provider・モデル・役割、起動コマンドを上書きする `command`）が同居している。`command` と provider の `command_template` は shell 経由で実行されるため、agent が名簿を書き換えられると任意のコマンドを実行できる。そのため b99b3042f で `pm-members.yaml` を agent の書き込み禁止対象にしたが、人の名簿（ロールや連絡先）まで agent から編集できなくなった。また `loadMemberRoster` は名簿を schema で検証せずに読む。

agent の定義を、保護された `.specdojo/` 配下の設定へ移す。人の名簿は `pm-members.yaml` に残し、通常の成果物として扱えるようにする。

## 2. 完了条件

- agent の定義を置くファイル（例: `.specdojo/agent-members.yaml`）を定め、`specdojo.config.json` の設定キー（例: `agent_members_path`、省略時は既定のパス）で指定できる。リポジトリ全体で 1 つとし、同じリポジトリの全 project が共有する。
- 名簿の読み込み（`loadMemberRoster`）は、人の名簿と agent の定義を合わせて 1 つの名簿として返す。呼び出し側（`exec`・`exec run`・`grade`・`schedule`）の扱いは変えない。
- 読み込み時に、両方のファイルを schema で検証する。nickname が両方を通じて一意でない場合、agent の定義のファイルに `type: human` がある場合は、ファイルと nickname を示してエラーにする。
- `pm-members.yaml` に `type: agent` の member がある場合は、ファイルと nickname を示してエラーにし、移行コマンドを案内する（下記「決めたこと」の案 A）。
- `pm-members.yaml` が agent を持たないことを読み込みで保証できた段階で、`pm-members.yaml` を agent の書き込み禁止対象から外す。agent の定義のファイルは `.specdojo/` 配下なので、既存の規則で保護される。
- schema を分ける。agent の定義の schema を新たに作り、`pm-members.yaml` の schema は人の member だけを受け付ける。
- 既存の利用リポジトリが移行できるよう、`pm-members.yaml` の agent の member を agent の定義のファイルへ移すコマンド（例: `specdojo config migrate-members`、`--dry-run` 付き）を用意する。
- テンプレートを分ける。`pm-members-template.yaml` は人の member だけにし、agent の定義のテンプレートを新たに作る。`pm-members.yaml` を前提にしたエラーメッセージや表示（`agent run --by` の未登録・無効のメッセージ、`exec trial` の反映先の表示など）を、agent の定義のファイルに合わせる。
- rulebook・recipe・template・sample（pm-members）、設定リファレンス、ディレクトリ構成リファレンス、exec 設定ガイド、コマンドリファレンス、移行ガイド、`CHANGELOG.md` を更新する。
- unit test で、2 つのファイルの合成、nickname の重複、型の取り違え、schema 違反、移行コマンド、保護の判定を確かめる。
- 本リポジトリ（prj-0001）の agent の member 39 件を新しいファイルへ移す。`.specdojo/` と `pm-members.yaml` は agent の書き込み禁止対象なので、この移行は統合後に orchestrator が移行コマンドで行う。
- `npm run check` が通る。

### 2.1. 決めたこと（2026-10-07、利用者が案 A を選択）

- `pm-members.yaml` に `type: agent` の member がある場合はエラーにし、移行コマンドを案内する（案 A）。agent を人の名簿から確実に締め出し、`pm-members.yaml` の保護を外すためである。既存の利用者には破壊的な変更になるため、移行ガイドと `CHANGELOG.md` に明記する。
- 不採用: 警告を出して読み込みを続ける案（案 B）。`pm-members.yaml` に agent を書けば実行できてしまい、保護を外せないため。

### 2.2. 実行時の注意

- 本リポジトリの `pm-members.yaml` には、統合まで agent の member が残る（移行は統合後に orchestrator が行う）。テストと検証は、本リポジトリの実際の名簿に依存させず、一時ディレクトリの名簿で確かめる。本リポジトリの名簿を読む既存のテストや CLI の検証が案 A のエラーで失敗する場合は、その依存を外す。

## 3. 作業内容

| No  | 作業                                                 | 担当         | 状態 | メモ                                                                    |
| --- | ---------------------------------------------------- | ------------ | ---- | ----------------------------------------------------------------------- |
| 1   | 読み込み・schema・保護の判定・移行コマンドを実装する | DEV          | done | 案 A                                                                    |
| 2   | scaffold と文書を更新する                            | DEV          | done | rulebook・recipe・template・sample・リファレンス・移行ガイド・CHANGELOG |
| 3   | 本リポジトリの agent の member を移行する            | orchestrator | done | 統合後に移行コマンドで行う（保護された設定のため）                      |

## 4. 対応結果

- repository 共通の agent 定義を `.specdojo/agent-members.yaml`（`agent_members_path` で変更可）へ分離し、`loadMemberRoster` が人間名簿と agent 定義を schema 検証後に合成するようにした。
- 型の取り違え、schema 違反、合成後の nickname 重複をファイル名と nickname 付きで拒否する。`pm-members.yaml` に agent が残る場合は `config migrate-members --dry-run` を案内する。
- `config migrate-members`、分割 schema・template、保護判定、エラーメッセージ、unit / integration fixture、rulebook・recipe・sample・各リファレンス・移行ガイド・CHANGELOG を更新した。
- 本リポジトリの実データでは agent member を 37 件検出した。計画記載の 39 件との差異はあるが、統合後に orchestrator が移行コマンドを実行する境界は維持し、本 executor では `.specdojo/` と実名簿を変更していない。

### 4.1. orchestrator による統合（2026-10-07）

- 親検証で `validate-schema` と `test-unit` が失敗し、waiting になった。`validate-schema` は本リポジトリの名簿が未移行のため（想定どおり）、`test-unit` は codex の修正漏れ（`config` のサブコマンド一覧と、nickname のエラーメッセージのテストの期待値）だった。
- コードの統合と名簿の移行を同時に行う必要があるため、orchestrator が runner を経ずに統合した。worktree でテストの期待値 2 件と `agent-members-template.yaml` の schema の modeline を直し、`config migrate-members` で agent 37 件を `.specdojo/agent-members.yaml` へ移した（人は 1 件）。計画の 39 件は、コメント中の `type: agent` まで数えた誤りだった。
- `npm run check` 相当の検証（型検査・lint・schema・catalog・履歴リンク・全テスト 2054 件）が通った状態で exec branch に commit し（6f80d107f）、develop へ merge した（6367dfc88）。統合後の `dist` で、名簿が人 1 件と agent 37 件として読み込めることを確かめた。
- 移行コマンドは YAML を出力し直すため、元の `pm-members.yaml` にあった provider ごとの区切りや説明のコメントが失われた。orchestrator が元のコメントを `.specdojo/agent-members.yaml` と `pm-members.yaml` へ戻した（882587494、値は変えていない）。

## 5. 関連ドキュメント

- [[specdojo:pm-members-rulebook]]（名簿の規範）
- [[specdojo:exec-config-guide]]（保護された設定の扱い）
