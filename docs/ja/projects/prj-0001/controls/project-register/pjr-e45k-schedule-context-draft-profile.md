---
specdojo:
  id: prj-0001:pjr-e45k-schedule-context-draft-profile
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  registered_at: "2026-10-28T22:23:00Z"
  derived_from:
    - PJR-65DS
  depends_on:
    - PJR-3MY5
    - PJR-JRSY
---

# PJR-E45K 雛形・文脈・draft・磨き込みを並べる schedule の profile を追加する

## 1. 概要

雛形と人による文脈の記入、draft、refine、review、finalize の順で段を並べる strategy profile を追加する

## 2. 完了条件

- strategy の profile に、雛形の作成と人による文脈の記入（human）、`draft`（agent）、refine（`fully-guided`、agent）、review、finalize（human）の順で段を並べる profile を追加する。profile の名前と、雛形の作成を独立した段にするか文脈の記入と同じ人の段にするかは executor が決める。
- `strategy-planning` と strategy の生成で、新しい profile を選べる。
- guided-pass の草案の段（「草案作成（実践の型に沿う）」）の approach を `fully-guided` から `draft` に替える。PJR-3MY5 で fully-guided が磨き込み専用になり、未作成の成果物を書かなくなったため（利用者の判断、案 A）。文脈が無い場合の `draft` が、型に沿って雛形から下書きすることを plan で確かめ、型がそろった成果物を schedule で新規に作れることを単体テストで確かめる。CHANGELOG の `## [Unreleased]` の `変更` に、profile の挙動が変わることを書く。
- 人の段は、既存の human タスクと同じく claim / complete で状態を記録し、plan に `deliverable scaffold` の実行と `_CONTEXT_` の書き方を示す。
- schedule の設計ガイド（strategy の profile を説明しているもの）に新しい profile と使いどころを書く。
- 単体テストで、新しい profile から生成される段・approach・依存の順序を確かめる。
- `CHANGELOG.md` の `## [Unreleased]` 節（無ければ `## [0.5.0]` の上に作る）に追記する。`0.5.0` と公開済みの版の節は変えない。
- 作業の中で `npm run typecheck`・`npm run lint:ts`・`npm run lint:md`・`npm run test:unit` が通り、親の検証 7 件が通る。
- 設計で決めることは executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。保護された設定に触れる必要がある場合は、変更せずに案を本個票の対応結果と `handoff` に書く。

## 3. 作業内容

| No  | 作業                              | 担当     | 状態 | メモ                                                    |
| --- | --------------------------------- | -------- | ---- | ------------------------------------------------------- |
| 1   | 新しい profile を追加する         | executor | done | `draft` profile と human の `context-pass` を追加       |
| 2   | strategy の生成と選択に対応させる | executor | done | `intent: draft-with-context` から選択・生成             |
| 3   | ガイドとテストを更新する          | executor | done | ガイド・規則・CHANGELOG・生成と plan の回帰テストを更新 |

## 4. 対応結果

### 実施内容と設計判断

- profile 名は既存の approach から選択する仕組みに合わせて `draft` とした。雛形作成と文脈記入を一つの human 段（`context-pass` / suffix `010`）にまとめ、人が雛形を確認してその場で前提・制約・委任範囲を書けるようにした。独立した雛形作成の待ち段は設けない。
- `intent: draft-with-context` を追加し、必要な Kata がすべて利用可能なら `draft` profile を生成する。`not-needed` は要否宣言に従って除外する。型の不足・grade 不明・利用不可の場合は別 profile に退避せず生成を停止する。従来の `author-deliverable` の選択規則は維持した。
- 生成順は context（human / edit / `draft`）→ draft（agent / edit / `draft`）→ refine（agent / edit / `fully-guided`）→ review（agent / review / `fully-guided`）→ finalize（human / edit / `finalize`）。各段は直前の段に依存する。初回パスの gate は下書き完了後に置き、文脈記入だけでは通過させない。
- human は既存の claim / complete を利用する。human の plan を作らない既存仕様に合わせ、`strategy-planning` の plan に `deliverable scaffold` と `_CONTEXT_:` の書き方・記録方法を展開し、claim 時の human draft result にも専用テンプレートで案内する。成果物カタログの対象を確認し、既存成果物を上書きしない。
- `guided-pass` の草案作成 approach を `draft` に変更した。文脈なしでも未作成なら template を骨組みにして根拠のある範囲を下書きし、文脈がないことを調査・選定の委任とは解釈しないことを draft plan に明記した。refine は `fully-guided` のまま、既存草案を磨く。
- [[specdojo:schedule-design-guide|Schedule設計ガイド]] と [[specdojo:sch-rulebook|スケジュール作成ルール]] に選択方法・使いどころ・実行順を反映した。rulebook の更新は `upsert-rulebook` に従い、記述標準、既存の Timeline / DCT rulebook と、現在の成果物リファレンスの Schedule 説明を参照した。スキルに挙がる旧 `docs-contents-guide.md` は存在しないため、現行の [[specdojo:deliverables-reference|成果物リファレンス]] で役割を確認した。新 profile の追加と guided-pass の挙動変更を CHANGELOG の Unreleased に追記し、公開済みの節は変更していない。

