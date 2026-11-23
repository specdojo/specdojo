---
specdojo:
  id: prj-0001:pjr-30pt-kata-wave-3-drop-role-approval
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: hard
  owner: BA
  registered_at: "2026-11-23T00:01:39Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-23T04:57:54Z"
  conclusion: 第 3 波の 12 種類の rulebook と sample から文書の役割と承認の記述を外した。grade は 24 文書のうち 23 文書が pass。etc-index-sample の needs-work は直す前からある経路の食い違いで、PJR-22XE に分けた
  derived_from:
    - PJR-325Y
  commit_type: docs
  commit_scope: kata
---

# PJR-30PT 第 3 波の型の rulebook と sample から文書の役割と承認の記述を外す

## 1. 概要

第 3 波の 13 種類は PJR-76N9 の決まりを strategy に足す前に 040・050 を終えていた。rg で 12 種類に文書の役割・承認・未決事項の承認の記述が見つかったので外す

## 2. 入力

- 第 3 波の 13 種類の 040・050・080・090 は 2026-11-21〜22 の朝に done。325Y で strategy に決まりを足したのはその後（2026-11-22 夜）
- 直してから grade を 1 回だけ流し、その後に 140 の人の確定へ進む（利用者の決定、2026-11-23）
- 未決事項の当面の扱いの承認も外す対象に含める（利用者の決定、2026-11-23）

## 3. 完了条件

- 第 3 波の 13 種類の型（`tsp-index`・`utc-index`・`utc`・`stc-index`・`stc`・`itc-index`・`itc`・`etc-index`・`etc`・`atc-index`・`atc`・`imp-test`・`trc-requirements-to-tests`）の rulebook と sample から、PJR-76N9 の決まりに反する記述を外す（利用者の決定、2026-11-23、indie）。13 種類は 040・050 の段を決まりを足す前（2026-11-21〜22）に終えていたため、決まりが効いていない。
- 外す対象は次の 2 種類とする。
  - 文書そのものの役割と承認: 文書を作る・確かめる・承認する役割の割り当て、本書の改訂や分割の承認者、`ready` への昇格や確定の条件と承認、承認・保留・差し戻しの進み具合。
  - 未決事項の当面の扱いの承認: 「ARC が確認し PO が承認する」のような、未決事項を誰が承認するかの記述。決まりでは承認と留保は登録簿の個票で追うため、当面の扱いの中身だけを残す。
- 外さない（対象外の）ものは、テストの中身としての判定とする。出口条件の判定者・例外承認者、受入の判定記録に残す実施者・証跡確認者・判定者のように、テストの進め方そのものとして役割を扱う記述は残す。rulebook の「共通の運用は正本を参照する」1 行も残す。
- 2026-11-23 にオーケストレーターが `rg` で見つけた場所は次のとおり。これを出発点とし、ほかにもないかを 26 文書で読んで探す。
  - `tsp-index-rulebook`: TSP の改訂の「担当: QE、承認: PO」。
  - `imp-test-rulebook`: 対応方針の承認・保留・差し戻しを PO が判断する記述、「だれ（Role code）が承認する文書か」を示させる記述、担当・承認者の書き方。`imp-test-sample`: 「PO が承認するための文書」「本書は PO による影響判断の承認をもって確定扱いとする」など。
  - `itc-index-sample`・`utc-index-sample`: 役割の表（同行レビュー担当、本書の改訂や分割を承認する技術メンター）と、改訂・分割の承認の記述。`itc-index-sample` の `ready` の前の確認と PO の承認。
  - `utc-sample`・`itc-sample`: 「DEV がケースを追加し、QE がレビューする」の文書の役割の記述。
  - `etc-sample`: 冒頭の「確認者」の行と、値をそろえて PO が承認した時点の記述。`etc-index-sample`: 「主担当・運用責任・確認者」の列と、未決事項の「ARC が確認、PO が承認」。
  - `atc-index-sample`・`atc-sample`・`stc-sample`・`tsp-index-sample`・`trc-requirements-to-tests-sample`: 未決事項の当面の扱いの承認（「BA が案を作成、PO が承認」「ARC が NFR へ起票し PO が承認する」など）。
  - `trc-requirements-to-tests-rulebook`・`atc-rulebook`: `ready` への昇格の条件と、人が判断する旨。
  - `stc-rulebook`: 「確認と合意」の役割ごとの合意と確認の記述。
