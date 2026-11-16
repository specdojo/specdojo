---
specdojo:
  id: prj-0001:pjr-dgrz-proficiency-frontier-tier
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-16T13:05:31Z"
  commit_type: feat
  commit_scope: exec
---

# PJR-DGRZ proficiency に expert の上の段 frontier を足し、名前指定のときだけ使えるようにする

## 1. 概要

Astra・Fable のように通常は使わない最上位の agent を、自動の選択では選ばず、名前指定や明示の要求のときだけ使えるようにする

## 2. 入力

- 2026-11-16、利用者が codex の gpt-6-astra と Claude Code の fable（最新の model の別名）を、通常は使わず名前指定のときだけ使う member として足すことを依頼した
- disabled: true は --executor-by でも止まり、priority: 9 は作業中の agent を後ろに回す並べ方のため自動の選択から確実には外れない（src/exec/run/shared.ts の selectCandidates）。利用者が expert の上の proficiency を用意する案を選んだ（2026-11-16）
- proficiency の一覧は型・設定・strategy・job の検査・スキーマに重複して固定されている。codex の effort は exec-defaults.yaml の `by_proficiency` から決まる
- Astra と Fable の member は、この項目が統合されてから proficiency: frontier で名簿に足す

## 3. 完了条件

- proficiency に expert の上の段 `frontier` を足す。対象は、型・設定の読み込み・strategy の判定・job の入力の検査・proficiency を持つすべてのスキーマ・関連する文書とする。
- 自動の選択（`exec run --auto`、schedule の並列の実行、rate limit のときの代わりの選択を含む）では、frontier の member を選ばない。例外はタスクや routing が frontier を明示して求めた場合だけとし、タスクが proficiency を指定しない場合や、上位の agent がすべて作業中の場合も選ばない。
- 名前指定（`--executor-by`・`--fallback-executor-by`・routing・sch-strategy の agent・job の agent）では frontier の member を使える。
- `exec-defaults.yaml` の `by_proficiency` に frontier の対応がない provider の member は、起動の前に原因の分かるエラーにする。`config init` が作る雛形にも frontier の対応を入れる。
- 名前指定で選べること、自動の選択で選ばれないこと、`by_proficiency` の展開を回帰テストで確かめる。
- このリポジトリの `.specdojo/exec-defaults.yaml`（codex の `by_proficiency` に `frontier` を足す。例: effort `xhigh`）は、案を個票の対応結果と `handoff` に書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書き、報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。影響がなければ「なし」と書く（PJR-EPQ3）。
- 保護された設定（`.specdojo/`・`package.json`・`.agents/`・`.claude/`・`.codex/`・`lefthook.yml` など）は変えず、変更が要る場合は案を個票の対応結果と報告の `handoff` に書く。反映は利用者の承認のもと feature ブランチで行う。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                             | 担当 | 状態 | メモ                                                                                         |
| --- | ------------------------------------------------ | ---- | ---- | -------------------------------------------------------------------------------------------- |
| 1   | 段の追加と自動の選択の規則を設計する             | DEV  | done | 共通の候補抽出で明示要求を必須にし、名前指定は従来の解決経路を使う                           |
| 2   | 型・スキーマ・検査・雛形を直し、回帰テストを足す | DEV  | done | 共通の型・値検査、起動前検査、全標準 provider の雛形と選択・入力・スキーマの回帰テストを追加 |
| 3   | 文書を直し、exec-defaults の変更案を書く         | DEV  | done | 設計規約と設定・Schedule・Job の説明を更新。保護設定の変更案は下記                           |

## 5. 対応結果

### 5.1. 実施内容・判断

- `frontier` を `expert` より上の段として共通型・値検査に追加した。設定の member 型と strategy / Job の入力検査も共通定義を使う。proficiency を参照するスキーマは `exec-common.schema.yaml` の列挙を正本にそろえた。
- 自動選択は共通の `selectCandidates` で `proficiency: frontier` の明示要求を必須にした。習熟度未指定、通常候補がすべて busy、rate limit の代替候補も同じ規則になる。CLI、routing、sch-strategy / Job の agent 指名は従来の名前解決経路で使用できる。init の routing 生成でも frontier を通常候補から除外する。
- 起動コマンドの解決時に `providers.<provider>.command_params.by_proficiency.frontier` を検査し、未定義なら member 名と設定パスを示して失敗させる。member の `command` 上書きも例外にしない。名前指定でも設定不足を見逃さないため、この位置で検査する。
- 追加変数が不要な provider は `frontier: {}` で対応を明示できるようにした。mode ごとの役割や member の model を上書きせず利用できるためである。空 mapping は frontier のみに許可し、他の段の変数表の制約は維持した。`templates/init-exec-defaults.yaml` に Codex の `{ effort: xhigh }`、他の標準 provider の `{}` を追加した。
- 現行の `config init` は基本設定だけを作り、exec-defaults を生成しない。起動設定を生成する正規の入口 `specdojo init --exec` の雛形を更新し、init の回帰テストにも対応を追加した。
- 名前指定（alias を含む）、難易度 routing、明示 fallback、通常候補がすべて busy の場合を含む自動選択の除外、明示要求時の能力・mode・role 制約、変数展開、設定不足の拒否、名簿・Job・strategy・スキーマ入力の回帰テストを追加した。テスト実行は親 runner の検証に委ねる。

### 5.2. 保護設定の変更案・申し送り

本リポジトリの `.specdojo/exec-defaults.yaml` は変更していない。統合後、利用者の承認を得て feature ブランチで `providers.codex.command_params.by_proficiency` に `frontier: { effort: xhigh }` を加える。Fable を追加する前には `providers.claude.command_params.by_proficiency` に `frontier: {}` も加える。Astra / Fable の名簿追加は入力どおり統合後の別作業とし、今回は行っていない。

runner の変更を含むため、統合後の実 CLI による確認は運用メモに従って PJR-JSEY で行う。親 runner が型・lint・unit / integration・全体 schema 検証を実行する。

### 5.3. CHANGELOG に書く事項

- 区分: 追加。文案: 「agent の習熟度に最上位の `frontier` を追加。名前指定または `proficiency: frontier` の明示要求時だけ使用でき、明示要求のない自動選択や rate limit の代替候補には含まれません。起動には provider の `by_proficiency.frontier` 設定が必要です。」

### 5.4. 検証結果

- 変更ファイルの Prettier 整形と `git diff --check` が成功した。
- `npm run validate:schema:file -- --schema docs/specdojo/schemas/v1/exec-defaults.schema.yaml --data templates/init-exec-defaults.yaml` が成功した。
- `node --import tsx tools/catalog-validate-if-configured.mjs` が成功した。既存カタログの再エクスポート参照・未作成成果物などの警告はあるが、エラーはない。
- `npm run validate:history-links` が成功した。型・lint・unit / integration・全体 schema 検証は設定済みの親検証で実行する。
- `node --import tsx src/specdojo.ts register build --project prj-0001` が成功し、登録簿の派生ビューを再生成した。

## 6. 関連ドキュメント

- [[specdojo:exec-config-guide|exec 設定ガイド]]
- [[specdojo:schedule-design-guide|Schedule 設計ガイド]]
- [[specdojo:job-definition-standard|Job 定義標準]]
- [[prj-0001:pm-orchestrator-playbook|オーケストレーター運用メモ]]
