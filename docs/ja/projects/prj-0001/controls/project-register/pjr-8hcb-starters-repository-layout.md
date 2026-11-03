---
specdojo:
  id: prj-0001:pjr-8hcb-starters-repository-layout
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  registered_at: "2026-11-03T04:42:37Z"
  due_on: null
  derived_from:
    - PJR-RTD5
  commit_type: docs
  commit_scope: register
---

# PJR-8HCB スターターのリポジトリの構成と名前を決める

## 1. 背景

PJR-RTD5 のスターター（ひな型）を、管理 specdojo-starters-specdojo・作る側 specdojo-starters・配る側 `specdojo-starter-<name>` の 3 種類のリポジトリで作り、作る側のディレクトリを 3 層の構成にする

## 2. 入力

- GitHub の template repository は 1 つのリポジトリが 1 つのひな型で、「Use this template」はリポジトリの中身をまるごと複製する（2026-11-03）
- このリポジトリの Git 管理の大きさは 63 MB で、そのうち prj-0001 の実行記録が 42 MB（6,406 ファイル）。prj-0002 の管理の文書は 1.4 MB（2026-11-03 の実測）
- 利用者は、管理の履歴とプロダクトの履歴が混ざらないよう、管理用のリポジトリを分ける形を選んだ。名前は、scratch-vm のようにプロダクトの名前を頭に付ける慣習と、ガイドの例の「プロダクトの名前＋-specdojo」の形に合わせる案 A を選んだ（2026-11-03）

## 3. 検討した選択肢

### 3.1. 管理（登録簿・exec）の置き場所

| 選択肢 | 内容                                                                      | 利点                                                                                    | 懸念                                                      |
| ------ | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| A      | このリポジトリに新しい project を作り、`repos` に作る側と配る側を宣言する | prj-0002 と同じ運用で、夜間の実行もそのまま使える                                       | スターターの実行記録の分、このリポジトリが重くなる        |
| B      | 作る側のリポジトリの中に `.specdojo` を置く                               | 重さがスターター側に閉じる                                                              | 管理の履歴とプロダクトの履歴が混ざる                      |
| B'     | 管理用のリポジトリを別に作り、`repos` に作る側と配る側を宣言する          | 履歴が混ざらず、重さも閉じる。外の利用者に勧める形と同じで、npm の CLI で使い方を試せる | 作業の場所に 3 つのリポジトリを並べて clone する          |
| C      | 管理もスターターの中身もこのリポジトリに置く                              | CLI とスターターを 1 つの PR で直せる                                                   | commit の検査がスターターにかかり、Actions の権限も広がる |

### 3.2. 名前

| 選択肢 | 作る側              | 管理                         | 配る側                    | 懸念                                                |
| ------ | ------------------- | ---------------------------- | ------------------------- | --------------------------------------------------- |
| A      | `specdojo-starters` | `specdojo-starters-specdojo` | `specdojo-starter-<name>` | 管理の名前が長く、「specdojo」が 2 回出る           |
| 1      | `starters`          | `starters-specdojo`          | `starter-<name>`          | 組織の外に clone すると何のリポジトリか分かりにくい |
| B      | `specdojo-starters` | `specdojo-starters-pm` など  | `specdojo-starter-<name>` | 利用者に勧める「`-specdojo`」の形から外れる         |

## 4. 決定内容

3.1. は B'、3.2. は A を採る。

- リポジトリは次の 3 種類とする。
  - 管理: `specdojo-starters-specdojo`。`.specdojo`、登録簿、schedule、exec の実行記録を置き、`repos` に作る側と配る側を宣言する。
  - 作る側: `specdojo-starters`。すべてのひな型の定義と、作り直しの Actions を置く。
  - 配る側: `specdojo-starter-<name>`（例: `specdojo-starter-landing-page`）。作る側から生成した結果だけを置き、template repository に設定する。作る側の Actions が作り直して PR を出し、人が確かめて merge する。
- 名前は「template」ではなく「starter」を使う。Kata の文書の雛形（`*-template.md`）と区別するためである。
- 作る側のディレクトリは、PJR-RTD5 の 3 層（生成・追加の設定・SpecDojo）をそのまま表す。

```text
specdojo-starters/
├── starters/
│   └── <name>/
│       ├── starter.yaml   # 生成: 公式の生成ツールのコマンドと版、使う SpecDojo の CLI の版、配る側のリポジトリ名
│       ├── overlay/       # 追加の設定（決まった部分）: そのまま重ねるファイル
│       ├── recipes/       # 追加の設定（版で変わりやすい調整）: agent が当てる recipe
│       ├── specdojo/      # SpecDojo: kata の組、成果物カタログ、timeline、最初の epic と todo
│       └── checks.yaml    # 完了の確かめ方（build などのコマンド）
├── shared/
│   ├── security/          # 共通のセキュリティの検査（dependabot、gitleaks、CodeQL の workflow など）
│   ├── devcontainer/      # 共通の devcontainer
│   └── init/              # 複製した後に 1 回だけ走らせる初期化
├── .github/workflows/
│   ├── regenerate.yml     # 定期実行: ひな型ごとに作り直し、確かめ、配る側へ PR を出す
│   └── verify.yml         # 作る側の PR で、作り直しが通るかを確かめる
└── docs/
```

- CLI と作る側は、`starter.yaml` に書く CLI の版で結ぶ。追加の設定を当てる仕組みの本体は、このリポジトリの CLI に置き、作る側の Actions は npm で配った CLI を使う。

## 5. 採択理由

- GitHub の template repository は 1 つのリポジトリが 1 つのひな型のため、定義と作り直しを置く作る側と、ひな型ごとの配る側を分ける必要がある。
- 管理用のリポジトリを分けると、記帳や実行記録の commit がプロダクトの履歴に入らず、プロダクトの CI も動かない。実行記録で重くなるのも管理用のリポジトリだけに閉じる。
- 管理用とプロダクトのリポジトリを分け、npm の CLI で管理する形は、外の利用者に勧める形そのものであり、SpecDojo 自身で試せる。
- 名前は、`scratch-vm` などと同じくプロダクトの名前を頭に付け、組織の外に clone しても何のリポジトリか分かり、手元で重ならないようにする。管理は「プロダクトの名前＋`-specdojo`」の形に例外なく合わせ、重複は見た目の問題として受け入れる。
- スターターの中身をこのリポジトリに置かないのは、commit の検査がぶつかること、ほかのリポジトリへ書く Actions の権限を CLI 本体に置かないこと、リリースの間隔が違うことによる。

## 6. 承認

| 項目     | 内容                                                                                     |
| -------- | ---------------------------------------------------------------------------------------- |
| 決定者   | indie                                                                                    |
| 決定日   | 2026-11-03                                                                               |
| 承認方式 | commit                                                                                   |
| 証跡     | 2026-11-03 の対話で indie が B' と名前の案 A を選び、本個票の close の commit で記録した |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 7. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                                                          |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 影響範囲   | 新しい 3 種類のリポジトリ、このリポジトリの CLI（追加の設定を当てる仕組み）、PJR-RTD5 のフォローアップの todo                                 |
| 必要な対応 | 3 種類のリポジトリの作成と、管理用のリポジトリの SpecDojo の初期化。PJR-RTD5 の「必要な対応」の todo を、管理用のリポジトリの登録簿へ起票する |
| 追跡先     | 起票する todo（未起票）                                                                                                                       |

## 8. 関連ドキュメント

- [[prj-0001:pjr-rtd5-starter-templates]]