- 行ごとに「外した」か「対象外（理由）」を決め、個票の対応結果に表で残す。外したことで rulebook の求めと sample が食い違うときは、両方をそろえて直す。
- 外すほかに中身は変えない。直したほうがよい点を見つけたら、個票の対応結果に書く。
- 型の grade は統合の後に orchestrator が 1 回流す（13 種類のうち、直した型）。executor は grade を実行しない。その後に 140 の人の確定へ進む。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `npm run lint:md`・`npm run lint:fm` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                                                                            | 担当         | 状態 | メモ                                                                             |
| --- | ----------------------------------------------------------------------------------------------- | ------------ | ---- | -------------------------------------------------------------------------------- |
| 1   | 13 種類の rulebook と sample（26 文書）を読み、文書の役割・承認・未決事項の承認の記述を洗い出す | BA           | done | 出発点の `rg` の場所に加え、26 文書を読んで探した                                |
| 2   | 行ごとに「外した」か「対象外」を決め、外す記述を削る                                            | BA           | done | 「対応結果」の判定の表のとおり。食い違いが出た rulebook と sample は両方を直した |
| 3   | 変更した文書の表を prettier で整える                                                            | BA           | done | executor の検証で実施                                                            |
| 4   | 直した型の grade を 1 回流す                                                                    | orchestrator | open | executor は grade を実行しない。統合の後に orchestrator が流す                   |
| 5   | 140 の人の確定                                                                                  | indie        | open | grade の後に人が行う                                                             |

## 5. 対応結果

26 文書のうち 22 文書（rulebook 9、sample 13）を直した。`itc-rulebook`・`etc-index-rulebook`・`etc-rulebook`・`atc-index-rulebook` の 4 rulebook は、`rg` と通読で外す記述が見つからなかった。外すほかに中身は変えず、frontmatter の `status` も変えていない。

### 5.1. 判定の表

