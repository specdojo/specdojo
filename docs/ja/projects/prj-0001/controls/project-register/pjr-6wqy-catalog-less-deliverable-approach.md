---
specdojo:
  id: prj-0001:pjr-6wqy-catalog-less-deliverable-approach
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-10-25T05:11:58Z"
  due_on: "2026-10-31"
  completed_at: "2026-10-25T21:30:18Z"
  conclusion: カタログなしの7種の成果物approachについて、起票・対象解決・plan生成を実装した。
---

# PJR-6WQY 成果物カタログがなくても fully-guided などで成果物を作れるようにする

## 1. 概要

カタログのない project でも、作るファイルの置き場所と rulebook を個票に指定するか、既存の文書の frontmatter から辿ることで、fully-guided・recipe-guided・freeform・retrofit・bootstrap・finalize・bootstrap-finalize の plan を作れるようにする

- 起きたこと: 利用者の project（coderdojo-lessons-specdojo の prj-0001）で、カタログのないまま `fully-guided` の todo を dry-run すると、`Approach "fully-guided" requires a deliverable target, but catalog_path is not configured for project prj-0001` で止まった（2026-10-25）。
- 今の決まり: [[prj-0001:pjr-zjxq-register-approach-fields|PJR-ZJXQ]] で、成果物を作る・直す approach の対象はカタログで解決すると決めた。まだ文書のない成果物も対象にするためである。plan はカタログの成果物の項目から、作るファイルの置き場所、名前・概要・依存先、種類と rulebook、`done_criteria` を読む（`src/exec/plans-generation.ts`）。`finalize`・`bootstrap-finalize` の人の plan は、`done_criteria` のチェック表と確定対象の一覧を作る。
- カタログなしで使えるのは、kata を作る `*-authoring` だけである（[[prj-0001:pjr-zv60-kata-authoring-sources|PJR-ZV60]]）。
- 手がかり: 成果物の frontmatter には `specdojo.rulebook` が、rulebook の frontmatter には `recipe`・`sample`・`template` がある。作るファイルの置き場所と rulebook が分かれば、カタログがなくても kata を辿れる。

## 2. 完了条件

- 対象の approach は `fully-guided`・`recipe-guided`・`freeform`・`retrofit`・`bootstrap`・`finalize`・`bootstrap-finalize` とする。`cross-deliverable-dedup` は、カタログの成果物のまとまりを対象にするため、これまでどおりカタログを必要とし、そのことを文書に書く。
- カタログのない project で、対象の approach の個票を `register add` で起票し、`exec plan --register` で plan を作れる。
  - 対象がすでにある文書の場合は、id の索引で文書を見つけ、置き場所と、frontmatter の `specdojo.rulebook` を使う。
  - 対象がまだない文書の場合は、作るファイルの置き場所（リポジトリからの相対パス）と rulebook の id を、`register add`・`register update` のオプションで個票に記録する。オプションと frontmatter の項目の名前は executor が決め、理由を個票の対応結果と報告の `handoff` に書く。
  - 既存の文書の frontmatter と個票の指定が食い違う場合の扱いを決め、個票の対応結果と報告の `handoff` に書く。
- recipe・sample・template は、rulebook の frontmatter から辿る。`not-needed` のものは plan に載せない。
- approach が求める kata がそろわない場合（`fully-guided` で sample がない、`recipe-guided` で recipe がない、など）は、起票の時点で、足りない kata の名前を挙げて止める。`bootstrap` は kata を作る approach のため、kata が足りなくても止めない。
- `bootstrap`:
  - 作るファイルの置き場所と、新しく作る rulebook の id を個票で指定する。既にある rulebook を指定した場合の扱いを決め、個票の対応結果と報告の `handoff` に書く。
  - plan には、まだない kata を「未作成」の状態で載せる。作る kata の置き場所は `docs/ja/specdojo/<kind>s/<kata_authority>/` とし、`kata_authority` がない場合は起票の時点で止める。
  - recipe・sample・template の id の付け方は executor が決め、理由を個票の対応結果と報告の `handoff` に書く。
  - 作った rulebook の id を、成果物の frontmatter の `specdojo.rulebook` に書くよう plan で指示する。
