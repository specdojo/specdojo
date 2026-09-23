---
specdojo:
  id: prj-0001:pjr-09kk-npm-onboarding-path
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-09-23T03:50:08Z"
  due_on: "2026-10-31"
---

# PJR-09KK npm 導入から exec までの導線を README と quick-start へ反映する

## 1. 概要

[[prj-0001:pjr-fkn1-kata-distribution-method]] の第 4 段階。npm 公開後の利用者が、`npm install specdojo` から Detached Unit を立ち上げて exec まで到達できる導線を文書へ反映する。

現状の README は「CLI だけでなく文書体系一式を配置する場合は Use this template から新しいリポジトリを作成する」と案内しており、npm 導入と両立していない。空リポジトリでの実測では、register 系と `dashboard build` は動くが、`catalog scaffold` は `catalog_path not set`、`exec plan` は `Template not found` で止まった。

## 2. 完了条件

- 空リポジトリで `npm install specdojo` から `config init`、`register scaffold`、`catalog scaffold`、`exec plan --register` までを通しで実行し、手順どおりに完了することを確認している。
- README の導入手順が npm 経由で完結し、テンプレートリポジトリは選択肢として位置づけられている。
- [[specdojo:quick-start-guide]] の Detached Unit 手順が、kata の扱い（参照が既定、必要なら eject）を含めて実態に合っている。
- `config init` の雛形に不足するパスキー（`catalog_path`、`schedule_path`、`execution_path`、`members_path`、`roles_path`、`viewpoints_path`、`routines_path`、`jobs_path`）の扱いが決まっている。雛形へ含めるか、キー一覧を reference へ載せるかのいずれかとする。
- 文書 lint 設定（`.remarkrc.yaml` など）の導入手順が案内されている。
- `npm run check` と `npm run docs:build` が通過している。

## 3. 作業内容

| No  | 作業                                                              | 担当 | 状態 | メモ                                  |
| --- | ----------------------------------------------------------------- | ---- | ---- | ------------------------------------- |
| 1   | 空リポジトリで npm 導入から `exec plan` までを通しで確認する      | DEV  | open | 失敗箇所を記録してから文書を直す      |
| 2   | `config init` の雛形とパスキーの案内を整える                      | DEV  | open | 雛形拡張か reference 追加かを決める   |
| 3   | README の導入手順を npm 経由で完結させる                          | DEV  | open | テンプレートは選択肢へ降格            |
| 4   | `quick-start-guide` の Detached Unit 手順へ kata の扱いを反映する | DEV  | open | eject の案内を含める                  |
| 5   | 文書 lint 設定の導入手順を案内する                                | DEV  | open | `docs-editing-guide` との重複を避ける |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-fkn1-kata-distribution-method]]
- [[prj-0001:pjr-ypns-kata-resolution]]
- [[prj-0001:pjr-aak1-kata-subcommands]]
- [[prj-0001:pjr-tbhh-detached-unit-default]]
- [[specdojo:quick-start-guide]]
- `README.md`
