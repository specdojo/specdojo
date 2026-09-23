---
specdojo:
  id: prj-0001:pjr-aak1-kata-subcommands
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  owner: DEV
  registered_at: "2026-09-23T03:50:07Z"
  due_on: "2026-10-24"
---

# PJR-AAK1 kata サブコマンド（list / show / status / eject / install）を追加する

## 1. 概要

[[prj-0001:pjr-fkn1-kata-distribution-method]] の第 2 段階。[[prj-0001:pjr-ypns-kata-resolution]] で解決順序が入った後、利用者が「今どの kata を参照しているか」「何を上書きしたか」を確認し、必要なものを取得できるようにする。

参照方式の弱点は、利用リポジトリだけを見ても適用中の規範が分からないことである。本項目のコマンド群がその補償手段になる。

### 1.1. 前提: 解決と列挙を区別する

kata の「解決」（個別ファイルを読む）と「列挙」（対象の一覧を作る）を区別する。解決だけが package へフォールバックし、列挙は用途ごとに範囲を決める。[[prj-0001:pjr-ypns-kata-resolution]] では、この区別が示されていなかったため grade の対象列挙が package 側まで拾い、親検証で差し戻された。

| 用途                                    | 範囲                             |
| --------------------------------------- | -------------------------------- |
| `kata list` / `show` / `status`         | 利用リポジトリ + package         |
| `kata eject` の選択肢                   | package（未 eject のものを出す） |
| grade の評価対象                        | 利用リポジトリのみ               |
| catalog の雛形（templates / rulebooks） | 利用リポジトリ + package         |

## 2. 完了条件

- `kata list` が kata の一覧を、解決元（利用リポジトリ / node_modules）つきで表示する。種別での絞り込みができる。
- `kata show <id>` が解決順序に従って内容を表示する。
- `kata status` が eject 済みと参照中を区別し、eject 済みが package 側の同 ID と差分を持つかを示す。
- `kata eject --id <id>` が利用リポジトリの正準パスへコピーする。`exec-templates` と `schemas` は対象外として拒否し、理由を表示する。
- `kata install --all` が全量コピーを行う。既定の導線では案内しない。
- いずれも `--dry-run` を持ち、既存ファイルは `--force` なしに上書きしない。
- `command-reference.md` に各コマンドが記載されている。
- `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                        | 担当 | 状態 | メモ                         |
| --- | ------------------------------------------- | ---- | ---- | ---------------------------- |
| 1   | `kata list` / `show` / `status` を実装する  | DEV  | done | 解決元を明示する             |
| 2   | `kata eject` を実装し、対象外種別を拒否する | DEV  | done | 拒否理由を表示する           |
| 3   | `kata install --all` を実装する             | DEV  | done | 既定の導線には載せない       |
| 4   | `command-reference.md` へ追記する           | DEV  | done | 既存コマンドの記法に合わせる |

## 4. 対応結果

- `kata list` / `show` / `status` を追加し、利用リポジトリ優先・package フォールバックの解決結果を ID、種別、解決元、正準パスとともに確認できるようにした。`status` は eject 済みのファイルを package 原本と比較し、同一・変更あり・package 原本なしを区別する。
- `kata eject --id <id>` を追加し、rulebook / standard / recipe / sample / template を正準パスへコピーできるようにした。CLI と密結合する `exec-templates` と `schemas` は package 参照固定として、理由つきで拒否する。
- `kata install --all` を追加し、eject 可能な 5 種別を全量コピーできるようにした。既存ファイルは `--force` なしでは上書きせず、全コマンドで `--dry-run` を受理する。
- 一覧・解決順序・差分判定・個別コピー・対象外拒否・全量コピー・上書き保護を単体テストで固定し、[[specdojo:command-reference]] にコマンドと運用上の位置づけを記載した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-fkn1-kata-distribution-method]]
- [[prj-0001:pjr-ypns-kata-resolution]]
- [[specdojo:practice-system-composition-guide]]
- `docs/ja/specdojo/references/command-reference.md`
