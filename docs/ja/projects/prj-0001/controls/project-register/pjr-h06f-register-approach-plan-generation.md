---
specdojo:
  id: prj-0001:pjr-h06f-register-approach-plan-generation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-17T12:17:15Z"
  due_on: null
---

# PJR-H06F exec run --register で approach の plan の作り方を使う

## 1. 概要

個票に approach があれば、schedule と同じ plan の作り方（approach のテンプレート、kata の参照、DCT の done_criteria）を使い、個票の完了条件を追加の条件として載せる。kata の id を対象にした保守の approach にも対応する。PJR-H72A の決定に基づく

## 2. 完了条件

[[prj-0001:pjr-h72a-register-approach-execution]] の決定の 3〜6 に基づく 2 件目。[[prj-0001:pjr-zjxq-register-approach-fields]] で個票に書けるようにした `approach` と `targets` を、`exec run --register` の plan の生成に反映する。

2026-10-17 時点の手がかり:

- register の plan は `src/exec/register.ts` の `generateRegisterPlan` が作り、worktree での実行は `src/exec/run/register-worktree.ts` がそれを呼ぶ。
- 成果物の plan は `generateDeliverablePlan`（`exec plan --deliverable --approach` が使う。`src/exec/commands.ts`）が、対象・mode・approach・owner を受け取って作る。approach のテンプレート、kata の参照、DCT の `done_criteria` はここで入る。
- schedule での kata の保守は、成果物に対応する kata を `rulebook-maintenance` などで直す（`src/schedule/strategy-profiles.ts`）。

条件:

- 個票に `approach` がない場合は、従来どおり `generateRegisterPlan` で plan を作り、出力を変えない（既存の register の plan と一致することをテストで確かめる）。
- 個票に成果物を作る・直す approach（`fully-guided` など）があり、`targets` が成果物カタログの成果物を指す場合は、`generateDeliverablePlan` と同じ作り方で plan を作る。approach のテンプレート、kata の参照、DCT の `done_criteria` が plan に入る。
- 上の plan に、個票の完了条件を「追加の条件」として載せる（決定の 4）。DCT の `done_criteria` と個票の完了条件の両方が plan に現れることを確かめる。
- owner の役割は、個票の `owner` を使い、schedule の `owner_rules` を参照しない（決定の 5）。
- 個票に kata を直す approach（`rulebook-maintenance` など）があり、`targets` が kata の doc id を指す場合の plan の作り方を、schedule の kata の保守の plan に合わせて決めて実装する。schedule の作り方が成果物を前提にしていて kata の id だけでは作れない場合は、どう対応したか（成果物カタログから対応する成果物を探す、など）と理由を result に書く。
- plan の frontmatter は register の実行として扱われる形（task id・result のパス・`targets` など）を保ち、worktree・統合・review・登録簿の記帳がこれまでどおり動く。
- `exec plan --register <PJR-ID>` でも、同じ plan を作れる（実行の前に plan を確かめるため）。
- 単体テストで、approach なし・成果物の approach・kata の approach の 3 通りの plan を確かめる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG に記載する場合は、未公開の版の節（`## [0.4.0] - 未定`）に書く。公開済みの版の節は変えない。
- runner のコードを変えるため、統合の後に orchestrator が `exec run --register` を 1 回流し、統合まで終わることを確かめる（本件の close の条件）。

## 3. 作業内容

| No  | 作業                                                    | 担当         | 状態 | メモ                          |
| --- | ------------------------------------------------------- | ------------ | ---- | ----------------------------- |
| 1   | approach の有無で plan の作り方を分ける                 | DEV          | done | approach なしは出力を変えない |
| 2   | 成果物の approach の plan に、個票の完了条件を加える    | DEV          | done | DCT の done_criteria と両方   |
| 3   | kata の approach の plan の作り方を決めて実装する       | DEV          | done | 理由を result に書く          |
| 4   | `exec plan --register` でも同じ plan を作れるようにする | DEV          | done | -                             |
| 5   | 統合の後に `exec run --register` を 1 回流す            | orchestrator | open | close の条件                  |

## 4. 対応結果

- 個票に `approach` がない場合は従来の register plan を生成し、ある場合は schedule と共通の approach テンプレート生成へ分岐するようにした。register 固有の `task_id`・`origin`・`owner`・`targets` は維持する。
- 成果物 target は文書 ID から DCT の成果物を解決し、rulebook / recipe / sample / template と DCT の `done_criteria` を共通生成部から plan へ載せる。個票の「完了条件」は「個票の追加完了条件」として同じ plan へ追加する。
- kata maintenance は個票で指定された kata の文書 ID を直接、対応する種別の編集対象パスへ解決する。DCT でその kata を宣言する成果物が一意なら根拠となる成果物として併記し、宣言がない、または複数成果物で共有される場合は任意の成果物を選ばず kata 単独の plan とする。
- in-place / worktree の result scaffold にも個票の `approach` と `targets` を引き継ぐ。`exec plan --register` と両実行経路は同じ `generateRegisterPlan` を使用する。
- 単体テストへ approach なし・成果物 approach・kata maintenance のケースを追加した。残る作業は、統合後に orchestrator が実際の `exec run --register` を 1 回流す No. 5 の close 条件である。

## 5. 関連ドキュメント

- [[prj-0001:pjr-h72a-register-approach-execution]]: 決定。
- [[prj-0001:pjr-zjxq-register-approach-fields]]: 個票の項目（先に行う）。
- [[prj-0001:pjr-4z6n-register-approach-guide]]: ガイド（後に行う）。
