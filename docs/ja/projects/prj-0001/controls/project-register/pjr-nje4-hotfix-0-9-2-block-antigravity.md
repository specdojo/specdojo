---
specdojo:
  id: prj-0001:pjr-nje4-hotfix-0-9-2-block-antigravity
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

| No  | 作業                                                                        | 担当 | 状態 | メモ |
| --- | --------------------------------------------------------------------------- | ---- | ---- | ---- |
| 1   | agy の起動を止める（exec・grade・trial・agent launch・orchestrator launch） | DEV  | open | -    |
| 2   | init・config scaffold・devcontainer scaffold で antigravity を選べなくする  | DEV  | open | -    |
| 3   | 文書と README に注意書きを足す                                              | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
