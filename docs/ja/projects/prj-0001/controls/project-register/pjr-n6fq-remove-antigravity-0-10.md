---
specdojo:
  id: prj-0001:pjr-n6fq-remove-antigravity-0-10
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-21T00:33:00Z"
  derived_from:
    - PJR-5V0T
---

# PJR-N6FQ 0.10.0 で Antigravity（agy）の対応を外す

## 1. 概要

provider の実装、配布テンプレート（templates/antigravity/ など）、init の選択肢、orchestrator launch、文書、テストから agy 対応を外す

## 2. 入力

- PJR-5V0T の決定（2026-11-21、indie）: 0.10.0 では agy の対応を外す
- 0.9.2 で agy の起動を止める作業は別の todo（PJR-5V0T を由来とする 0.9.2 の項目）で行う

## 3. 完了条件

- 対象の範囲を `grep -rliE 'antigravity|\bagy\b'` で `src`・`tests`・`templates`・`tools`・`scripts`・`docs/ja/specdojo`・`.agents`・`.github` から洗い出し、消したもの・残したもの（残した理由）を個票の対応結果に書く。
- antigravity の provider の実装（`src/exec`・`src/shared`・`src/commands`・`src/devcontainer`）と、0.9.2 で足した起動を止める処理を消す。0.9.2 の止める処理の代わりに、`agent-members.yaml` に provider が `antigravity` の member があると、理由と直し方を示すエラーになるようにする。
- 配布テンプレート（`templates/antigravity/`、`templates/init-agent-members.yaml`・`templates/init-exec-defaults.yaml`・`templates/devcontainer` の agy の部分）と、`init`・`config scaffold`・`devcontainer scaffold` の antigravity の選択肢を消す。
- オーケストレーターの agy 向けのラッパー（`.agents/rules` 側）を `orchestrator:sync` と `tools/validate-orchestrator-sync.mjs` の対象から外し、ラッパーのファイルを消す。`tools/update-agent-clis.mjs` などの道具からも agy を外す。
- テスト（`tests/src`・`tests/tools`）から agy の場合を消し、上のエラーのテストを足す。
- 文書（`docs/ja/specdojo` のガイド・リファレンス）から agy の説明を消す。過去の版の移行ガイドと CHANGELOG の過去の節は変えない。
- 保護された設定（`package.json` の `orch:argon`・`orch:flash` などのスクリプト、`.specdojo/agent-members.yaml`、`.specdojo/exec-defaults.yaml`）は変えない。変える案を個票の対応結果と報告の `handoff` に書く。反映は利用者の承認のもと feature ブランチで行う。
- `CHANGELOG.md` は変えない。個票の対応結果の `### 5.1. CHANGELOG に書く事項` に、区分（削除）と行の文案を書く。0.9.x で agy の member を残している利用者向けの移行の手順（member を消す、routing を替える、スクリプトを消す）も文案に含める。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                        | 担当 | 状態 | メモ                                                                                                                                                                                                                                                                                                                       |
| --- | ------------------------------------------- | ---- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 範囲を洗い出して対応結果に書く              | DEV  | done | 対応結果の「洗い出しの結果」に書いた                                                                                                                                                                                                                                                                                       |
| 2   | provider・テンプレート・選択肢を消す        | DEV  | done | provider の実装・0.9.2 の止める処理・`templates/antigravity/` を消し、名簿の読み込みでエラーにした                                                                                                                                                                                                                         |
| 3   | ラッパー・道具・テスト・文書から外す        | DEV  | done | 同期の対象・道具・テスト・文書から外した。保護された `.agents/rules/*.md` は利用者が develop で消し、schema の enum は再開後に外した                                                                                                                                                                                       |
| 4   | 保護された設定の案と CHANGELOG の文案を書く | DEV  | done | 対応結果の「保護された設定を変える案」と「CHANGELOG に書く事項」に書いた                                                                                                                                                                                                                                                   |
| 5   | 検証を通す                                  | DEV  | open | 親の検証（`npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` など）は runner が executor の後に実行するため、executor は結果を確かめられない。影響する単体テストのファイル 11 件（249 件）は executor で通した。前回の親の test-unit で落ちた `cli-verb-taxonomy.test.ts` は期待を直して通した |

