---
specdojo:
  id: prj-0001:pjr-tm1b-claude-edit-allowlist-too-narrow
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-10-08T14:40:23Z"
  due_on: null
  completed_at: "2026-10-08T22:01:22Z"
  conclusion: claude の edit の既定をリポジトリ全体の Edit 許可にし、保護対象を deny で拒否した。deny と runner の保護対象の一致を unit test で固定した。
---

# PJR-TM1B claude の provider の既定の書き込み許可が狭く、利用者のリポジトリの多くの作業ができない

## 1. 課題内容

公開物での実地の確認（2026-10-08）で、init が claude 用に作る .specdojo/claude/settings.edit.json の許可が Edit(docs/**)・Edit(src/**)・Edit(tests/**) だけのため、README.md への 1 行の追記もできず項目が waiting になった。ルートのファイルや app/・lib/ など別のディレクトリの成果物も編集できない。保護機構（agent-config-write の検査）との兼ね合いで、既定でどこまで書き込みを許すか（例: リポジトリ全体を許し、保護対象は deny と runner の検査で守る）を決める必要がある。利用者の判断を待つ。

## 2. 影響範囲

| 観点         | 影響                                                                                                      |
| ------------ | --------------------------------------------------------------------------------------------------------- |
| スコープ     | claude の provider のテンプレート `templates/claude/settings.edit.json` と、その案内（exec-config-guide） |
| スケジュール | v0.3.0 の公開を止める（判定基準 3・4）                                                                    |
| コスト       | claude を選んだ利用者の多くの exec が waiting になる                                                      |
| 品質         | `docs/`・`src/`・`tests/` 以外の成果物（README、ルートのファイル、`app/`・`lib/` など）を編集できない     |
| 関係者       | claude の provider を使う利用者                                                                           |

## 3. 対応方針

| 項目     | 内容                                                                                                                                   |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 書き込みの許可を SpecDojo 本体のディレクトリ構成に合わせた固定の一覧にしている                                                         |
| 対応策   | 2026-10-09 に利用者が案 A を採用した。リポジトリ全体の編集を許し、保護対象は deny で明示して拒否する。下記の「完了条件の詳細」のとおり |
| 依存事項 | なし。保護は claude の deny、runner の保護設定の検査、plan から作る commit 対象の制限の 3 重で守る                                     |
| 完了条件 | 下記の「完了条件の詳細」を満たす                                                                                                       |

### 3.1. 完了条件の詳細

- `templates/claude/settings.edit.json` の `allow` をリポジトリ全体の編集（`Edit(**)`）にする。
- 同じファイルの `deny` に、`src/exec-agent-protected-config.ts` の保護対象（`PROTECTED_DIRECTORY_PREFIXES` と `PROTECTED_EXACT_PATHS`）に対応する Edit の拒否を列挙する。ルート直下のファイルは他の階層の同名ファイルに当たらない書き方（例: `Edit(./package.json)`）にする。`node_modules/` も含める。
- unit test で、テンプレートの `deny` が保護対象の定数をすべて網羅していることを確かめる。定数を足したのにテンプレートを直さないと失敗するようにする。
- `settings.review.json` と `settings.report.json` は変えない。
- exec-config-guide の claude の権限の説明に、既定の許可の範囲と、保護対象を deny と runner の検査で守ることを書く。
- CHANGELOG の v0.3.0 の該当する区分に、利用者に見える変更として追記する。
- 本リポジトリの `.specdojo/claude/settings.edit.json` は保護対象のため変更しない（必要なら人が別に反映する）。
- `npm run check` が通る。

## 4. 対応結果

`templates/claude/settings.edit.json` の既定許可を `Edit(**)` へ広げ、runner の agent-config-write 検査が保護するディレクトリとルート直下の設定ファイルを deny へ列挙した。これにより、README、ルート直下の成果物、`app/`・`lib/` など利用者固有の構成を編集できる一方、agent の権限や親 runner・hook・CI の実行内容は変更できない。

再発防止として、保護対象の定数と Claude の deny を照合する unit test を追加した。保護対象を増やしてテンプレートの deny を更新しなかった場合は test が失敗する。利用者向けガイド、Claude 固有の設計書、CHANGELOG にも権限境界を反映した。

変更ファイルの Prettier 整形、register build、catalog validate、index build は成功した。型検査、lint、schema 検証、unit / integration test は pipeline の親 runner が実行する。

## 5. 関連ドキュメント

- [[specdojo:exec-config-guide]]（exec の設定）
- [[prj-0001:pjr-p8tk-release-stabilization-criteria]]（公開の判定基準）
