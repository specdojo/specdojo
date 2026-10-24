---
specdojo:
  id: prj-0001:pjr-pm2r-external-project-specdojo-repo
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-24T13:41:22Z"
  due_on: "2026-10-31"
---

# PJR-PM2R external_projects で SpecDojo のリポジトリへ起票を任せられない

## 1. 課題内容

`external_projects` の起票の委譲は相手の `node_modules/.bin/specdojo` を呼ぶが、SpecDojo 自身のリポジトリには `npm install` 後もこの実行ファイルがないため、利用者のリポジトリから本家へ起票できない。

- 起きた条件: 利用者のリポジトリ（coderdojo-lessons-specdojo）から、clone した SpecDojo のリポジトリ（`project/prj-0001/develop`、0.4.5）へ、[[prj-0001:pjr-ss72-maintenance-plan-md036]] などを起票しようとした。
- 確かめたこと: `targetSpecdojoExecutable`（`src/register/external-project.ts`）は `<相手のリポジトリ>/node_modules/.bin/specdojo` がないとエラーにする。SpecDojo のリポジトリで `npm install` と `npm run build` を実行しても、自分自身の bin は `node_modules/.bin` に入らない。
- 実際に `external_projects` を設定して委譲を試してはいない。上の2点から、委譲は `External project repository does not have SpecDojo installed` で止まると判断した。
- 回避: SpecDojo のリポジトリの clone で `node dist/specdojo.js register add ... --commit` を直接実行して起票した。

## 2. 影響範囲

| 観点         | 影響                                                               |
| ------------ | ------------------------------------------------------------------ |
| スコープ     | 利用者のリポジトリから SpecDojo の登録簿への起票の委譲             |
| スケジュール | 利用者は SpecDojo のリポジトリの clone で CLI を直接使う必要がある |
| コスト       | clone での `npm install` と `npm run build` が要る                 |
| 品質         | なし                                                               |
| 関係者       | SpecDojo へ不具合を報告する利用者                                  |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                  |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 委譲は相手のリポジトリに npm で導入された CLI だけを想定している                                                                                      |
| 対応策   | 相手が SpecDojo 自身のリポジトリの場合は `dist/specdojo.js` を使う、など実行ファイルの探し方を広げる。対応しない場合は、文書に制約と回避の手順を書く  |
| 依存事項 | なし                                                                                                                                                  |
| 完了条件 | 利用者のリポジトリから SpecDojo のリポジトリの project へ `register add --project <別名> --commit` で起票できる。または、制約と回避の手順が文書にある |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-ss72-maintenance-plan-md036]]：委譲を試すきっかけになった不具合
- [[prj-0001:pjr-68kr-checkpoint-failure-summary]]：同じく起票した不具合
