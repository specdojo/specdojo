---
specdojo:
  id: prj-0001:pjr-wagy-catalog-strategy-approach
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: hard
  registered_at: "2026-10-27T22:58:31Z"
  completed_at: "2026-10-28T00:52:34Z"
  conclusion: "catalog-planning と strategy-planning の approach を追加した。--target domain:/track: で対象を指し、plan に kata とカタログの参照と完了条件を展開する。timeline build と strategy 生成が register から catalog_status を導き、tml-index は書き換えない"
  derived_from:
    - PJR-NJJ7
  depends_on:
    - PJR-B4Y4
---

# PJR-WAGY カタログと strategy を作るための approach を追加する

## 1. 概要

子 todo からカタログの判定と生成（catalog plan・scaffold --plan）と schedule strategy generate を流せるようにし、todo の close から `catalog_status` を導く

- PJR-NJJ7 の決定に従い、epic の子 todo からカタログと strategy を作れるようにする。

## 2. 完了条件

- approach を 2 つ追加する。名前は executor が決める。
  - カタログを作る approach: agent が `catalog plan prompt` の指示に沿ってインスタンスを判定し、`catalog plan scaffold --from` で `dct-plan-<domain>.yaml` に取り込み、`catalog scaffold --plan` で `dct-<domain>.yaml` を作るまでを流す。
  - strategy を作る approach: agent が `sch-strategy-<track>.yaml` に scope と `approach_rules` を宣言し、`schedule strategy generate` と `schedule build --track` までを流す。
- domain と track を `--target` でどう指すかを executor が決め、理由を記録する。
- 2 つの approach の plan は、既存の kata と成果物カタログの参照を取り込み、完了条件が plan に出る。
- `timeline build` が register から `catalog_status` を導く。カタログを作る todo が `done` ならその domain を `primary` とみなす。人が書く計画である `tml-index.yaml` は書き換えず、手書きの値と食い違うときは警告する。
- command-reference を更新する。
- CHANGELOG の `## [Unreleased]` に追記する。公開済みの版の節は変えない。
- 単体テストで、approach の検証・plan の生成・`catalog_status` の導出を確かめる。
- 作業の中で `npm run typecheck`・`npm run lint:ts`・`npm run lint:md`・`npm run test:unit` が通り、親の検証 7 件が通る。
- 空のリポジトリで「カタログを作る todo → `timeline build` → strategy を作る todo」の流れを実際に通し、手順と結果を本個票の対応結果に書く。
- 設計で決めることは executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。

## 3. 作業内容

| No  | 作業                                        | 担当     | 状態 | メモ |
| --- | ------------------------------------------- | -------- | ---- | ---- |
| 1   | カタログを作る approach を追加する          | executor | done | -    |
| 2   | strategy を作る approach を追加する         | executor | done | -    |
| 3   | `timeline build` で `catalog_status` を導く | executor | done | -    |
| 4   | command-reference・CHANGELOG を更新する     | executor | done | -    |
| 5   | 単体テストと空のリポジトリでの確認          | executor | done | -    |

## 4. 対応結果

- `catalog-planning` と `strategy-planning` を追加した。前者はカタログのインスタンス判定から DCT の生成、後者は scope・intent の宣言から strategy・track の生成までを一つの register todo の範囲とする。kata を新規執筆する既存の `*-authoring` とは対象契約が異なるため、名称を `*-planning` とした。両者は register 専用であり、schedule の成果物タスクへ指定した場合は停止する。
- `--target domain:<domain>` / `--target track:<track>` を各一件指定する方式にした。project はコマンドの実行コンテキストから決まる。未作成文書にも指定でき、一つの domain が複数 DCT に物理分割されても一つの todo にできるため、既存文書の doc ID やファイル名を対象にしない。ID は英小文字・数字・ハイフン、先頭は英小文字か数字、最大 63 文字とする。`catalog_path` を必須とし、strategy では `schedule_path` も必須、timeline がある場合は track の定義を検証する。timeline がない project は strategy に明示する scope を使える。`--source`・`--target-path`・`--target-rulebook` との混用を拒否する。
- plan へ既存カタログの ID・path・domain、DCT / Schedule の rulebook とそこから解決した recipe・sample・template、DCT の domain 別 template、個票の完了条件を展開する。カタログの plan は `catalog plan prompt` → agent の YAML 判定 → `catalog plan scaffold --from` → `catalog plan validate` → `catalog scaffold --plan` → `catalog validate` を完了条件とする。上流資料がない場合の `--input`、初回の size 指定、`dct-index.yaml` の domain 登録も指示する。strategy の plan は `scope.catalogs`・`approach_rules`・担当の明示と `schedule strategy generate` → `schedule build --track` の成功を条件とする。既存ファイルの差分確認と必要時のみの `--force`、入力・grade 不足時の停止も記載した。
- `timeline build` は `project_register_path` の個票から `catalog-planning` の todo を domain ごとに集める。`done` が一件でもあれば domain は `primary`、着手中（`in-progress` / `waiting` / `review`）は `draft`、`open` だけなら `not_started` とし、`rejected` / `deferred` は除外する。todo がない domain は既存運用との互換性のため手書きの値を保持する。複数 domain の track は全 domain が `primary` なら `primary`、一部だけ進んでいれば `draft` とする。再開した todo は次回 build で再計算する。人が宣言した値との不一致は警告し、`tml-index.yaml` は一切書き換えない。`timeline.json` には導出後の `track_catalog_status` を追加した。
- strategy 生成も同じ register 由来の導出を使う。`timeline build` が準備済みとした track を、古い手書き値だけで未準備と警告する不整合を防ぐ。状態の導出と個票の読み取りは register モジュールへ置き、shared から feature への依存を作らない。
- approach の enum・plan / result の identity 復元・対象検証と CLI ヘルプ、command-reference、CHANGELOG の Unreleased を更新した。単体テストには対象形式・必要設定・不正な混用・未作成対象・plan の参照と完了条件・schedule 経由の拒否・各 todo 状態・再開・複数 domain・共有 domain・手書き値の保持・build と strategy scope の一致を追加した。

