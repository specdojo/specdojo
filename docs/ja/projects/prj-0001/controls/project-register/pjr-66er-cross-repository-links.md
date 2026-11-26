---
specdojo:
  id: prj-0001:pjr-66er-cross-repository-links
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: hard
  owner: ARC
  registered_at: "2026-11-03T05:02:47Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-26T10:10:54Z"
  conclusion: リポジトリをまたぐ wikilink は project 修飾の doc id と external_projects の source_url で解決する方式とし、解決先がない場合は警告にとどめてビルドを止めない。2026-11-26 の next の deploy（run 45713911145）で、またぐ wikilink の警告が出ないことを確かめた
  derived_from:
    - PJR-8HCB
  commit_type: feat
  commit_scope: docs
---

# PJR-66ER リポジトリをまたぐ文書のリンクの書き方を決めて対応する

## 1. 概要

管理用リポジトリとプロダクトのリポジトリ、別リポジトリへ移した project の間で、wikilink を文書サイトで解決できるよう、リポジトリをまたぐリンクの書き方と表示の仕組みを決めて対応する

## 2. 入力

- 利用者は、prj-0002（specdojo-lp の管理）を将来、管理用の別リポジトリ（例: specdojo-lp-specdojo）へ移す可能性を考え、安全に移すための機能を用意することを求めた。全自動の移行コマンドは後回しにし、読むだけの点検・手順のガイド・リポジトリをまたぐリンクの 3 件に分けると判断した（2026-11-03）
- 今は prj-0002 の文書から prj-0001 の個票へ wikilink が 10 種類あり、prj-0001 の運用メモや個票からも prj-0002 を指している。リポジトリが分かれると文書サイトで解決できなくなる（2026-11-03）
- PJR-8HCB で決めたスターターの 3 種類のリポジトリ（管理・作る側・配る側）でも同じ問題が起きるため、移行の点検とガイドより先に要る。書き方の案の例は、`external_projects` の別名を付けた wikilink を GitHub の URL に置き換えて表示する形。方式は選択肢と理由を記録して決める（2026-11-03）

## 3. 完了条件

個票に完了条件が無かったため、executor がタイトルと入力から次の仮説を立てて作業の基準にした（_ASSUMPTION_）。

- リポジトリをまたぐリンクの書き方の選択肢を比べ、選んだ方式と理由を対応結果に書いている。
- 選んだ書き方の wikilink を、文書サイトが相手のリポジトリの文書の URL へ解決する。相手のリポジトリが無いときもビルドを止めない。単体テストで確かめている。
- 設定の項目を足す場合は、CLI の検証・schema・設定リファレンスを揃えている。
- 移行ガイドの「準備中」の記述を、決めた書き方に置き換えている。
- 親の検証が通っている。

- 2 回目の実行（2026-11-25）で、1 回目の確かめで足りなかった次の点を直す。1 回目の方式（project 修飾の doc id と `source_url`）は変えない。
  - project 修飾の doc id（`prj-0002:...` など）で、手元にも `external_projects` にも解決先がない wikilink を、ビルドを止めずに警告として出す（id と文書のパスを含める）。今は `[[...]]` のまま黙って表示している。
  - 単体テストに、相手の project が `external_projects` に宣言されていない場合と、手元の doc index にある id が外部の URL より優先される（同じリポジトリの wikilink の扱いが変わらない）場合を足す。判定を `config.mts` から切り出して試せる形にしてよい。
  - wikilink の記法を説明している文書（`docs-editing-guide` など、記法の説明がある文書）に、リポジトリをまたぐ wikilink の書き方を足す。

## 4. 作業内容

| No  | 作業                                           | 担当 | 状態 | メモ                                                                                         |
| --- | ---------------------------------------------- | ---- | ---- | -------------------------------------------------------------------------------------------- |
| 1   | 選択肢の比較と方式の決定                       | ARC  | done | 対応結果の「方式の比較と決定」に記録した。                                                   |
| 2   | 文書サイトの解決の実装とテスト                 | ARC  | done | `external-links.ts` を追加し、`config.mts` の wikilink と frontmatter のリンクに組み込んだ。 |
| 3   | 利用者向けの文書の更新                         | ARC  | done | 設定リファレンスと移行ガイドを更新した。                                                     |
| 4   | 解決できない修飾付き wikilink の警告（2 回目） | ARC  | done | `createUnresolvedWikilinkReporter` を足し、`config.mts` の wikilink で呼ぶ。                 |
| 5   | 判定の切り出しと単体テスト（2 回目）           | ARC  | done | `classifyDocLink`・`selectExternalDocLinks` を切り出し、未宣言と手元優先のテストを足した。   |
| 6   | 記法の説明への追記（2 回目）                   | ARC  | done | `docs-editing-guide` と設定リファレンスを更新した。                                          |

## 5. 対応結果

### 5.1. 方式の比較と決定

| 案                                                                  | 長所                                                                    | 短所                                                                                                 |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| A. 本文に相手の完全 URL を書く                                      | 仕組みが要らない                                                        | ホストやブランチが本文に散らばり、移すたびに書き換える。doc id による参照の利点を失う                |
| B. `external_projects` の別名を付けた wikilink（`[[lp:pjr-xxxx]]`） | どのリポジトリを指すかが本文で分かる                                    | 別名は呼び出し元ごとに違い、移す時と移した後に既存のリンクの書き換えが要る。双方向で書き方が揃わない |
| C. project 修飾の doc id のまま（`[[prj-0002:pjr-xxxx]]`）          | 既存のリンクを書き換えずに済む。doc id は移しても変わらず、双方向で同じ | どのリポジトリかは設定（`project_id` の一致）で決まる                                                |
| D. 相手の文書を文書サイトへ取り込む（`repos` の取り込みと同じ）     | サイト内で読める                                                        | 相手の文書が二重に公開され、管理用リポジトリを分けた意味が薄れる。取り込む範囲の決め方が別に要る     |