| 文書                                 | 記述                                                                                                                                          | 判定                                                                                                     |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `tsp-index-rulebook`                 | 冒頭の「テスト設計者・実施者・受入判断者が…合意するための」                                                                                   | 外した。「誰が」を外し、どの判断の拠り所にするかの書き方に直した                                         |
| `tsp-index-rulebook`                 | 追従対象の「担当: QE、承認: PO」「担当: QE、DEV」と Role code の 1 文                                                                         | 外した。見出しも「追従対象」に直した                                                                     |
| `tsp-index-rulebook`                 | 代わりの合格基準の「根拠・合意者」                                                                                                            | 外した（合意者）。根拠は残した                                                                           |
| `tsp-index-rulebook`                 | 入口／出口条件の判定者・例外承認者、不具合の例外承認者                                                                                        | 対象外（テストの進め方そのもの）                                                                         |
| `tsp-index-sample`                   | メモ / 将来課題の「担当・判断者」列（「ARC が NFR へ起票、PO が承認」など）                                                                   | 外した。列を「引き継ぎ先」にし、登録簿の項目だけ残した                                                   |
| `tsp-index-sample`                   | 実施体制・判定者・例外承認（PM）、「設計がレビュー済み」の入口条件                                                                            | 対象外（テストの体制・品質ゲート）                                                                       |
| `utc-index-rulebook`                 | 目的の「誰がどのテスト作成・レビューの判断に使うか」                                                                                          | 外した（「誰が」）                                                                                       |
| `utc-index-rulebook`                 | 分割基準の「担当境界：所有者（チーム/モジュール）」、分配の主担当・従担当                                                                     | 対象外（テスト対象の括り方と分配）                                                                       |
| `utc-index-sample`                   | 関与者の表（開発担当・同行レビュー担当・技術メンター・店主代表）                                                                              | 外した。「利用場面と本書を使う判断」の表に直した                                                         |
| `utc-index-sample`                   | 「分割時は ARC が承認する」「ARC の承認を得てから本表を改訂する」                                                                             | 外した                                                                                                   |
| `utc-index-sample`                   | メモの「担当・判断者」列、「ready にする前に解消する論点…」の段落                                                                             | 外した。「報告先」列は承認でないため残した                                                               |
| `utc-index-sample`                   | 単体テストの合否を DEV が判定する                                                                                                             | 対象外（品質ゲートの判定者）                                                                             |
| `utc-rulebook`                       | 改訂時の追従の（DEV）（QE）                                                                                                                   | 外した                                                                                                   |
| `utc-rulebook`                       | 概要の「レビューア・実装者・テスト実装者が前提を把握できるように」                                                                            | 対象外（読み手の想定で、役割の割り当てではない）                                                         |
| `utc-sample`                         | 「DEV がケースを追加・実装し、QE が…照合する」                                                                                                | 外した                                                                                                   |
| `stc-index-rulebook`                 | 改訂時の追従の「改訂した担当（QE）」「各 `stc-<term>` の担当」                                                                                | 外した                                                                                                   |
| `stc-index-sample`                   | 「本書の維持は QE が担う」と改訂の QE・DEV                                                                                                    | 外した                                                                                                   |
| `stc-index-sample`                   | 「理由のない重複は差し戻す」「QE がレビューで差し戻す」                                                                                       | 外した。「認めない」に直した                                                                             |
| `stc-index-sample`                   | メモの「担当」列                                                                                                                              | 外した                                                                                                   |
| `stc-index-sample`                   | 環境の表の「責任」行（準備 DEV、実施・判定 QE、例外承認 PM）、P1 の PM の例外承認、性能測定の「ARC が実施」                                   | 対象外（テストの実施体制・判定者・例外承認者）                                                           |
| `stc-rulebook`                       | 「確認と合意」の役割ごとの合意と確認                                                                                                          | 外した。「共通の運用」の 1 行は残した                                                                    |
| `stc-rulebook`                       | 改訂時の追従の（DEV）（QE）・改訂担当                                                                                                         | 外した                                                                                                   |
| `stc-rulebook`                       | `_UNDECIDED_` の「recipe は QE が ready 化の判断時に決める」                                                                                  | 外した                                                                                                   |
| `stc-sample`                         | 「目的と対象外は PO と BA が合意し…`ready` にするのは…」の段落                                                                                | 外した                                                                                                   |
| `stc-sample`                         | 前提の表の「判断者と次の手」（「ARC が NFR へ起票し PO が承認する」など）                                                                     | 外した。列を「次の手」にし、次の手の中身だけ残した                                                       |
| `stc-sample`                         | 境界の表の「実施」行（準備 DEV、照合・判定 QE）                                                                                               | 対象外（テストの実施体制）                                                                               |
| `itc-index-rulebook`                 | ケース表の「`ready` にする時点で全行に記入」「空欄が残る場合は `ready` にしない」                                                             | 外した。「作成途中は空欄を許し、完成した `itc-<term>` では全行に記入する」に直した                       |
| `itc-index-rulebook`                 | 「レビューで…`ready` 化時に…確認し、満たさない場合は不合格」                                                                                  | 外した。確かめる項目は残し「手作業で確かめる」に直した                                                   |
| `itc-index-sample`                   | 関与者の表、「分割は ARC が承認する」「ARC の承認を得てから」「ARC が本書を改訂してから」                                                     | 外した。表は「利用場面」の表に直した                                                                     |
| `itc-index-sample`                   | 共通カラムの「`ready` にする…QE が確認し…不合格」、メモ前の「`ready` にする前に…PO が承認する」、メモの「担当・判断者」列                     | 外した。rulebook に合わせて直し、自動検査の行の影響も「`ready` になりうる」から書き直した                |
| `itc-sample`                         | 「DEV がケースを追加…QE がレビューし…`ready` 化を PO へ諮る」                                                                                 | 外した                                                                                                   |
| `etc-index-sample`                   | 括り方の表の「主担当」列（DEV）                                                                                                               | 外した（文書の担当の割り当て）                                                                           |
| `etc-index-sample`                   | 括り方の表の「運用責任・確認者」列                                                                                                            | 対象外（外部 I/F の運用責任で、rulebook の分割基準「運用責任」が求める中身）。列名を「運用責任」に直した |
| `etc-index-sample`                   | 「本書を ready にする前に…確認する」とメモの「担当・判断の場」列                                                                              | 外した                                                                                                   |
| `etc-index-sample`                   | 検証用領域が使えない時の「QE が判定を保留する」、メモの当面の扱いの「PM が日程を見直す」                                                      | 対象外（テストの判定とテストの日程の扱い）                                                               |
| `etc-sample`                         | 冒頭の「確認者」の行                                                                                                                          | 外した（rulebook は概要に確認者を求めていない）                                                          |
| `etc-sample`                         | `_UNDECIDED_` の「ARC が両者の値を揃え、PO が承認した時点で」                                                                                 | 外した。「両者の値が揃った時点で」に直した                                                               |
| `etc-sample`                         | 変更時の見直しの「DEV が…更新し、QE がレビューする」                                                                                          | 外した                                                                                                   |
| `etc-sample`                         | manual のケースを QE が実施、再実行で失敗したら QE が不具合を起票                                                                             | 対象外（テストの実施と不具合の扱い）                                                                     |
| `atc-index-sample`                   | 「QE がレビューで差し戻す」                                                                                                                   | 外した。「認めない」に直した                                                                             |
| `atc-index-sample`                   | メモの「担当・期限」列（「BA が案を作成、PO が承認」など）、「店主代表と合意した値へ」                                                        | 外した。列を「期限」にし、期限だけ残した                                                                 |
| `atc-index-sample`                   | 関係者の表、判定の流れの担当、判定記録の実施者・証跡確認者・判定者、受入後の DEV による領域削除                                               | 対象外（受入の判定記録とテストの進め方）                                                                 |
| `atc-rulebook`                       | `_UNDECIDED_` の「recipe は QE が ready 化の判断時に決める」「`ready` への昇格は人が判断する」                                                | 外した                                                                                                   |
| `atc-rulebook`                       | 本文要件の概要の「誰がどの受入判断に使うか」                                                                                                  | 外した（「誰が」）                                                                                       |
| `atc-sample`                         | 前提の表の「判断者と次の手」（「…PO が承認する。承認後に QE が…」など）                                                                       | 外した。列を「次の手」にした                                                                             |
| `atc-sample`                         | 冒頭の「家族利用者代表と店主代表が操作し、BA が記録、QE が照合、PO が判定」                                                                   | 対象外（受入テストの実施者・判定者）                                                                     |
| `trc-requirements-to-tests-rulebook` | 生成の手順の「`ready` へ昇格する前に人が決めます」、`_UNDECIDED_` の「`ready` の昇格条件は…QE が確認すること」                                | 外した。`_UNDECIDED_` は「決めたら本節の手順を更新する」にした                                           |
| `trc-requirements-to-tests-rulebook` | 目的の判断基準の「誰がどのレビュー・受入判断に使い」                                                                                          | 外した（「誰が」）                                                                                       |
| `trc-requirements-to-tests-rulebook` | 充足状況の判定に使うテストの `ready`                                                                                                          | 対象外（ビューの中身の判定条件）                                                                         |
| `trc-requirements-to-tests-sample`   | 利用者の表（QE・PO・PM）                                                                                                                      | 外した。「使う場面」と「確かめること」の表にした                                                         |
| `trc-requirements-to-tests-sample`   | 「QE が生成した」「別の QE が同じ版で」、ギャップの「BA が…PO が承認する。承認後に QE が…」、「人が `ready` にする」、「PM が各行を…」        | 外した                                                                                                   |
| `trc-requirements-to-tests-sample`   | 対応テストが `draft` のため受入の根拠にしない                                                                                                 | 対象外（充足状況の判定の中身）                                                                           |
| `imp-test-rulebook`                  | 全体方針の「QE が担い、PM が確認…PO が判断…BA が確認」                                                                                        | 外した。「役割の割り当ては適用先のメンバー定義に」を「共通の運用」の 1 行へ移した                        |
| `imp-test-rulebook`                  | 「だれ（Role code）が承認する文書か」                                                                                                         | 外した。「どの利用場面で何を判断するための文書か」に直した                                               |
| `imp-test-rulebook`                  | 「見送り・代替は `PO` の判断を受け」、転記の表の「`PO` が見送り・代替を判断した」、「転記と `PM` への報告は担当が行う」、禁止事項の「承認者」 | 外した                                                                                                   |
| `imp-test-rulebook`                  | 対応方針・未解決事項の「担当」列と Role code の書き方                                                                                         | 対象外（テストの対応項目の担当で、文書を作る・確かめる役割ではない）                                     |
| `imp-test-sample`                    | 「`PO` が承認するための文書」と判定・確認の役割の 1 文                                                                                        | 外した                                                                                                   |
| `imp-test-sample`                    | 「`PO` が判断した（決定記録 `PJR-T5D1`）」、「担当が当日中に `PM` へ報告し」、「`PO` による影響判断の承認をもって確定扱いとする」             | 外した                                                                                                   |
| `imp-test-sample`                    | 受入確認の「`QE` が判定し、`PO` の承認を受ける」、受入テストの判定項目を両代表が同席で確認する備考、対応方針の担当列                          | 対象外（変更の受入の判定とテストの対応項目）                                                             |
| 13 種類の rulebook                   | 「共通の運用」の 1 行、`_UNDECIDED_` の「ready 化前に解消する」                                                                               | 対象外（チケットの指定で残す 1 行と、型の未決の期限で役割・承認を含まない）                              |

