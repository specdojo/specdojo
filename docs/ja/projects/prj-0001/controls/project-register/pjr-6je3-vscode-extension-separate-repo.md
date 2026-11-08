---
specdojo:
  id: prj-0001:pjr-6je3-vscode-extension-separate-repo
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: question
  item_status: open
  priority: low
  registered_at: "2026-11-08T14:26:32Z"
---

# PJR-6JE3 VS Code 拡張を別のリポジトリに分けるか

## 1. 確認事項

packages/vscode-specdojo の VS Code 拡張を、このリポジトリに置いたままにするか、別のリポジトリに分けるかを決める。今は置いたままとし、分けることを考える条件に当たったときに判断する

## 2. 入力

- 2026-11-08 時点の様子: 378 行、コマンドは 2 つ（Markdown の表の整形、ID から文書を開く）。commit は 2026-09-06 の 2 件だけ。npm package の files に含めず、.vsix は手で作り git の管理外。専用の CI はない。
- 拡張の「ID から開く」は CLI が作る .specdojo/doc-index.json と frontmatter の id: の書き方に頼るため、同じリポジトリにあれば索引の形を変えたときに同じ commit で直せる。
- 今は置いたままにする（indie が推奨どおりと同意、2026-11-08）。分けることを考える条件: VS Code Marketplace で npm と別の版で公開するようになった／拡張の機能が増え専用の CI やテストが要るようになった／別の人やチームが保守するようになった。
- 分ける場合は、doc-index.json の形を CLI と拡張の間の約束として外部 I/F の仕様（ifx の型）に先に書く。

## 3. 背景

_TODO_: この確認が必要になった背景、前提、制約を記載する。

## 4. 回答候補

| 候補 | 内容   | 利点   | 懸念   |
| ---- | ------ | ------ | ------ |
| A    | _TODO_ | _TODO_ | _TODO_ |

## 5. 回答・結論

_TODO_: 回答または採択した方針を記載する。未回答の場合は `-` とする。

## 6. 承認

| 項目     | 内容   |
| -------- | ------ |
| 回答者   | _TODO_ |
| 回答日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は既定で `commit`（`register close` により `decided` へ遷移）を用いる。
- 回答が不可逆・高リスク・framework schema 破壊的変更を伴う場合は `PR` 方式で承認し、証跡に PR URL と merge SHA を記載する。

## 7. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
