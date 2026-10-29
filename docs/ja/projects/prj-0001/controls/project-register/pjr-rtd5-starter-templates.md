---
specdojo:
  id: prj-0001:pjr-rtd5-starter-templates
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  registered_at: "2026-10-28T10:31:41Z"
  derived_from:
    - PJR-5TZS
    - PJR-DQ9E
---

# PJR-RTD5 用途別のひな型（スターター）の範囲と提供の形を決める

## 1. 背景

Next.js と Cloudflare、scratch-lesson、ランディングページなど用途別のひな型で onboarding のハードルを下げる。3 層の構成、追加の設定の渡し方、GitHub の template repository での提供、定期的な作り直し、複製後の初期化、セキュリティの自動チェックを決める

- 利用者は、SpecDojo で管理するリポジトリを用途別のひな型からすぐに初期化できるようにし、onboarding を滑らかにしたい。例はランディングページ、scratch-lesson、Unity のゲーム開発、Next.js である。
- プロダクトのコードは公式の生成ツールに任せる（利用者の決定）。ただし、Next.js での Cloudflare 用の設定の追加なども含めて、極力ハードルを下げたい。
- ひな型には、各種のセキュリティの自動チェックを含めたい。
- [[prj-0001:pjr-5tzs-kata-presets-by-scale]]（規模別の kata の組）と [[prj-0001:pjr-dq9e-demo-repository-dagashiya]]（駄菓子屋のデモのリポジトリ）と重なる。

## 2. 検討した選択肢

### 2.1. ひな型の構成

| 層         | 中身                                                                                          | 持ち主                        |
| ---------- | --------------------------------------------------------------------------------------------- | ----------------------------- |
| 生成       | `create-next-app` など公式の生成ツールのコマンドと版                                          | 公式（SpecDojo は記録のみ）   |
| 追加の設定 | Cloudflare 用のアダプタ、wrangler の設定、デプロイのスクリプト、devcontainer、lint の設定など | SpecDojo のひな型             |
| SpecDojo   | kata の組、成果物カタログ、timeline、最初の epic と todo                                      | SpecDojo のひな型（PJR-5TZS） |

推奨はこの 3 層である。

### 2.2. 追加の設定の渡し方

| 選択肢 | 内容                                                                           | 利点                                 | 懸念                                                 |
| ------ | ------------------------------------------------------------------------------ | ------------------------------------ | ---------------------------------------------------- |
| A      | 決まった手順（パッケージ・ファイル・確かめのコマンド）を CLI で当てる          | 同じ結果になり速い。agent が要らない | 生成ツールやアダプタの版が上がると合わなくなりやすい |
| B      | recipe にして register の todo から agent に当てさせる                         | 版の違いに合わせられる               | 利用枠と時間がかかり、結果が少し揺れる               |
| C      | 決まった部分は A、版で変わりやすい調整は B。`build` などの通過を完了条件にする | 速さと版の変化への強さを両立する     | 2 つの仕組みを持つ                                   |

推奨は C である。

### 2.3. 提供の形

| 選択肢                         | 利用者の手間                             | 新しさ                 | 保守                                |
| ------------------------------ | ---------------------------------------- | ---------------------- | ----------------------------------- |
| CLI（`config init --starter`） | CLI の導入と実行、追加の設定を当てる時間 | 実行のたびに最新       | 定義だけ                            |
| GitHub の template repository  | 「Use this template」と初期化の 1 回     | 定期的に作り直した時点 | template ごとのリポジトリと Actions |
| 両方                           | 選べる                                   | -                      | 両方                                |

推奨は、template repository を主な入口にし、作り直しの仕組み（2.2. の C）は CLI と recipe で共通にする形である。

### 2.4. 作り直しと確かめ

- 各 template repository の GitHub Actions の定期実行で、公式の生成ツールから作り直し、`build` などが通るかを確かめる。認証は GitHub の中で完結させる。
- 結果は直接反映せず PR にし、人が確かめて merge する。recipe を agent が当てた部分の揺れを人が確かめるためである。
- 複製した後に 1 回だけ走らせる初期化（project id や名前の入れ直し、リポジトリの設定の有効化）を用意する。

### 2.5. セキュリティの自動チェック

| 種類             | 例                                                               | 持ち方                                  |
| ---------------- | ---------------------------------------------------------------- | --------------------------------------- |
| 依存の脆弱性     | Dependabot の更新、dependency review、`npm audit` や OSV-Scanner | `.github/dependabot.yml` と CI          |
| コードの静的解析 | CodeQL、ESLint のセキュリティ向けプラグイン                      | CI と lint の設定                       |
| 秘密情報の混入   | gitleaks を lefthook で動かす、secret scanning と push の保護    | hook はファイル、secret scanning は設定 |
| 設定の検査       | デプロイの設定、Actions の権限の最小化と外部の action の版の固定 | CI                                      |
| ブランチの保護   | main への直接の push の禁止、検査の必須化                        | リポジトリの設定（ruleset）             |

- 推奨は、共通の部分（秘密情報とブランチの保護）と用途ごとの部分に分けて持つ形である。
- template repository で引き継がれるのはファイルだけで、secret scanning・push の保護・Dependabot alerts・ruleset は引き継がれない。複製した後の初期化で有効にする。
- CodeQL や secret scanning は公開リポジトリでは無料だが、非公開では有料の契約が要るものがある。料金と条件は最新の内容を確かめてから決める。非公開では OSV-Scanner や gitleaks などの無料の代わりの手段を使う。
- 外部の action の更新も Dependabot に任せ、定期的な作り直しで検査が通ることも確かめる。

### 2.6. 最初に作るひな型

- 候補は Next.js と Cloudflare、scratch-lesson（coderdojo-lessons に実物がある）、ランディングページ（specdojo-lp に実物がある）である。

## 3. 決定内容

_TODO_: 採択した内容を明確に記載する。

## 4. 採択理由

- _TODO_: 判断根拠を記載する。

## 5. 承認

| 項目     | 内容   |
| -------- | ------ |
| 決定者   | _TODO_ |
| 決定日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容   |
| ---------- | ------ |
| 影響範囲   | _TODO_ |
| 必要な対応 | _TODO_ |
| 追跡先     | _TODO_ |

## 7. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
