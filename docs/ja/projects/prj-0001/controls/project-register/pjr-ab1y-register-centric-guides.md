---
specdojo:
  id: prj-0001:pjr-ab1y-register-centric-guides
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  registered_at: "2026-10-27T22:58:44Z"
  completed_at: "2026-10-28T01:12:30Z"
  conclusion: register-operation・exec-operation・timeline-design・specdojo-overview・quick-start の 5 本を、register と epic を起点とし schedule を子とする構成へ書き換えた
  derived_from:
    - PJR-NJJ7
  depends_on:
    - PJR-WAGY
---

# PJR-AB1Y ガイドを register を起点とする構成へ書き換える

## 1. 概要

register-operation、exec-operation の実行経路の使い分け、timeline-design、command-reference を、register と epic を起点とする構成へ書き換える

- PJR-NJJ7 の決定と、PJR-B4Y4・PJR-WAGY の実装に合わせて、ガイドを register を起点とする構成へ書き換える。

## 2. 完了条件

- register-operation-guide の `登録簿の位置づけ` で、「schedule へ移った作業は二重に管理しない」を「register が起点と完了の判断を持ち、途中の進み具合は schedule が持つ」に書き換える。
- exec-operation-guide の `実行経路の使い分け` で、register と schedule を同格の 2 経路ではなく親と子として説明する。
- timeline-design-guide の `運用タイミング` の図と表を、「`epic` の起票 → 子 todo でカタログ → strategy → sch-track → schedule」の流れに書き換え、`catalog_status` を register から導くことを書く。
- specdojo-overview-guide と quick-start-guide の基本的な流れと技の説明を、上の 3 本と食い違わないようにそろえる。
- 名前とコマンドは PJR-B4Y4 と PJR-WAGY で実装したものに合わせ、実装にない機能は書かない。
- `npm run lint:md` と `npm run docs:build` が通り、親の検証 7 件が通る。
- 設計で決めることは executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。

## 3. 作業内容

| No  | 作業                                                    | 担当     | 状態 | メモ |
| --- | ------------------------------------------------------- | -------- | ---- | ---- |
| 1   | register-operation-guide を書き換える                   | executor | done | -    |
| 2   | exec-operation-guide を書き換える                       | executor | done | -    |
| 3   | timeline-design-guide を書き換える                      | executor | done | -    |
| 4   | specdojo-overview-guide と quick-start-guide をそろえる | executor | done | -    |

## 4. 対応結果

- PJR-NJJ7 の決定および PJR-B4Y4、PJR-WAGY の実装に合わせ、5 本のガイドを register と `epic` を起点とする構成へ書き換えました。
- `docs/ja/specdojo/guides/register-operation-guide.md`: `1.1. 登録簿の位置づけ` で、「成果物カタログと依存関係に基づく計画済みの作業へ移った後は schedule で管理し、登録簿との二重管理をしません」を「register が起点と完了の判断を持ち、途中の進み具合は schedule が持ちます。成果物タスクの進捗は schedule の依存グラフで管理し、個々の成果物タスクを登録簿に二重管理しません」へ書き換えました。あわせて `1.2. 登録の判断基準` でも、個々の成果物タスクは schedule で管理し、track 全体の着手承認と完了判断を `epic` で管理する関係性へ更新しました。
- `docs/ja/specdojo/guides/exec-operation-guide.md`: `1.2. 実行経路の使い分け` で、register と schedule を同格の 2 経路ではなく、register を親（業務の起点・着手承認・完了判断）、schedule を子（成果物カタログに基づく途中の進み具合・依存実行）とする階層関係として説明を刷新しました。比較表の典型用途・役割、迷ったときの判断基準、および後続段落も親子関係に合わせて更新しました。
- `docs/ja/specdojo/guides/timeline-design-guide.md`: `3. 運用タイミング` の mermaid 図と更新契機表を、「`epic` の起票 → 子 todo でカタログ（`catalog-planning`） → strategy（`strategy-planning`） → sch-track → schedule」の流れに書き換えました。また、`timeline build` が register の `catalog-planning` todo の完了から `catalog_status` を導出する仕様（todo が `done` なら `primary`、着手中なら `draft`、`open` だけなら `not_started`、`tml-index.yaml` の手書き値は書き換えずに警告する仕様）を反映し、成果物インスタンス判定やアンチパターンの記述も整合させました。
- `docs/ja/specdojo/guides/specdojo-overview-guide.md`: 第 5 章「プロジェクトの基本的な流れ」の図と手順を「register / decision → track ごとの `epic` 起票 → 子 todo からカタログ・strategy 作成 → Schedule 展開・実行 → レビュー・確定・`epic` 完了」へ更新し、第 6 章の技のマトリクスと説明でも register を親、schedule を子とする親子関係にそろえました。
- `docs/ja/specdojo/guides/quick-start-guide.md`: 3.14 章を「issueからdecision、epic、成果物カタログ・Scheduleへ進む」へ改題し、`register add --type epic --track launch` と子 todo（`--approach catalog-planning --target domain:project-definition`）の流れを導入し、register が起点と完了判断を持ち schedule が途中の進捗を持つ構成へ改めました。あわせて第 4 章への導入文も整合させました。
- コマンドと識別子は先行タスク PJR-B4Y4（`epic` 型、`--track`、`derived_from` 逆引き）および PJR-WAGY（`catalog-planning`、`strategy-planning`、`domain:<domain>`、`track:<track>`、`catalog_status` 導出）の実装に正確に一致させ、未実装の機能は記述していません。
- 検証として `npm run docs:build` を実行し、全ステップ（exec refresh, catalog build, register build, yaml-pages build, dashboard build, index build, vitepress build）が成功（exit code 0）することを確認しました。親ランナーの 7 件の検証（lint-ts, lint-fm, lint-md, test-integration, validate-schema, typecheck, test-unit）は親 runner に委ねます。

## 5. 関連ドキュメント

- [[specdojo:register-operation-guide]]
- [[specdojo:exec-operation-guide]]
- [[specdojo:timeline-design-guide]]
- [[specdojo:specdojo-overview-guide]]
- [[specdojo:quick-start-guide]]