## 5. 対応結果

0.10.0 に向けて、provider の実装・配布テンプレート・選択肢・道具・テスト・文書から Antigravity（agy）の対応を外した。`.specdojo/agent-members.yaml` に provider が `antigravity` の member があると、`disabled: true` でも名簿の読み込み（`loadMemberRoster`）で理由と直し方を示すエラーになる。

このリポジトリの保護された設定は、利用者の承認のもと develop に反映済み（d15436815）である。再開後に統合先と同期し、schema の enum から `antigravity` を外した（「保護された設定を変える案」を参照）。

### 5.1. CHANGELOG に書く事項

区分は「削除」。

- Antigravity（agy）の対応を外した。consumer plan では、他社の agent や application の中から agy を起動することを Antigravity の FAQ が対象外とし、Additional Terms の Section 6 が契約違反としているため（0.9.2 で起動を止めた）。provider の実装、`templates/antigravity/`、`init`・`config scaffold`・`devcontainer scaffold`・`orchestrator launch` の `antigravity`、内部用の `agent launch`、`init` の名簿と起動設定の agy の部分（`flash-*` の実体と `agy-*` の別名、`providers.antigravity`）を消した。
- `.specdojo/agent-members.yaml` に provider が `antigravity` の member があると、`disabled: true` でも名簿の読み込みで理由と直し方を示すエラーになる。0.9.x で agy の member を残している場合は、次の順で移す。
  1. `.specdojo/agent-members.yaml` から provider が `antigravity` の member と、それを向き先にする `aliases` を消す。
  2. `.specdojo/exec-defaults.yaml` の `routing`・`fallback_executor`、schedule の strategy の `phase_overrides[].agent`、Job・routine の `--executor-by` / `--reporter-by` にある agy の member を、ほかの member へ替える。あわせて `providers.antigravity` を消す。
  3. `package.json` から agy を起動する script（`orch:argon`・`orch:argon:work`・`orch:flash` など）を消し、`.specdojo/antigravity/` を消す。
- `config scaffold --provider <name> --global` は、ユーザー設定を持つ provider が無くなったため、指定するとリポジトリへ書き込む前にエラーになる。

### 5.2. 洗い出しの結果

`grep -rliE 'antigravity|\bagy\b'` で `src`・`tests`・`templates`・`tools`・`scripts`・`docs/ja/specdojo`・`.agents`・`.github` を洗い出した（`scripts` は存在しない）。

消したもの:

- `src`: `src/shared/antigravity-block.ts`・`src/exec/antigravity-session.ts` を消した。`agent-config.ts`・`run/shared.ts`・`commands/orchestrator.ts`・`commands/init.ts`・`devcontainer/scaffold.ts`・`shared/provider-scaffold.ts` の止める処理と agy の分岐、`task-repos.ts` の `antigravity` の場合、`AgentProvider` の `antigravity`、`agent launch` サブコマンド、`provider-scaffold.ts` の agy の npm script と `--global` 用のユーザー設定のマージ処理（agy だけが使っていた）を消した。
- `src/shared/specdojo-config.ts`: 0.9.2 の止める処理の代わりに、名簿に provider が `antigravity` の member があるとエラーにする検査を schema の検証の前に足した。
- `templates`: `templates/antigravity/` を消した。`init-agent-members.yaml` の `flash-*` の実体と `agy-*` の別名、`init-exec-defaults.yaml` の `providers.antigravity`、`devcontainer/post-create.sh` の `~/.config/antigravity` を消した。
- `tools`: `validate-orchestrator-sync.mjs` の対象（`orchestrator:sync` も同じ一覧を使う）から `templates/antigravity/orchestrator.md` を外した。`update-agent-clis.mjs` と `exec/verify-multi-repo-agent-write.sh` から agy を外した。
- `tests`: agy 専用のテスト 3 ファイルと、各テストの agy の場合を消した。`tests/src/shared/specdojo-config.test.ts` に、agy の member（`disabled` の有無の両方）がエラーになるテストを足した。`tests/src/cli-verb-taxonomy.test.ts` の `agent` のサブコマンドの期待を `run` だけに直した。`tests` を grep し、`agent launch` や `antigravity` を前提にしたテストがほかに残っていないことを確かめた（残る一致は、名簿のエラーのテストと `post-create.sh` に agy が入らないことの検査、無関係の track 名 `launch`）。
- 文書: `exec-config-guide`・`orchestrator-operation-guide`・`command-reference`・`specdojo-config-reference`・`quick-start-guide`・`exec-operation-guide`・`remote-host-development-guide`・`job-sequence-guide`・`specdojo-overview-guide` と `README.md` から agy の説明を消した。`command-reference` と `README.md` には、0.10.0 で外した理由と移行の操作を 1 段落だけ残した。

