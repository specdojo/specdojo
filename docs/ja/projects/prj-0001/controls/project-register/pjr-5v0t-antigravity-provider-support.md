---
specdojo:
  id: prj-0001:pjr-5v0t-antigravity-provider-support
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: decided
  priority: high
  owner: PO
  registered_at: "2026-11-21T00:23:18Z"
  completed_at: "2026-11-21T00:34:41Z"
  conclusion: 0.9.2 で agy の起動そのものを止め、init で選べなくする。0.10.0 で agy の対応を外す
---

# PJR-5V0T SpecDojo のパッケージとしての Antigravity（agy）対応をどうするか

## 1. 背景

consumer plan では他社の agent や application から agy を起動することが規約上対象外のため、provider の実装・配布テンプレート・文書の agy 対応を外すか、注意書きを付けて残すかを決める

## 2. 入力

- Antigravity の FAQ（<https://antigravity.google/docs/faq>）: agy -p は direct scripting と CI 向け。Wrapping agy inside third-party coding agents or applications は consumer plans で not supported。他社のソフトから Antigravity のログインで使うのは規約違反で、アカウントの停止・終了がありうる
- Additional Terms の Section 6（<https://antigravity.google/terms>）: 当社が提供しない製品と組み合わせた利用と、他社のソフトを通じたアクセスは契約違反
- 2026-10-16 のフォーラムの回答（<https://discuss.ai.google.dev/t/clarification-on-consumer-plan-policy-for-invoking-official-agy-via-local-subprocess/189905>）で、FAQ が今の方針であり以前の回答より優先すると示された
- SpecDojo は 2026-09-21（21726189f）に agy を provider として追加し、利用者へ配るテンプレート（templates/antigravity/ など）と orchestrator launch --provider antigravity を持つ
- prj-0001 では 2026-11-21 に agy の利用を止めた（afbebe967）。利用者の契約は Google AI Pro（consumer plan）

## 3. 検討した選択肢

| 選択肢 | 内容                                                                                               | 利点                                                            | 懸念                                                    |
| ------ | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------- |
| A      | README と Release の告知だけを出し、コードは 0.10.0 で変える                                       | すぐ出せる                                                      | 告知を読まない利用者には届かない                        |
| B      | 告知に加えて hotfix 0.9.2 を出し、init で選べなくし、実行時に警告か停止をする。0.10.0 で対応を外す | init 済みの利用者にも実行時に届く。互換を壊すのは 0.10.0 に限る | 決定とリリースの手間が要る                              |
| C      | hotfix で agy 対応を外す                                                                           | 確実                                                            | 既存の設定がエラーになる互換性の変更で、hotfix には重い |

## 4. 決定内容

案 B を採る。

- 0.9.2（hotfix）: 警告にとどめず、agy の起動そのものを止める。exec・grade・orchestrator などから agy を起動しようとしたら起動前にエラーにし、init で antigravity を選べないようにする。
- 0.10.0: agy の対応を外す（provider の実装、配布テンプレート、init の選択肢、orchestrator launch、文書、テスト）。

## 5. 採択理由

- consumer plan（Google AI Pro など）では、SpecDojo の runner や他社の agent から agy を起動することが、Antigravity の FAQ で対象外、Additional Terms Section 6 で契約違反とされ、利用者のアカウントの停止につながりうる。
- init 済みの利用者の設定は新しい版を入れても残るため、実行時に止めなければ利用者を守れない。警告だけでは、見落とした利用者のアカウントが止められる恐れが残る。
- 対応を外すのは互換性の変更になるため、次のマイナー版（0.10.0）で行う。

## 6. 承認

| 項目     | 内容                                                                                                                                          |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 決定者   | indie                                                                                                                                         |
| 決定日   | 2026-11-21                                                                                                                                    |
| 承認方式 | commit                                                                                                                                        |
| 証跡     | 2026-11-21 の対話で indie が「0.9.2 は起動そのものを止める。0.10.0 では agy の対応を外す」と決定した。この個票の close の commit を証跡とする |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 7. 影響範囲とフォローアップ

| 項目       | 内容                                                                                          |
| ---------- | --------------------------------------------------------------------------------------------- |
| 影響範囲   | init で antigravity を選んだ利用者の exec・grade・orchestrator の起動、配布テンプレート、文書 |
| 必要な対応 | 0.9.2 で起動を止めて告知する。0.10.0 で対応を外す                                             |
| 追跡先     | PJR-NJE4（0.9.2）、PJR-N6FQ（0.10.0）、PJR-77JB（名前で指定された disabled の member）        |

## 8. 関連ドキュメント

- [[prj-0001:pjr-nje4-hotfix-0-9-2-block-antigravity|PJR-NJE4]]
- [[prj-0001:pjr-n6fq-remove-antigravity-0-10|PJR-N6FQ]]
- [[prj-0001:pjr-77jb-exec-run-named-disabled-member|PJR-77JB]]
