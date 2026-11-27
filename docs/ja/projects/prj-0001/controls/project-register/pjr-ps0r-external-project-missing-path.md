---
specdojo:
  id: prj-0001:pjr-ps0r-external-project-missing-path
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
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

external_projects の path が見つからないとき、設定の読み込みがエラーになり、外部の project を使わないコマンドも止まる。GitHub の検査（Check register branch push・Check execution record layout）が 11-26 から失敗し続けている

## 2. 入力

- d7d8cdf7e8（11-26）で `external_projects.prj-0002`（path: ../specdojo-prj-0002）を足してから、GitHub の Check register branch push と Check execution record layout が、置き場がないエラーで失敗し続けている。検査のサーバーは specdojo のリポジトリだけを checkout する
- エラーは src/shared/specdojo-config.ts の検証で出る: `external_projects.prj-0002.path` "../specdojo-prj-0002" does not exist
- 利用者（indie）は、置き場がないことは警告にとどめ、使うときだけエラーにする案 B を選んだ。マシンごとの設定（specdojo.local.config.json）へ置き場を移せるかは、この項目で確かめて記録する（2026-11-27）

## 3. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

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

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
