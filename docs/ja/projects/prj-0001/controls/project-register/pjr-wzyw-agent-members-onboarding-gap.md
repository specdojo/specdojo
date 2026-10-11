---
specdojo:
  id: prj-0001:pjr-wzyw-agent-members-onboarding-gap
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-10-08T12:38:03Z"
  due_on: null
  completed_at: "2026-10-08T13:20:28Z"
  conclusion: members_path がなくても .specdojo/agent-members.yaml の agent を読み込み、名簿の読み込みのエラーの原因を表示するようにした。codex・copilot・antigravity のテンプレートの案内を agent-members.yaml へ改め、スニペットを agent-members-snippet.yaml に改名した
---

# PJR-WZYW agent の定義の分離が、新しい利用者の導入の経路に追従していない

## 1. 課題内容

公開物（npm pack の tarball）での実地の確認（2026-10-08）で判明。(1) loadMemberRoster は project に members_path がないと何も読まずに返すため、config init の既定の設定では .specdojo/agent-members.yaml の agent が読まれず、exec で agent を使えない。(2) templates の codex・copilot・antigravity の README と pm-members-snippet.yaml が、agent の定義を pm-members.yaml へ書くよう案内したままで、そのとおりにすると読み込みがエラーになる。(3) 名簿の schema 違反などの読み込みのエラーを exec run が「agent nickname not found」とだけ表示し、原因が利用者に伝わらない。

## 2. 影響範囲

| 観点         | 影響                                                                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| スコープ     | 名簿の読み込み（`loadMemberRoster`）、provider のテンプレート（codex・copilot・antigravity の README と `pm-members-snippet.yaml`）、exec run のエラーの表示 |
| スケジュール | v0.3.0 の公開を止める（公開の判定基準 3）                                                                                                                    |
| コスト       | 新しい利用者が agent での実行に進めない                                                                                                                      |
| 品質         | 案内どおりに設定すると読み込みがエラーになり、そのエラーの原因も表示されない                                                                                 |
| 関係者       | v0.3.0 を新しく導入する利用者と、v0.2 から移行する利用者                                                                                                     |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                             |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | PJR-2T63 で agent の定義をリポジトリ全体の `.specdojo/agent-members.yaml` へ分けたが、読み込みは人の名簿（`members_path`）がある場合だけ行う作りのままだった。テンプレートの案内も追従しなかった。本リポジトリは `members_path` を設定していたため気づかなかった |
| 対応策   | 下記の「完了条件の詳細」のとおり                                                                                                                                                                                                                                 |
| 依存事項 | PJR-2T63（agent の定義の分離）                                                                                                                                                                                                                                   |
| 完了条件 | 下記の「完了条件の詳細」を満たす                                                                                                                                                                                                                                 |

### 3.1. 完了条件の詳細

- `members_path` を持たない project でも、`.specdojo/agent-members.yaml`（または `agent_members_path`）があれば agent を読み込み、名簿として返す。人の名簿がない場合は agent だけの名簿にする。両方がない場合の扱いは今と変えない。
- agent の定義のファイルの schema の検証、nickname の重複の検査、`pm-members.yaml` の `type: agent` をエラーにする扱いは、今と変えない。
- `exec run`・`agent run`・`grade`・`schedule` など名簿を使う箇所で、名簿の読み込みのエラー（ファイルの不在、schema の違反、重複など）を「agent が見つからない」に置き換えず、原因（ファイルと理由）をそのまま表示する。
- `templates/codex`・`templates/copilot`・`templates/antigravity` の README と、`pm-members-snippet.yaml` を、agent の定義を `.specdojo/agent-members.yaml` へ書く案内に改める。スニペットのファイル名も内容に合わせて改める（例: `agent-members-snippet.yaml`）。`config scaffold` がスニペットをコピーする先と、その表示も合わせる。ほかの provider（claude・opencode）のテンプレートに同じ古い案内があれば同様に直す。
- unit test で、`members_path` がない project で agent を読み込めること、読み込みのエラーの原因が表示されることを確かめる。
- `npm run check` が通る。

## 4. 対応結果

- `loadMemberRoster` が人間名簿と agent 名簿を独立に読み込み、project に `members_path` がなくても `.specdojo/agent-members.yaml`（または `agent_members_path`）から agent だけの名簿を返すようにした。両方の名簿がない場合は従来どおり `null` を返す。
- `loadRosterForExecutionPath` が名簿読み込み時の例外を握りつぶさないようにし、`exec run`・`agent run`・schedule・grade など同じ読み込み経路を使う処理へ、ファイル不在・YAML/schema 違反・nickname 重複の原因がそのまま伝わるようにした。
- copilot と antigravity の `pm-members-snippet.yaml` を `agent-members-snippet.yaml` へ改名し、provider README、Codex README、exec 設定ガイド、`config scaffold` の完了表示を `.specdojo/agent-members.yaml` へ agent 定義を置く案内に統一した。antigravity のスニペットには agent schema の必須フィールドも補った。
- unit test に、`members_path` のない project で agent を読み込むケース、両名簿がない従来ケース、`exec run` が schema 違反を nickname 未検出へ置き換えないケース、scaffold の改名後の配置先と表示を追加した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-2t63-agent-members-split]]（agent の定義の分離）
- [[prj-0001:pjr-p8tk-release-stabilization-criteria]]（公開の判定基準）