### 空の作業用リポジトリでの確認

- 既存成果物のない一時ディレクトリに package・project 設定、roles、`catalog_status: not_started` の demo track、上流資料 `docs/input.md`、一成果物の demo DCT template を用意した。Git の commit・設定変更は行っていない。新しい plan も `exec plan --register` で生成し、既存 CLI の Command 登録・parse を通して次の順に実行した。agent の判定は本 executor が prompt と上流資料から実施した。外部 agent CLI は起動していない。

```bash
specdojo register scaffold
specdojo register add --type epic --track demo --title "Demo work" --id PJR-EP01 --topic demo
specdojo register add --type todo --from PJR-EP01 --title Catalog --id PJR-CA01 --topic catalog --approach catalog-planning --target domain:demo
specdojo exec plan --register PJR-CA01 --out catalog-plan.md
specdojo catalog plan prompt --domain demo --input docs/input.md --out prompt.md
# prompt に従い agent-output.yaml に一件の採用・根拠・空の未確定事項を記入
specdojo catalog plan scaffold --domain demo --input docs/input.md --from agent-output.yaml
specdojo catalog plan validate --domain demo
specdojo catalog scaffold --domain demo --plan --size small
# dct-index.yaml に size: small と demo domain の索引を記入
specdojo catalog validate
specdojo register start --id PJR-CA01
specdojo register review --id PJR-CA01
specdojo register close --id PJR-CA01 --conclusion "判定計画とカタログを検証した"
specdojo timeline build
specdojo register add --type todo --from PJR-EP01 --depends-on PJR-CA01 --title Strategy --id PJR-ST01 --topic strategy --approach strategy-planning --target track:demo
specdojo exec plan --register PJR-ST01 --out strategy-plan.md
# sch-strategy-demo.yaml に demo catalog の scope と bootstrap-kata-set の intent を宣言
specdojo schedule strategy generate --track demo --default-owner DEV --gate-owner PO --milestone-owner PO --force
specdojo schedule build --track demo
```

- 全コマンドが成功し、判定計画、DCT、strategy、4 タスクの track、1 milestone を生成した。todo の close 後、`schedule_ready_tracks` は `[demo]`、`track_catalog_status.demo` は `primary` となり、手書きの `not_started` との差を警告した。開始時と最後の `tml-index.yaml` の内容一致も検証した。未作成の成果物に対する `based_on` 警告、fixture 個票の未記入箇所により文書を draft に保つ警告、既存の Ajv の date format 警告は出たが、生成・検証は成功した。作業用データは確認後に削除する。
- 生成した二つの個票と二つの plan の frontmatter を抽出し、`validate:schema:file` で個票用・exec plan 用 schema へ適合することを確認した。共通規約に従い Prettier、`register build --project prj-0001`、hook と同じ catalog 検証、`git diff --check` を実行した。catalog 検証は未作成成果物の `based_on` 警告を伴うが終了コード 0。親検証 7 件（lint-ts・lint-fm・lint-md・test-integration・validate-schema・typecheck・test-unit）は executor で重複実行せず、runner が追記する判定を正とする。

## 5. 関連ドキュメント

- [[specdojo:timeline-design-guide]]
- [[specdojo:command-reference]]
- [[specdojo:dct-rulebook]]
