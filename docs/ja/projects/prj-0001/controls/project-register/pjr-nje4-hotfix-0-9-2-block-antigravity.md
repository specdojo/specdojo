---
specdojo:
  id: prj-0001:pjr-nje4-hotfix-0-9-2-block-antigravity
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-21T00:32:31Z"
  derived_from:
    - PJR-5V0T
---

# PJR-NJE4 0.9.2 で Antigravity（agy）の起動を止める

## 1. 概要

hotfix 0.9.2 で、exec・grade・orchestrator などから agy を起動しようとしたら起動前にエラーで止め、init で antigravity を選べないようにする。文書に注意書きを足す

## 2. 入力

- PJR-5V0T の決定（2026-11-21、indie）: 0.9.2 では警告にとどめず、agy の起動そのものを止める
- consumer plan では、他社の agent や application の中から agy を起動することを Antigravity の FAQ が対象外、Additional Terms Section 6 が契約違反としている（根拠の URL は PJR-5V0T の入力）
- 0.9.1 では init で antigravity を選んだ利用者だけに agy の member と `command_template` が入る（既定の provider は codex）。init 済みの利用者の .specdojo/ の設定は新しい版を入れても残るため、実行時に止める必要がある
- prj-0001 では名簿の disabled と `command_template` の削除で止めている（afbebe967）。exec run が名前で指定された disabled の member を断らない件は PJR-77JB

## 3. 完了条件