残したもの（理由）:

- オーケストレーターの SSOT `.agents/specdojo-orchestrator.agent.md`: codex の `orch:sol` なども使うため残す。
- `src/exec/limit.ts` の相対の reset（`Resets in 4h36m50s`）の読み取り: provider に依らない処理のため残し、コメントだけ直した。
- `src/exec/agent-protected-config.ts` の `.agents/rules/` の保護: ほかの agent 設定も守る一般の規則のため残した。
- `tests/src/devcontainer/scaffold.test.ts` の、生成する `post-create.sh` に agy のインストールが入らないことの検査: 回帰を防ぐため残した。
- `docs/ja/specdojo/guides/release-v0-3-0-migration-guide.md` と `CHANGELOG.md`: 完了条件のとおり過去の版の記述は変えない。
- 洗い出しの範囲外: このリポジトリの開発環境（`.devcontainer/`・`CONTRIBUTING.md` の agy の導入とボリューム）と、プロダクトの設計書（`sysd-antigravity-agent-settings` などの `docs/ja/product/040-system-design/`）。`.devcontainer/`・`CONTRIBUTING.md` と `config scaffold`・`exec scaffold` の `--global` の扱いは、利用者の指示によりこの項目では変えない。

### 5.3. 保護された設定を変える案

1 から 5 は利用者の承認のもと develop に反映済み（d15436815）。6 は再開後に executor が反映した。7 と 8 は利用者の指示によりこの項目では行わない。

1. `.specdojo/agent-members.yaml`: provider が `antigravity` の member 11 件（`flash-executor`・`flash-high-executor`・`argon-executor`・`flash-high-review-executor`・`hydrogen-executor`・`hydrogen-review-executor`・`flash-reporter`・`agy-sonnet-executor`・`agy-opus-executor`・`agy-opus-review-executor`・`agy-gpt-oss-executor`）と注記の節を消す。向き先にする別名は無い。
2. `.specdojo/exec-defaults.yaml`: `providers.antigravity` の節と、routing の agy の注記を消す。agy の member を参照する routing は無い。
3. `package.json`: `orch:flash`・`orch:flash:work`・`orch:argon`・`orch:argon:work` を消す。
4. `lefthook.yml`: `orchestrator-sync` の glob から `templates/antigravity/orchestrator.md` を消す。
5. `.agents/rules/*.md`（6 件）を消す。
6. 1 から 3 を反映した後、`agent-members.schema.yaml`・`exec-defaults.schema.yaml` の enum から `antigravity` を消し、`npm run validate:schema` を通す。
7. 任意: `.devcontainer/`（agy のインストール、`specdojo-antigravity` のボリューム、`prepare-agent-dirs.sh`）と `CONTRIBUTING.md` の agy の説明を消す。
8. 任意: 使い道が無くなった `config scaffold` / `exec scaffold` の `--global` オプションを消す（今回は CLI の互換のため残し、指定するとエラーにした）。

## 6. 関連ドキュメント

- [[prj-0001:pjr-5v0t-antigravity-provider-support]]: 0.10.0 で agy の対応を外す決定の由来。
- [[prj-0001:pjr-nje4-hotfix-0-9-2-block-antigravity]]: 0.9.2 で起動を止めた処理。今回その処理を消した。
- [[specdojo:exec-config-guide]]・[[specdojo:orchestrator-operation-guide]]・[[specdojo:command-reference]]: agy の説明を消した文書。
