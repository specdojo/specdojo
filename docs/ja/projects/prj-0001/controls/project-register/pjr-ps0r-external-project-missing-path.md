---
specdojo:
  id: prj-0001:pjr-ps0r-external-project-missing-path
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-27T10:39:51Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-VM2S
---

# PJR-PS0R 外部の project の置き場がないと、設定の読み込みでどのコマンドも止まる

## 1. 課題内容

`external_projects` の `path` が見つからないとき、設定の読み込みがエラーになり、外部の project を使わないコマンドも止まる。GitHub の検査（Check register branch push・Check execution record layout）が 11-26 から失敗し続けている

## 2. 入力

- d7d8cdf7e8（11-26）で `external_projects.prj-0002`（path: ../specdojo-prj-0002）を足してから、GitHub の Check register branch push と Check execution record layout が、置き場がないエラーで失敗し続けている。検査のサーバーは specdojo のリポジトリだけを checkout する
- エラーは src/shared/specdojo-config.ts の検証で出る: `external_projects.prj-0002.path` "../specdojo-prj-0002" does not exist
- 利用者（indie）は、置き場がないことは警告にとどめ、使うときだけエラーにする案 B を選んだ。マシンごとの設定（specdojo.local.config.json）へ置き場を移せるかは、この項目で確かめて記録する（2026-11-27）

## 3. 影響範囲

| 観点         | 影響                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------- |
| スコープ     | 設定読み込み、外部登録簿への委譲・操作案内、orchestrator 起動、設定リファレンス、回帰テスト |
| スケジュール | 外部 project を checkout しない CI 検査の停止を解消する                                     |
| コスト       | 追加のサービス・依存パッケージなし                                                          |
| 品質         | 未配置と設定の形の誤りを分け、利用時の存在確認を維持する                                    |
| 関係者       | 外部 project を登録する利用者、CI の保守担当                                                |

## 4. 対応方針

| 項目     | 内容                                                                                                                       |
| -------- | -------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `src/shared/specdojo-config.ts` の検証が、`external_projects.<id>.path` の置き場がないことを、どのコマンドでもエラーにする |
| 対応策   | 置き場がないことは警告にとどめ、その外部の project を実際に使う操作だけをエラーで止める（案 B、indie、2026-11-27）         |
| 依存事項 | なし                                                                                                                       |
| 完了条件 | 下の一覧のとおり                                                                                                           |

完了条件:

- `.specdojo/specdojo.config.json` の `external_projects.<id>.path` の置き場がないとき、設定の読み込み（`src/shared/specdojo-config.ts`）はエラーにせず、警告にとどめる。`path` が空・絶対パス・ディレクトリでないファイル、などの形の誤りは今と同じくエラーにする。
- 置き場のない外部の project を実際に使う操作（その project の登録簿への起票・参照など）は、今と同じ文脈（project の ID、設定の `path`、解決した絶対パス）を含むエラーで止まる。
- 外部の project を使わないコマンド（`register branch-check`・`exec` の記録の配置の検査など）は、置き場がなくても通る。
- 警告は、同じコマンドの中で何度も出さない。警告を標準エラーに出すか、どの場合に出すかは executor が決め、理由を個票の対応結果に書いている。
- `specdojo.local.config.json` で `external_projects` の `path` を足す・差し替えることができるかを確かめ、結果を個票の対応結果に書いている。できない場合は、対応するかどうかの案を書く（この項目で実装はしない）。
- 単体テストで、置き場がないときに設定の読み込みが通ること、外部の project を使う操作がエラーで止まることを確かめている。
- 設定リファレンス（`docs/ja/specdojo/references/specdojo-config-reference.md`）の `external_projects` の説明を、この扱いに合わせている。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 保護された設定（`.specdojo/`・`.github/`・`.agents/`・`.claude/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- 作業を終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 5. 対応結果

### 5.1. 実施内容

- `validateExternalProjects` は未配置のディレクトリを許容し、空・絶対パス・ファイルの指定は引き続きエラーにする。
- `loadConfig` は共有設定とローカル設定をマージして検証した後、未配置の宣言を標準エラーへ警告する。コマンドの標準出力を保ち、CI でも不足を確認できるようにした。同じ別名・`project_id`・設定の `path`・解決先の組は、プロセス内の集合で重複を抑え、設定を何度読み直しても警告は 1 回にする。
- `requireExternalProjectRoot` を起票の委譲、外部 project の操作案内、orchestrator が使用する外部 project 一覧の解決に適用した。未配置の場合、別名・`project_id`・設定の `path`・解決した絶対パスを含むエラーで止める。linked worktree でも主 worktree を基準にする。文書サイトの未解決 wikilink は既存の警告・表示の扱いを維持する。
- 設定リファレンスを更新し、設定読み込み・警告の重複抑止・ローカル設定・利用時エラー・orchestrator 起動・`register branch-check`・`exec validate --records-only` の回帰テストを追加・拡張した。

### 5.2. マシンごとの置き場

`src/shared/local-config.ts` と既存の `tests/src/shared/local-config.test.ts` を確認し、PJR-F6MC で対応済みと分かった。共有にある別名は `.specdojo/specdojo.local.config.json` の `external_projects.<alias>.path` だけを差し替えられる。共有にない別名は `path` と `project_id` を local に書けば追加できる。共有の既存別名は `path` 必須のため、共有からそのキーだけを除いて local に移す形は使えない。

今回の回帰テストでは、共有の未配置パスを既存ディレクトリへ差し替えるとその警告が出ず、local に追加した別名の未配置だけが警告になることも検証対象とした。保護された設定の変更は不要。

### 5.3. 検証

変更ファイルの Prettier 整形、`npm run validate:history-links`、`node --import tsx tools/catalog-validate-if-configured.mjs`、`node --import tsx src/specdojo.ts register build --project prj-0001`、`git diff --check` は成功した。カタログ検査には既存の未配置文書・再エクスポート参照などの警告があるが、エラーはない。`typecheck`・`lint:ts`・`test:unit`・`test:integration`・Markdown 検査など、指定された親検証は runner が executor 終了後に実行し、結果を evidence に追記する。

### 5.4. CHANGELOG に書く事項

- 区分: 不具合修正
- 文案: `external_projects` の置き場がないときは設定読み込みを警告にとどめ、外部 project を使わないコマンドや CI 検査を実行できるようにした。外部 project の利用時には、設定と解決先を示すエラーで停止する。

## 6. 関連ドキュメント

- [[specdojo:specdojo-config-reference|SpecDojo設定リファレンス]]
- [[specdojo:register-operation-guide|登録簿運用ガイド]]
- [[prj-0001:pjr-f6mc-local-config-external-projects|PJR-F6MC ローカル設定の外部 project 対応]]
