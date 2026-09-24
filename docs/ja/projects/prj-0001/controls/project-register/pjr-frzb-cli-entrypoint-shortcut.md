---
specdojo:
  id: prj-0001:pjr-frzb-cli-entrypoint-shortcut
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: question
  item_status: open
  priority: low
  owner: ARC
  registered_at: "2026-09-23T12:42:58Z"
  due_on: "2026-10-31"
---

# PJR-FRZB CLI の入口を短くする方法を決める

## 1. 確認事項

npx specdojo は打鍵が長い。短い bin 名（sd など）の配布、gradlew 型の wrapper スクリプト、文書での alias / PATH 案内のいずれを採るかを決める。sd は npm に別パッケージが登録済みで、未導入ディレクトリでの npx sd が無関係なパッケージを取得する危険と、Rust 製 sd を黙って置き換える問題がある。

## 2. 背景

導入後の実行は `npx specdojo <command>` を案内している。打鍵が長く、サブコマンドを伴うと冗長になる。

```sh
npx specdojo register add --project prj-0001 --type todo --title "..."
```

`npm run` 経由は引数の受け渡しに `--` が要り、かえって長くなる。

```sh
npm run sd -- register add --project prj-0001
```

### 2.1. gradlew 型 wrapper との対比

`gradlew` の価値は 3 つあるが、npm では 2 つが既に満たされている。

| 価値       | gradlew                            | npm                        |
| ---------- | ---------------------------------- | -------------------------- |
| 版の固定   | `gradle-wrapper.properties` で宣言 | `package-lock.json` が担う |
| bootstrap  | Gradle 未導入でも動く              | `npm ci` が担う            |
| 起動の短縮 | `./gradlew`                        | 未解決                     |

したがって wrapper を配っても得られるのは打鍵の短縮だけで、`gradlew.bat` 相当のクロスプラットフォーム対応と配布・更新の手当てが新たに必要になる。

### 2.2. 短い bin 名を配る場合の危険

`sd` / `sdj` / `spd` はいずれも npm に登録済みである（2026-09-23 に確認）。

| 名前  | 登録状況                                               |
| ----- | ------------------------------------------------------ |
| `sd`  | 0.0.3 「A CLI tool for convinence of `sudo` on Linux」 |
| `sdj` | 1.0.1 discord.js のラッパー                            |
| `spd` | 1.0.0 shipit のデプロイ用                              |

これにより 2 つの問題が生じる。

- `npx sd` は、ローカルに無ければ npm から取得して実行する。利用者が未導入のディレクトリで実行すると、無関係なパッケージが落ちてきて動く。
- `sd` は Rust 製の広く使われる CLI（sed 代替）でもある。`node_modules/.bin` が PATH に入る環境では、SpecDojo を導入しただけで利用者の `sd` が警告なく置き換わる。

配布側が短い汎用名を占有すると、利用者の環境を壊す側に回る。`kubectl` が `k` を配らず利用者の alias に委ねているのと同じ理由である。

## 3. 回答候補

| 候補 | 内容                                                                                | 利点                                                | 懸念                                                                         |
| ---- | ----------------------------------------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------- |
| A    | 配布側は `specdojo` のみ。文書で alias、PATH 追加、VS Code 統合ターミナルを案内する | 追加の配布物が無く、衝突の危険もない                | 利用者ごとに設定が要る。チームで入口が揃わない                               |
| B    | `config init --wrapper` のような任意生成で `specdojow` を置く                       | 入口を揃えたいチームは選べる。既定は増やさない      | クロスプラットフォーム対応と更新手段が要る                                   |
| C    | 既定で wrapper を生成する                                                           | プロジェクトに入れば `./specdojow` だけ覚えればよい | 利用者リポジトリへ配布物が増える。npm の慣習から外れる                       |
| D    | 短い bin 名（`sd` など）を配る                                                      | 最も短い                                            | 既存パッケージおよび既存ツールとの衝突。`npx` の自動取得が危険。**採らない** |

D は危険が明確なため候補から除く。

判断の分かれ目は、チーム開発で全員の入口を揃える必要があるかである。単独運用が続く間は A で足り、複数人になった時点で B の価値が上がる。

## 4. 回答・結論

-

## 5. 承認

| 項目     | 内容   |
| -------- | ------ |
| 回答者   | _TODO_ |
| 回答日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は既定で `commit`（`register close` により `decided` へ遷移）を用いる。
- 回答が不可逆・高リスク・framework schema 破壊的変更を伴う場合は `PR` 方式で承認し、証跡に PR URL と merge SHA を記載する。

## 6. 関連ドキュメント

- [[specdojo:quick-start-guide]]
- [[specdojo:waza-guide]]
- [[prj-0001:pjr-09kk-npm-onboarding-path]]
