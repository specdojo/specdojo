---
specdojo:
  id: prj-0001:pjr-gx9d-vscode-extension-consolidation
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: decided
  priority: medium
  owner: ARC
  registered_at: "2026-09-05T23:49:57Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-14T12:58:47Z"
  conclusion: VS Code 依存の編集支援機能（表整形、[[id]] のリンク表示と遷移）を packages/vscode-specdojo 拡張へ集約し、Marketplace 配布を正とする。fmt-md-table.ts は拡張へ移して削除済み、tasks.json のタスクは移行期間中は拡張コマンドへ委譲する形で残す。実装が決定どおり揃っていることを確認し、公開（PJR-0143）と導入手順（PJR-0142）は個別に追跡する。
---

# PJR-GX9D VS Code 関連機能を SpecDojo 拡張へ集約する方針を定める

## 1. 背景

SpecDojo の編集支援機能が複数の場所へ分散している。

| 機能                    | 現在の所在                         | 導入方法                 |
| ----------------------- | ---------------------------------- | ------------------------ |
| `[[id]]` のリンク表示   | `packages/vscode-specdojo`（拡張） | vsix を手動インストール  |
| ID による文書を開く     | 同上（`specdojo.openById`）        | 同上                     |
| Markdown 表の整形       | `.vscode/tasks.json` のタスク      | リポジトリを開けば使える |
| 表整形の実体            | `tools/docs/src/fmt-md-table.ts`   | `npx tsx` で起動         |
| 推奨拡張の宣言          | `.vscode/extensions.json`          | VS Code が提案           |
| Markdown プレビュー装飾 | `.vscode/markdown-preview.css`     | 設定で参照               |

利用者から見ると、機能ごとに導入経路が違う。拡張は vsix の手動配布で、タスクはリポジトリを
clone した利用者しか使えない。SpecDojo を別リポジトリで運用する構成（[[prj-0001:pjr-qhka-docs-structure-detached-unit]]）
では、`.vscode/` がどちらのリポジトリに属するかも曖昧になる。

既存の3項目（[[prj-0001:pjr-0142-vs-code-specdojo]]、[[prj-0001:pjr-0143-vs-code-marketplace]]、
[[prj-0001:pjr-0144-fmt-md-table-vs-code]]）はいずれも起票のみで完了条件が未記載である。
個別に進めると順序を誤り、手戻りが生じる。

## 2. 検討した選択肢

| 選択肢         | 内容                                              | 評価                                     |
| -------------- | ------------------------------------------------- | ---------------------------------------- |
| 現状維持       | 拡張とタスクを併存させる                          | 導入経路が分かれたまま。説明が複雑       |
| タスクへ集約   | 拡張をやめ `tasks.json` に寄せる                  | `[[id]]` のリンク表示は実現できない      |
| **拡張へ集約** | VS Code 依存の機能を拡張へ移し Marketplace で配布 | 導入が一本化する。実装と公開の作業が要る |

## 3. 決定内容

VS Code に依存する編集支援機能は `packages/vscode-specdojo` 拡張へ集約する。配布は Visual Studio
Marketplace を正とし、利用者は拡張のインストールだけで機能を得られる状態を目指す。

集約の対象と非対象を次のとおり区別する。

| 区分       | 対象                                                         |
| ---------- | ------------------------------------------------------------ |
| 集約する   | エディタ操作を伴う機能。表整形、`[[id]]` のリンク表示と遷移  |
| 集約しない | CLI から実行する検証・生成。`lint:md`、`specdojo build` など |

機能ごとに CLI 経路を残すかは、実際の利用実態で判断する。一般論で残すと実装が二重になる。

`fmt-md-table.ts` は拡張へ移し、元の実装は削除する。呼び出し元が `.vscode/tasks.json` だけで、
npm script、Git hook、CI のいずれからも参照されていない。ライブラリとしての `export` も持たず、
CLI 引数を読んでファイルへ書く単体スクリプトである。エディタ上でカーソル位置の表を整える
ヘルパーであり、CLI から使う実態がない。

## 4. 採択理由

- 導入経路が一本化する。現状は拡張が vsix の手動配布、タスクが clone 前提で、利用者へ説明する
  手順が機能ごとに分かれている。
- 別リポジトリ構成との相性が良い。`.vscode/tasks.json` はリポジトリに属するため、成果物と
  プロダクトを分けたときにどちらへ置くかが問題になる。拡張は利用者の環境に属するため、この
  問題が生じない。
- `[[id]]` のリンク表示は拡張でしか実現できない。既に拡張が存在する以上、エディタ機能の受け皿は
  拡張に定まっている。

## 5. 承認

| 項目   | 内容       |
| ------ | ---------- |
| 決定者 | ARC        |
| 決定日 | 2026-09-14 |

## 6. 影響範囲とフォローアップ

実施順序を次のとおりとする。前の段が終わるまで次へ進まない。

| 順  | 項目     | 内容                             | 依存の理由                               |
| --- | -------- | -------------------------------- | ---------------------------------------- |
| 1   | PJR-K513 | 配置とビルド成果物の扱いを整える | ビルド経路がないと公開作業を再現できない |
| 2   | PJR-0144 | `fmt-md-table` を拡張へ統合する  | 拡張の機能が確定しないと公開できない     |
| 3   | PJR-0143 | Marketplace へ公開する           | 公開後でないと導入手順を書けない         |
| 4   | PJR-0142 | 編集ガイドへ導入手順を追記する   | 公開先が定まってから書く                 |

各項目の完了条件は本決定を受けて個別に記述する。2026-09-14 時点で PJR-K513 と PJR-0144 は done、PJR-0143 と PJR-0142 は open で個別に追跡する。

`.vscode/tasks.json` の `Format Markdown Table` は、拡張の公開後も当面残す。既存利用者が
拡張を導入するまでの移行期間を設けるためである。撤去の時期は PJR-0142 の完了後に判断する。

`guide-authoring-standard.md` と `docs-editing-guide.md` が `Format Markdown Table` タスクを
名指しで参照している。拡張のコマンド名が決まった時点で記述の追従が要る。

## 7. 関連ドキュメント

- [[prj-0001:pjr-k513-vscode-extension-layout]]: 実施順序の1番目。
- [[prj-0001:pjr-0144-fmt-md-table-vs-code]]: 実施順序の2番目。
- [[prj-0001:pjr-0143-vs-code-marketplace]]: 実施順序の3番目。
- [[prj-0001:pjr-0142-vs-code-specdojo]]: 実施順序の4番目。
- [[prj-0001:pjr-qhka-docs-structure-detached-unit]]: 別リポジトリ構成。`.vscode/` の所属に関わる。
- [[specdojo:docs-editing-guide]]: 導入手順の記載先。