- provider が `antigravity` の member を executor・reporter・review・grade・trial などで起動しようとしたら、agent を起動する前にエラーで止める。名前で指定した場合、自動選択の場合、代わりの agent として選ばれた場合のどれでも止める。自動選択と代わりの選択では、agy の member を候補から外し、ほかの member へ進む。
- `specdojo agent launch --provider antigravity` と `specdojo orchestrator launch --provider antigravity` も、agy を起動する前にエラーで止める。0.9.1 の init が書く command_template はこの `agent launch` を通るため、init 済みの利用者の設定もここで止まる。
- エラーの文は、止めた理由（consumer plan では他社の agent や application から agy を起動することを、Antigravity の FAQ が対象外、Additional Terms Section 6 が契約違反としている）、根拠の URL（<https://antigravity.google/docs/faq> と <https://antigravity.google/terms>）、代わりの操作（`.specdojo/agent-members.yaml` で agy の member を disabled にするか消し、ほかの provider を使う）を含める。終了コードは 0 以外にする。
- `init` と `config scaffold` で antigravity を provider として選べないようにする。指定されたら、上と同じ理由を示してエラーにする。対話の選択肢にも出さない。devcontainer の scaffold で、agy 用の設定を新たに足さない。
- 止めるかどうかを切り替える設定や、止めるのを外す環境変数は足さない。
- 単体テストで、名前で指定したとき・自動選択・代わりの選択・`agent launch`・`orchestrator launch`・`init` の 6 つの場合を確かめる。agy を実際に起動しないこと（コマンドを実行しないこと）も確かめる。
- コマンドリファレンス、provider と exec の設定のガイド、README に、0.9.2 から agy を起動しないことと理由を書く。agy の設定方法を案内している箇所には、使えないことを先頭に書く（説明そのものを消すのは PJR-N6FQ で行う）。
- 配布テンプレート（`templates/antigravity/` と、`templates/init-agent-members.yaml`・`templates/init-exec-defaults.yaml` の agy の部分）は、この項目では消さない（PJR-N6FQ で消す）。ただし init がそれらを書き出さないことを確かめる。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に、区分（利用者から見て動きが変わる点）と行の文案を書く。init で antigravity を選んだ利用者が 0.9.2 に上げると exec が止まること、その直し方を含める。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` が通り、親の検証が通る。

## 4. 作業内容

| No  | 作業                                                                        | 担当 | 状態 | メモ                                                                                                                       |
| --- | --------------------------------------------------------------------------- | ---- | ---- | -------------------------------------------------------------------------------------------------------------------------- |
| 1   | agy の起動を止める（exec・grade・trial・agent launch・orchestrator launch） | DEV  | done | `resolveMemberCommand` で拒否し、`selectCandidates` で候補から外す。`agent launch` と `orchestrator launch` は起動前に拒否 |
| 2   | init・config scaffold・devcontainer scaffold で antigravity を選べなくする  | DEV  | done | init の選択肢から外し、指定はエラー。`runProviderScaffold` と `runDevcontainerScaffold` は書き込み前にエラー               |
| 3   | 文書と README に注意書きを足す                                              | DEV  | done | コマンドリファレンス・exec設定ガイド・オーケストレーター運用ガイド・README                                                 |

## 5. 対応結果

### 5.1. 実施内容

- 止める理由・根拠の URL・代わりの操作を 1 か所にまとめた `src/shared/antigravity-block.ts` を足した。止めるのを外す設定や環境変数は足していない。
- exec・grade・trial などの agent 実行: すべての経路が通る `resolveMemberCommand` の先頭で、provider が `antigravity` の member を command を組み立てる前に拒否する（member の `command` 上書きがあっても拒否する）。名前の指定（`--by`・`--executor-by`・難易度別の振り分け・名前の代わり）はエラーで止まる。自動選択（`selectCandidates`）では agy の member を候補から外し、ほかの member へ進む。
- `agent launch` は agy を起動する処理を消し、`--provider antigravity` を常に終了コード 1 で止める。0.9.1 の init が書いた `command_template` はここで止まる。`orchestrator launch` は設定を読む前と command を組み立てる前の両方で止める。
- init の provider の選択肢から antigravity を外し、指定されたら同じ理由のエラーにする（対話では同じ質問をやり直す）。`config scaffold` / `exec scaffold` の `--provider antigravity` と `devcontainer scaffold` の antigravity は、ファイルを書く前にエラーにする。
- 配布テンプレート（`templates/antigravity/`、`templates/init-agent-members.yaml`・`templates/init-exec-defaults.yaml` の agy の部分）は消していない。init のテストで、antigravity を指定したときに `.specdojo/agent-members.yaml`・`.specdojo/exec-defaults.yaml`・`.specdojo/antigravity/`・npm script を書き出さないことを確かめた。
- 単体テスト `tests/src/shared/antigravity-block.test.ts` で、名前で指定・自動選択・代わりの選択・`agent launch`・`orchestrator launch`・`init` の 6 つの場合を確かめた。`agent launch` と `orchestrator launch` は PATH に置いた偽の agy が実行されないこと（印のファイルができないこと）も確かめた。既存の agy 起動のテストは、止めることを確かめる内容に置き換えた。
- 統合テスト `tests/src/commands/init-agent-roster.integration.test.ts` は antigravity を provider に含めて init と `config scaffold` を流していたため、今回のエラーで落ちた。実装は変えず、provider から antigravity を外し、`init --provider claude,antigravity` と `config scaffold --provider antigravity` が理由付きのエラー（終了コード 0 以外）になり `.specdojo/antigravity/` を書かないことを確かめる形に直した。

### 5.2. 決めた内容と理由

- 名前で指定した代わり（`fallback_executor_by` など）が agy の member のときは、ほかの member へ進まずにエラーで止める。名前の指定は利用者の明示の選択で、黙ってほかの member に替えると意図しない agent が動くため。自動選択の中の代わりの候補は外して次へ進む。
- 判定は member の `provider` で行う。provider を `custom` にして `command` で agy を直接呼ぶ設定は検出しない。command の文字列で判定すると誤検出の恐れがあり、完了条件も provider を対象にしているため。
- `agent launch` は agy 専用の入口だったため、agy 以外の provider も起動せずにエラーにする。`--role` は 0.9.1 の `command_template` を確実にこのエラーまで通すため任意にした。
- init が書く orch の npm script と Dev Container の volume は 0.9.2 では作られないため、コマンドリファレンスの該当の記述（Antigravity の `orch:*`、devcontainer の volume の行）は現在の動きに合わせて消した。agy の設定方法の説明（session プロファイル・`--global`・command template）は消さずに、先頭へ使えないことを書いた。

### 5.3. CHANGELOG に書く事項

区分: 利用者から見て動きが変わる点

- 0.9.2 から Antigravity CLI（`agy`）を起動しない。consumer plan では、他社の agent や application の中から agy を起動することを Antigravity の FAQ が対象外、Additional Terms Section 6 が契約違反としているため（<https://antigravity.google/docs/faq>、<https://antigravity.google/terms>）。exec・grade・trial、`agent launch`、`orchestrator launch` は provider が `antigravity` の指定を agy の起動前にエラーで止め、自動選択と代わりの選択では agy の member を候補から外す。`init`・`config scaffold`・`devcontainer scaffold` でも antigravity を選べない。
- 0.9.1 の `init` で antigravity を選んだ利用者は、0.9.2 に上げると agy の member を使う `exec run` などがエラーで止まる。`.specdojo/agent-members.yaml` で agy の member に `disabled: true` を付けるか消し、`.specdojo/exec-defaults.yaml` の `routing` で agy の member を指している箇所をほかの provider の member に替える。`package.json` の `orch:argon`・`orch:flash` などは使えないため消す。

### 5.4. 残課題

- exec run が名前で指定された disabled の member を断らない件は PJR-77JB で扱う（本項目では、provider が `antigravity` なら disabled でなくても止める）。
- 配布テンプレートと agy の設定の説明を消す作業は PJR-N6FQ で行う。

## 6. 関連ドキュメント

- [[specdojo:command-reference|CLIコマンドリファレンス]]: init / config / project・agent・orchestrator・devcontainer の注意書き
- [[specdojo:exec-config-guide|exec設定ガイド]]: provider 設定の配布と scaffold の注意書き
- [[specdojo:orchestrator-operation-guide|オーケストレーター運用ガイド]]: Antigravity の orch script とグローバル設定の注意書き
