---
specdojo:
  id: prj-0001:pjr-0143-vs-code-marketplace
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  due_on: "2026-10-31"
---

# PJR-0143 VS Code拡張のMarketplace登録

## 1. 概要

`packages/vscode-specdojo` 拡張を Visual Studio Marketplace へ公開する。

[[prj-0001:pjr-gx9d-vscode-extension-consolidation]] で定めた集約方針の2番目にあたる。
[[prj-0001:pjr-0144-fmt-md-table-vs-code]] で拡張の機能が確定してから実施する。公開先が定まって
いないと導入手順を書けないため、[[prj-0001:pjr-0142-vs-code-specdojo]] より先に行う。

## 2. 現状

| 項目       | 内容                                    |
| ---------- | --------------------------------------- |
| 拡張名     | `vscode-specdojo`                       |
| バージョン | 0.1.0                                   |
| 配布       | `vscode-specdojo-0.1.0.vsix` の手動配布 |
| 発行者     | 未登録                                  |

利用者は vsix を入手して手動でインストールする必要がある。更新の通知も届かない。

## 3. 完了条件

- Visual Studio Marketplace に発行者が登録されている。
- 拡張が公開され、VS Code の拡張検索から見つかる。
- `package.json` に公開へ必要な項目（`publisher`、`repository`、`license`、`icon` など）が
  揃っている。
- 公開手順が文書化され、次回以降のバージョン更新を再現できる。
- 公開に使う認証情報の管理方法が定まっている。リポジトリへ含めない。
- 公開後の拡張をインストールし、`[[id]]` のリンク表示と表整形が動作することを確認している。

## 4. 発行者 ID の決定

### 4.1. 前提

Marketplace の publisher は Azure DevOps 組織を実体とする。個人と法人の区別は仕組み上なく、
どの形態でも複数メンバーを追加できる。認証済みバッジもドメイン所有を証明すれば個人で取得
できる。したがって選択の実質は publisher ID に何を使うかである。

拡張の識別子は `<publisher>.<name>` で、**後から変更できない**。変更すると別の拡張として扱われ、
インストール実績と評価を失う。

### 4.2. 選択肢

| 案               | publisher ID | 拡張識別子                 | 評価                   |
| ---------------- | ------------ | -------------------------- | ---------------------- |
| 個人名           | `naoji3x`    | `naoji3x.vscode-specdojo`  | 他資産と不整合         |
| 個人事業主の屋号 | 屋号         | `<屋号>.vscode-specdojo`   | 屋号変更・廃業時に困る |
| **プロダクト名** | `specdojo`   | `specdojo.vscode-specdojo` | GitHub・npm と一致する |

### 4.3. 決定

publisher ID は `specdojo` とする。

- 既存資産と一致する。GitHub 組織（`github.com/specdojo/specdojo`）、npm パッケージ名、拡張の
  `package.json` の `publisher` 記載がいずれも `specdojo` である。
- 識別子は変更できないため、個人名や屋号を使うと将来の体制変更で不整合が固定される。
- 権限はメンバー追加で移譲できるが、識別子に個人名が入ると製品名との乖離が残る。

Marketplace で `specdojo` が未取得であることを確認済みである。

アカウントの所有主体（個人か個人事業主か）は Marketplace の機能に影響しない。税務・管理責任の
観点で別途判断する。

#### 4.3.1. 表示名と所有アカウント（2026-09-15 決定）

| 項目                      | 決定                                                                                                 |
| ------------------------- | ---------------------------------------------------------------------------------------------------- |
| publisher 表示名          | `SpecDojo`。ID・GitHub 組織・npm と揃える。事業者名は表示名にしない                                  |
| publisher 説明            | SpecDojo が仕様駆動開発のためのドキュメントフレームワークであることと、TinyShrine が開発・保守する旨 |
| Web サイト・認証ドメイン  | SpecDojo のドメインがあればそれ、なければ `tinyshrine.dev`。認証済みバッジは DNS の TXT で証明       |
| 所有 Microsoft アカウント | TinyShrine の Microsoft アカウント（MSA）。職場の Entra ID アカウントは使わない                      |
| メンバー                  | 個人アカウントを owner として追加し、所有アカウントに問題が起きても公開を止めない                    |
| 拡張の `displayName`      | `SpecDojo`（記載済み）                                                                               |

