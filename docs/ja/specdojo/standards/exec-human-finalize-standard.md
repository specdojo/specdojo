---
specdojo:
  id: exec-human-finalize-standard
  type: standard
  status: draft
---

# Human Finalize 実行標準

Human Finalize Execution Standard

`execution: human` の finalize タスクを result 単体で実行・確定するための記録、対象範囲、状態更新の規範を定義します。

## 1. 目的・適用範囲

- `execution: human` かつ `approach: finalize` または `bootstrap-finalize` のタスクに適用します。
- human タスクの作業指示と確認記録を result に一元化し、plan との二重管理を防ぎます。
- human が確定する文書の対象範囲、検証、`ready` 昇格、差し戻しの判定基準を統一します。

## 2. 基本方針

- human タスクでは plan を生成せず、claim 時に生成する result を作業と記録の正本とします。
- commit 対象は checkpoint 済み result frontmatter の `targets` から導出します。
- `done_criteria` の確認、確定対象、確定判断、備考は一つの result に記録します。

## 3. Result の規範

### 3.1. Frontmatter

| 項目        | 必須 | 規範                                                            |
| ----------- | ---- | --------------------------------------------------------------- |
| `execution` | ○    | `human` とする                                                  |
| `task_id`   | ○    | claim した schedule task ID と一致させる                        |
| `mode`      | ○    | task の mode と一致させる                                       |
| `approach`  | ○    | `finalize` または `bootstrap-finalize` とする                   |
| `targets`   | ○    | 主成果物を先頭にし、確定対象となる参考資料を続ける              |
| `plan_ref`  | -    | human task では plan が存在しないため記載しない                 |
| `status`    | ○    | claim 時は `in_progress`、完了結果に応じて lifecycle が更新する |

### 3.2. 本文

- 「確認チェックリスト」には catalog の全 `done_criteria` を重複なく展開します。
- 「確定対象」には `targets` から解決した実在文書を列挙し、確認と `ready` 昇格後にチェックします。
- 「確定判断」は承認または差し戻しのどちらかを実値で記録し、プレースホルダを残しません。
- `bootstrap-finalize` では参考資料の種別別確認を追加し、対象に存在しない種別の行は削除します。

## 4. 対象範囲と確定の判定基準

| 判定対象        | 承認できる条件                                          | 差し戻す条件                                       |
| --------------- | ------------------------------------------------------- | -------------------------------------------------- |
| `done_criteria` | 全項目について完成版の充足を確認した                    | 未充足または確認不能の項目が一つ以上ある           |
| 確定対象        | `targets` の全対象を確認し、必要な `ready` 昇格を終えた | 対象解決不能、未確認、未昇格が一つ以上ある         |
| 参考資料        | 対象種別の確認が完了し、成果物との整合が取れている      | 再利用性の劣化または成果物との不整合がある         |
| 検証            | 対象形式に必要な整形、静的検査、schema 検証が成功した   | 必要な検証が未実施またはエラーのままである         |
| result 記録     | チェック、判断、必要な備考が実際の結果で埋まっている    | プレースホルダ、未記入、判断とチェックの矛盾がある |

## 5. 文書状態と記法

- 承認する場合は、確定対象の frontmatter `status` を `ready` に更新します。
- 差し戻す場合は未確定対象を `ready` に昇格させず、理由と次の行動を result に記録します。
- 既存文書への参照は `[[id|title]]` とし、表セル内では `[[id\|title]]` と記載します。
- 存在しない文書は wikilink にせず、ID またはファイル名をバッククォートで仮置きします。

## 6. 禁止事項

- human task 用 plan を生成または作業の正本として維持しません。result との二重管理を生むためです。
- `targets` に含まれない文書を、根拠なく commit または `ready` 昇格の対象へ追加しません。
- 未確認のチェック項目、`_TODO_`、空の確定判断を残したまま承認しません。
- agent 実行を human 確定の代替にしません。`ready` 昇格は human の判断ゲートだからです。

## 7. 運用・見直しルール

- result の項目を変更するときは、exec result schema、human result template、commit scope 解決を同時に確認します。
- `done_criteria` の展開規則を変更するときは、catalog と finalize result の対応が一対一か検証します。
- human と agent の実行境界を変更するときは、`ready` 昇格ガードと脅威モデルの記述を見直します。