### 5.2. 迷った点と決めた内容

- `etc-index-sample` の「運用責任・確認者」列は、外部 I/F ごとの運用の責任（提供事業者・店番・店主代表）で、rulebook の分割基準「運用責任」が求める中身のため残し、列名だけ「運用責任」にした。文書の担当の割り当てである「主担当」列は外した。
- `imp-test` の対応方針・未解決事項の「担当」列は、テストの対応項目を誰が行うかで、本文要件の必須列でもあるため残した。`trc-requirements-to-tests` のように担当を登録簿へ寄せるかは型の中身の変更になるため、このタスクでは行わない。
- 未決事項の表で承認と担当だけの列は列ごと外し、登録簿の項目 ID や期限・報告先など承認でない値は残した。
- rulebook の `_UNDECIDED_` にある「ready 化前に解消する」は、型そのものの未決の期限で役割も承認も含まないため残した。「人が判断する」「QE が決める」のように役割を含む部分だけ外した。

### 5.3. 直したほうがよい点

- `imp-test` の「担当」列を残すか、`trc-requirements-to-tests` と同じく登録簿で追うかを、140 の人の確定で決めるとよい。
- `itc-index-rulebook` の「推奨（運用必須）」の列は「完成した `itc-<term>`」で全行に記入すると直したが、「完成」の判定の仕方は型に書かれていない。grade の指摘を見て決める。

### 5.4. CHANGELOG に書く事項

- 区分: 変更
- 行の文案: テストの型（`tsp-index`・`utc-index`・`utc`・`stc-index`・`stc`・`itc-index`・`itc`・`etc-index`・`etc`・`atc-index`・`atc`・`imp-test`・`trc-requirements-to-tests`）の rulebook と sample から、文書を作る・確かめる・承認する役割の割り当てと、`ready` への昇格の条件、未決事項の承認の記述を外しました。承認と留保は登録簿の個票で追います。テストの判定者・例外承認者・受入の判定記録の役割は残しています。

## 6. 関連ドキュメント

- 根拠: [[prj-0001:pjr-76n9-no-role-assignment-in-documents|PJR-76N9]]、[[prj-0001:pjr-325y-kata-strategy-no-role-assignment|PJR-325Y]]
- 影響先: 13 種類の型の rulebook と sample（`docs/ja/specdojo/rulebooks/`・`docs/ja/specdojo/samples/`）