所有アカウントを屋号側にするのは責任の移転ではなく、公開資産・PAT の通知・規約同意を事業側に揃えて
記録を整理するためである。屋号は法的には個人と同一主体であり、規約上の責任主体は変わらない。

### 4.4. 取得手順

publisher の作成は Azure DevOps アカウントの作成から始まる。

| 順  | 手順                                                                                             |
| --- | ------------------------------------------------------------------------------------------------ |
| 1   | TinyShrine の Microsoft アカウント（MSA）を用意する。無ければ屋号のメールで作成する              |
| 2   | `https://aka.ms/vscode-create-publisher` で publisher を作成する                                 |
| 3   | ID に `specdojo` を入力する。ID は後から変更できない                                             |
| 4   | 表示名 `SpecDojo`、説明、Web サイト、アイコンを設定し、個人アカウントを owner メンバーに追加する |
| 5   | Azure DevOps で Personal Access Token を発行する                                                 |
| 6   | `npx @vscode/vsce login specdojo` でトークンを登録する                                           |
| 7   | `npx @vscode/vsce publish` で公開する                                                            |

Personal Access Token は次の条件で発行する。

- Organization: **All accessible organizations** を選ぶ。特定組織に限ると publish が失敗する
- Scopes: **Marketplace の Manage** を選ぶ
- 有効期限: 既定は 90 日。更新の運用を決めておく

トークンはリポジトリへ含めない。`vsce login` はローカルへ保存するため、CI で使う場合は
シークレットとして注入する。

`package.json` には publisher のほか、Marketplace の表示に用いる項目が要る。

| 項目          | 用途                                      |
| ------------- | ----------------------------------------- |
| `publisher`   | `specdojo`（記載済み）                    |
| `repository`  | ソースへの導線。未記載のため追加する      |
| `license`     | MIT（本体と揃える）。未記載のため追加する |
| `icon`        | 一覧での表示。未用意                      |
| `description` | 検索結果に出る説明                        |
| `categories`  | 分類。`Programming Languages` など        |

## 5. 検討事項

- バージョン付与の方針を決める。拡張のバージョンを SpecDojo 本体と揃えるか、独立させるか。
- 公開の自動化の要否を判断する。手動公開で始め、頻度が上がってから CI を検討してもよい。
- 認証済みバッジの取得可否を判断する。ドメインを所有していれば申請できる。必須ではない。
- Personal Access Token の有効期限（既定 90 日）の更新運用を決める。切れると公開できない。

## 6. 作業内容

| No  | 作業                               | 担当 | 状態 | メモ                                                                           |
| --- | ---------------------------------- | ---- | ---- | ------------------------------------------------------------------------------ |
| 1   | publisher `specdojo` を作成する    | ARC  | open | ID は変更できないため確認して行う                                              |
| 2   | Personal Access Token を発行する   | ARC  | open | All accessible / Marketplace Manage                                            |
| 3   | `package.json` の公開項目を揃える  | ARC  | open | repository、license、icon ほか                                                 |
| 4   | 公開して動作を確認する             | ARC  | open | インストールして検証する                                                       |
| 5   | 公開手順とトークン更新を文書化する | ARC  | open | 再現できる形にする                                                             |
| 6   | 公開後に導入手順と推奨を差し替える | ARC  | open | docs-editing-guide の vsix 手順を Marketplace へ、extensions.json に拡張を追加 |

## 7. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 8. 関連ドキュメント

- [[prj-0001:pjr-gx9d-vscode-extension-consolidation]]: 集約方針。本項目はその2番目。
- [[prj-0001:pjr-0144-fmt-md-table-vs-code]]: 先行して完了させる。
- [[prj-0001:pjr-0142-vs-code-specdojo]]: 本項目の完了後に実施する。