C を選んだ。doc id は project 修飾で、ファイルや project の置き場所が変わっても変えない運用のため、今ある `[[prj-0002:...]]` のリンクも移した後にそのまま使える。URL の基点は、入力の案の例どおり `external_projects` に任意の `source_url` を足して宣言する。基点を 1 項目にしたのは、GitHub 以外のホストでも同じ書き方で使えるようにするためである。

### 5.2. 実施内容

- `packages/docs-site/.vitepress/external-links.ts` を追加した。共有とローカルの設定の `external_projects` を読み、`source_url` のある別名について、相手のリポジトリの `.specdojo/doc-index.json`（無ければ相手の `base_path` 配下の Markdown の frontmatter）から、接頭辞が `project_id` の doc id を URL へ引く。行番号付きのエントリは `#L<行番号>` を付ける。相手のリポジトリが無い場合は警告して飛ばす。
- `config.mts` で、手元の doc index に無い id だけを外部の URL へ解決するようにした。本文の wikilink は新しいタブで開くリンクにし、frontmatter の表の値も同じ表で解決する。解決できない id は従来どおり `[[...]]` のまま表示する。
- linked worktree での `path` の解決のため、`product-repos.ts` に主の作業ツリーのルートを返す `resolveMainWorkingTreeRoot` を切り出し、`resolveLocalConfigPath` もそれを使うようにした（挙動は変えない）。
- CLI の `external_projects` の検証に `source_url`（任意、`http(s)` の URL）を足し、型と `specdojo-config.schema.yaml` を揃えた。共有の別名をローカルで差し替えられるのは従来どおり `path` だけである。
- 単体テストを `tests/packages/docs-site/external-links.test.ts` に追加し、`tests/src/shared/specdojo-config-external-projects.test.ts` に `source_url` の検証を足した。
- [[specdojo:specdojo-config-reference|SpecDojo設定リファレンス]] に `source_url` と「リポジトリをまたぐ wikilink」を足した。[[specdojo:project-move-guide|プロジェクト移行ガイド]] の手順4の例に `source_url` を足し、双方向のリンクの点検にあった「準備中」の注記を決めた書き方に置き換えた。

- 2 回目（2026-11-25）: 方式は変えずに次を直した。
  - `external-links.ts` に、解決先を決める `classifyDocLink`、手元の id を外部の表から除く `selectExternalDocLinks`、修飾付きの id（`<namespace>:<id>`）が手元にも `external_projects` にも無いときに id と文書のパスを含めて文書と id の組ごとに 1 回警告する `createUnresolvedWikilinkReporter` を足し、`config.mts` から使うようにした。ビルドは止めず、表示は `[[...]]` のままである。
  - 単体テストに、相手の project が `external_projects` に宣言されていない場合、手元の doc index の id が外部の URL より優先される場合、警告の文面と重複の抑止、修飾の無い id を警告しない場合を足した。
  - [[specdojo:docs-editing-guide|ドキュメント編集ガイド]] の wikilink の記法の説明にリポジトリをまたぐ書き方を足し、設定リファレンスに警告の説明を足した。

### 5.3. 成果物

- `packages/docs-site/.vitepress/external-links.ts`
- `packages/docs-site/.vitepress/config.mts`
- `packages/docs-site/.vitepress/product-repos.ts`
- `src/shared/specdojo-config.ts`
- `docs/specdojo/schemas/v1/specdojo-config.schema.yaml`
- `tests/packages/docs-site/external-links.test.ts`
- `tests/src/shared/specdojo-config-external-projects.test.ts`
- `docs/ja/specdojo/references/specdojo-config-reference.md`
- `docs/ja/specdojo/guides/project-move-guide.md`
- `docs/ja/specdojo/guides/docs-editing-guide.md`

### 5.4. CHANGELOG に書く事項

- 区分: 追加
- 行文案: `feat(docs): external_projects に source_url を宣言すると、別リポジトリの project の doc id の wikilink を文書サイトが相手のリポジトリの URL へ解決する`

### 5.5. 残課題

- このリポジトリの文書には `[[prj-0002:...]]` の wikilink が 6 種類（17 か所）ある。`.specdojo/specdojo.config.json` に prj-0002 の `external_projects` が無いため、今は解決されない。設定は agent の保護対象のため変えていない。prj-0002 を別リポジトリへ移した時に、移行ガイドの手順4で `path`・`project_id`・`source_url` を宣言する。
- CI など相手のリポジトリを checkout しない環境では解決されない。公開する文書サイトで解決させるには、ビルドの前に相手のリポジトリを `path` の位置へ checkout する。
- VS Code 拡張の wikilink の解決は対象にしていない。必要なら別の項目で扱う。
- 文書サイトのビルド（`npm run docs:build`）での表示と警告の出方の確認はしていない。今のリポジトリでは `[[prj-0002:...]]` の 17 か所が警告に出る見込みである。オーケストレーターがまとめて流す。

## 6. 関連ドキュメント

- [[specdojo:specdojo-config-reference|SpecDojo設定リファレンス]]
- [[specdojo:project-move-guide|プロジェクト移行ガイド]]
- [[prj-0001:pjr-7rz4-project-move-guide]]