### 変更ファイル

- `src/schedule/strategy-profiles.ts`、`src/schedule/approach.ts`、`docs/specdojo/schemas/v1/sch-strategy.schema.yaml`: profile・human 段・選択用 intent と導出条件を追加。
- `src/exec/plans-planning.ts`: strategy-planning の profile 選択と human の記入・完了手順を追加。
- `src/exec/results.ts`、`docs/ja/specdojo/exec-templates/xer-human-draft-template.md`: human draft の claim result に作業案内を表示。agent draft の result は標準テンプレートを使用。
- `docs/ja/specdojo/exec-templates/xep-draft-template.md`: 文脈なし・未作成時の下書き方針を追記。
- `docs/ja/specdojo/guides/schedule-design-guide.md`、`docs/ja/specdojo/rulebooks/sch-rulebook.md`、`CHANGELOG.md`: profile と変更後の挙動を説明。
- `tests/src/schedule/strategy-generate.test.ts`: intent の導出、型の不足時の停止、profile 生成、execution・mode・approach・依存・gate の順序を検証するテストを追加。
- `tests/src/exec/draft-plan.test.ts`: rulebook / recipe / sample / template のそろった未作成成果物から、文脈なしの guided-pass draft plan を生成する回帰テストを追加。
- `tests/src/register/planning.test.ts`、`tests/src/exec/results.test.ts`: strategy-planning plan と human result の案内、agent とのテンプレート分岐を検証するテストを追加。
- 本個票: 作業内容と対応結果を更新。ステータス項目・登録簿の一覧・result は編集していない。

### 検証と申し送り

- 再開時に前回の親 `typecheck` 失敗を確認し、`tests/src/exec/draft-plan.test.ts` のカタログ参照へ必須の `domain: "test"` を追加した。テスト内で生成するカタログの domain と一致させ、型定義を緩めずに修正した。親検証の再実行結果は runner が確定する。
- 対象ファイルを Prettier で整形した。
- `npm run validate:schema:file -- --schema docs/specdojo/schemas/v1/sch-strategy.schema.yaml --data 'docs/ja/projects/prj-0001/schedule/sch-strategy-*.yaml'` は成功。既存 strategy 4 件との互換性を確認した。
- `node --import tsx tools/catalog-validate-if-configured.mjs` は成功。未作成の既存成果物の `based_on` 検証を省く警告はあるが、検証エラーはない。
- `node --import tsx src/specdojo.ts register build --project prj-0001` は成功。
- `node --import tsx src/specdojo.ts exec refresh --project prj-0001` は成功。現行 schedule に存在しない過去タスクの event 4 件を無視する既存警告がある。
- 再開後も schema 検査・カタログ検査・`register build`・`exec refresh` が成功した。差分の空白検査も行い、Markdown lint を含む親検証とは重複させず、検証結果を executor evidence に記録する。
- 指定された親検証 7 件（lint-ts / lint-fm / lint-md / test-integration / validate-schema / typecheck / test-unit）は、この executor では重複実行せず親 runner に委ねる。追加した単体テストの実行結果も親 runner が確定する。
- 保護された設定の変更は不要。未解決の設計判断はない。既存 strategy に新しい定義を反映する際は `schedule strategy generate --force` の差分を確認し、構造変更時は `schedule build --force`、続いて `exec refresh` を実行する。今回、project の実行中 strategy は再生成していない。
- runner / claim result に関わる変更を含むため、統合後は [[prj-0001:pm-orchestrator-playbook|オーケストレーター運用メモ]] に従い、PJR-JSEY の対象へ追加して動作確認する。result には上記設計判断・検証結果・運用上の申し送りを reporter / runner が転記する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-65ds-deliverable-context-draft-approach]]
- [[specdojo:ryu-guide]]
