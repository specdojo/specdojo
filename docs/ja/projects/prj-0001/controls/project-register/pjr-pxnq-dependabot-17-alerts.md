---
specdojo:
  id: prj-0001:pjr-pxnq-dependabot-17-alerts
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-23T00:25:53Z"
  due_on: "2026-11-30"
  commit_type: build
  commit_scope: deps
---

# PJR-PXNQ Dependabot が示す依存の脆弱性 17 件を直す

## 1. 概要

docs-site の vite・esbuild と、各パッケージの minimatch・glob・katex を直る版まで上げる。大半は docs:dev の dev サーバーの問題で、vite を 6.4.4 にすると 8 件が直る

## 2. 入力

- 2026-11-23 の push で GitHub が 17 件（high 1・medium 13・low 3）を示した。一覧は gh api repos/specdojo/specdojo/dependabot/alerts で取れる
- docs:dev は --host 0.0.0.0 で起動するため、同じネットワークから dev サーバーに届く

## 3. 完了条件

- GitHub の Dependabot が示す 17 件（2026-11-23、high 1・medium 13・low 3）を直す（利用者の決定、2026-11-23、indie）。対象は次のとおり。直す前に `gh api` か `npm audit` で数え直し、増減があれば個票の対応結果に書く。
  - `packages/docs-site`: vite を 6.4.4 以上、esbuild を 0.25.0 以上にする（dev サーバーの `server.fs.allow`・`deny` のすり抜け、launch-editor、esbuild の dev サーバーへの要求など 9 件）。
  - ルート・`packages/docs-lint`・`packages/docs-site`・`packages/vscode-specdojo`: minimatch を 11.0.1 以上、glob を 14.0.2 以上、katex を 0.18.2 以上にする（直接の依存でなければ、上位の依存の更新か `overrides` で上げる）。
- 上げる版は、直る版を満たす範囲で小さくする（vite は 6 系の中で上げ、7 系へは上げない）。大きな版を上げないと直らないものは、上げずに理由と影響を個票の対応結果に書く。
- `package.json` と lock のファイルは保護された設定のため、executor は変えない。上げる版と、`npm install` などのコマンドの案を個票の対応結果と報告の `handoff` に書く。反映は利用者の承認のもとで orchestrator が feature ブランチで行う。
- 反映の後に orchestrator が `npm run docs:build`・`npm run docs:dev` の起動・`npm test`・VS Code 拡張の build（`packages/vscode-specdojo`）を流して確かめ、Dependabot の警告が消えたことを確かめてから close する。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
