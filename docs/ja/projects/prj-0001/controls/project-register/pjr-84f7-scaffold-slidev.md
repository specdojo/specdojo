---
specdojo:
  id: prj-0001:pjr-84f7-scaffold-slidev
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-24T22:23:40Z"
  due_on: "2026-10-31"
---

# PJR-84F7 Slidev の kata を検証できるよう、scaffold で Slidev を選んで入れられるようにする

## 1. 概要

利用者が Slidev の sample・template の kata を作るとき、SpecDojo を入れたリポジトリに Slidev がないとビルドして表示を確かめられない。`init` / `config scaffold` で Slidev と関連の設定を選んで入れられるようにする。

利用者の project（coderdojo-lessons-specdojo の prj-0001）では、投影スライドの kata（`edu-scratch:lsd-sample`）を作るために、次の2つを手で加えた。

- `prettier-plugin-slidev` と `.prettierrc`。普通の Markdown として整形すると、区切りの `---` の直後に空行が入り、ページ設定が本文になるため。kata の Slidev のファイルだけに `slidev` の parser を当てた。
- `.markdownlintignore`。Slidev のスライドは H1 の繰り返しや Vue の要素を使い、MD024・MD025・MD033・MD036 で commit hook と統合の段が止まるため。

それでも、Slidev の本体・テーマ・活動のコンポーネント（`ScratchBlocks.vue` など）がリポジトリにないため、sample を `slidev build` で確かめられなかった。教材は別のリポジトリ（プロダクトリポジトリ）にあり、そちらには Slidev が入っている。

## 2. 完了条件

- `init` と `config scaffold` に、Slidev を選んで入れるオプションがある。
- 選ぶと、Slidev の本体、prettier の plugin と設定、markdownlint の除外が入る。既存の設定ファイルと依存は上書きせず、追加する内容を先に表示する。
- 選ばなければ、何も変わらない。
- 入れた後、kata の Slidev の sample を `slidev build` で確かめる手順が文書にある。
- 以上を確かめる test がある。
- テーマと活動固有のコンポーネント（例: `ScratchBlocks.vue`）の扱いを、scaffold の範囲か利用者の作業かに決め、文書に書いている。

## 3. 作業内容

| No  | 作業                                                          | 担当 | 状態 | メモ                               |
| --- | ------------------------------------------------------------- | ---- | ---- | ---------------------------------- |
| 1   | Slidev を入れるオプションの範囲（本体・テーマ・部品）を決める | DEV  | open | 利用者の手作業の内容は概要のとおり |
| 2   | `init` と `config scaffold` にオプションを加える              | DEV  | open | 既存の設定は上書きしない           |
| 3   | sample を `slidev build` で確かめる手順を文書に書く           | DEV  | open | -                                  |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- 報告元: 利用者の project（coderdojo-lessons-specdojo の prj-0001）の PJR-0BVZ（投影スライドの sample を作る）