- `finalize`・`bootstrap-finalize`:
  - 対象は既にある文書に限る。まだない文書を対象にした場合は、起票の時点で止める。
  - チェック表は、個票の完了条件から作る。
  - 確定対象は、`finalize` では成果物、`bootstrap-finalize` では成果物と、frontmatter の `specdojo.rulebook` と rulebook の frontmatter から辿った kata 一式とする。
- カタログのない plan の完了条件は、個票の完了条件と rulebook とする。plan に、カタログの `done_criteria` がないことを書く。
- カタログのある project では、これまでどおりの動きを変えない。カタログを設定していて対象がカタログにない場合は、置き場所と rulebook の明示の指定があるときだけ、カタログなしと同じ解決を使う。指定がないときは、今のエラーで止める。
- 作るファイルの置き場所は、リポジトリの外を指さないことと、既存の別の文書と重ならないことを確かめる。
- [[specdojo:quick-start-guide]]、[[specdojo:command-reference]]、approach を説明する文書に、カタログなしで使う手順と、カタログを必要とする approach を書く。
- 単体テストで、既存の文書の対象、まだない文書の対象、kata が足りない場合、カタログのある project の互換、置き場所の検証を確かめる。`bootstrap`（`kata_authority` がない場合を含む）・`finalize`・`bootstrap-finalize` の plan も確かめる。統合テストで、カタログのない一時リポジトリで `register add` から `exec plan --register` までが通ることを確かめる。
- plan の生成を変えるため、統合の後に `exec run --register` を 1 回流して動作を確かめる（PJR-JSEY）。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [Unreleased]` の節に書く（なければ作る）。

## 3. 作業内容

| No  | 作業                                                         | 担当 | 状態 | メモ                                             |
| --- | ------------------------------------------------------------ | ---- | ---- | ------------------------------------------------ |
| 1   | 置き場所と rulebook を個票に記録するオプションと項目を決める | DEV  | done | 名前と理由を対応結果に記載                       |
| 2   | 起票の検証と plan の生成を、カタログなしの解決に対応させる   | DEV  | done | カタログ優先を維持し、明示指定時だけ補完         |
| 3   | 文書と test を足す                                           | DEV  | done | 7 種の起票から plan 生成と指定の更新・削除を確認 |

## 4. 対応結果

- `register add`・`register update` に `--target-path` と `--target-rulebook` を追加し、個票の `target_path` と `target_rulebook` に保存する。対象 ID は既存の `targets` を維持し、`target_` 接頭辞で対象成果物の指定であることを示した。個票自身の規約を表す `specdojo.rulebook` と混同しない名前にした。更新・削除は監査イベントにも記録する。
- 既存文書は生成済み索引の鮮度に依存せず ID 索引を収集し、配置と frontmatter の `specdojo.rulebook` を使う。個票の明示パス・rulebook が既存文書と違う場合は拒否する。別文書の上書きや共有 rulebook の意図しない切り替えを防ぐためであり、自動でどちらかに上書きしない。新規文書はパスと rulebook の両方を必須とする。
- カタログに対象がある場合は従来の宣言を優先し、kata 不足の新しい検証も適用しない。対象がカタログ外の場合はパスと rulebook を両方明示したときだけカタログなしの解決を使う。指定がない場合の従来エラーと、`cross-deliverable-dedup` のカタログ必須は維持した。
- recipe・sample・template は rulebook frontmatter から辿り、`not-needed` は plan の参照一覧から除外する。`fully-guided` の必要な一式、`recipe-guided` の recipe などの不足を起票・更新時に名前付きで拒否する。パスは相対指定、リポジトリ内への閉包、シンボリックリンク経由の逸脱、既存ファイルの ID 衝突を検証する。
- カタログなしの `bootstrap` は明示パス、新規 rulebook ID、設定の `kata_authority` を必須とする。既存 rulebook は拒否する。既存の共有規約を bootstrap が書き換えることを防ぎ、通常改訂と区別するためである。`<authority>:<stem>-rulebook` から同じ名前部分の `-recipe`・`-sample`・`-template` を導出する。ID と配置を再生成時にも一定に保つための命名であり、`docs/ja/specdojo/<kind>s/<authority>/<stem>-<kind>.md` の未作成候補を plan に示す。既存 ID・パスの衝突は拒否し、成果物への `specdojo.id` と `specdojo.rulebook`、rulebook への kata 参照の記入を指示する。
- カタログなしの `finalize`・`bootstrap-finalize` は既存文書だけを受け付け、個票の完了条件から確認チェック表を作る。確定対象は前者が成果物、後者が成果物と frontmatter から辿った kata 一式であり、複数 sample も列挙する。カタログなしの完了基準は個票の完了条件と rulebook と明記し、`retrofit` の調査入力となる実装パスは個票に明記する運用とした。
- [[specdojo:quick-start-guide]]、[[specdojo:command-reference]]、[[specdojo:ryu-guide]]、[[specdojo:plan-result-lifecycle-guide]] と登録簿の rulebook、CHANGELOG の Unreleased を更新した。`upsert-rulebook` の差分更新手順に従い、記述標準、類似の project overview・pm members の rulebook、成果物リファレンスを確認した。スキルの参照する `docs-contents-guide.md` は存在せず、現行の成果物リファレンスで目的を確認した。登録簿の sample は `not-needed` 宣言のため対象外。
- 変更に対する単体テスト 253 件、7 種の approach の起票から plan 生成までと明示指定の更新・削除の CLI 統合テスト 8 件、変更ファイルの ESLint・Prettier・Markdown 検査、追加フィールドの schema 検証、カタログ検証を実施した。カタログ検証は成功し、未作成成果物などへの警告のみ。ESLint はエラーなしで、既存の大きな CLI 関数に関する行数警告 4 件。登録簿の派生ビュー生成と `git diff --check` も成功。`lint-ts`・`lint-fm`・`lint-md`・`typecheck`・`test-unit`・`test-integration`・`validate-schema` の全体検証は指定どおり親 runner が実施する。
- 統合後の実 agent による `exec run --register` は sandbox 内で実施できないため、orchestrator が PJR-JSEY で確認する。保護設定の変更案、実装上の未決事項はない。result は後続 reporter が記入する。

### 変更ファイル

- `src/register/deliverable-target.ts`: カタログなしの解決、kata の検証、bootstrap の配置を追加。
- `src/catalog/document-target.ts`、`src/exec/plans-core.ts`: 成果物 ID とカタログの解決を、register と exec の両方から使える catalog モジュールへ移動。従来の再帰走査と plan の除外を維持。
- `src/register/approach.ts`、`src/register/create-commands.ts`: 起票・更新のオプションと事前検証を追加。
- `src/register/item.ts`、`src/register/command-types.ts`、`src/register/core.ts`、`src/register/events.ts`: 個票の読み書きと監査イベントに対象パス・rulebook を反映。
- `src/exec/register.ts`、`src/exec/plans-generation.ts`: kata の参照と未作成状態、個票の完了基準、確定チェック表と対象を plan へ展開。
- `docs/specdojo/schemas/v1/register-item-frontmatter.schema.yaml`、`docs/specdojo/schemas/v1/register-events.schema.yaml`: 対象指定と履歴のフィールドを追加。
- `tests/src/register/catalogless-target.test.ts`、`tests/src/exec/catalogless-register.integration.test.ts`: 既存・新規文書、同梱 kata・YAML 文書、入力拒否、互換性と 7 種の CLI 経路を検証。
- `docs/ja/specdojo/guides/quick-start-guide.md`、`docs/ja/specdojo/guides/ryu-guide.md`、`docs/ja/specdojo/guides/plan-result-lifecycle-guide.md`、`docs/ja/specdojo/references/command-reference.md`、`docs/ja/specdojo/rulebooks/pjr-rulebook.md`: 起票・更新・plan の生成手順と制約を更新。
- `CHANGELOG.md` と本個票: 利用者向け変更と実施結果を記録。

## 5. 関連ドキュメント

- [[prj-0001:pjr-zjxq-register-approach-fields]]：成果物の approach の対象をカタログで解決すると決めた項目
- [[prj-0001:pjr-zv60-kata-authoring-sources]]：kata を作る approach をカタログなしで使えるようにした項目
- 報告元: 利用者の project（coderdojo-lessons-specdojo の prj-0001）
