---
specdojo:
  id: prj-0001:pjr-5t0q-kata-domain-commit-scope
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-21T09:10:13Z"
  derived_from:
    - PJR-6998
---

# PJR-5T0Q kata ドメインの成果物（sample）の変更が、成果物向けの段で commit の対象外として止まる

## 1. 課題内容

kata ドメインに載せた sample を condense などの成果物向けの段で直すと、target の specdojo:`<name>-sample` が commit してよいファイルに読み替えられず、統合の段で non-target changes として止まる

## 2. 入力

- 2026-11-21、第 3 波の試しで T-KATA-WAVE-3-tsp-index-sample-080（condense）が、commit-scope: integration blocked; 1 non-target changes: docs/ja/specdojo/samples/tsp-index-sample.md で止まった（worktree は残してある）。040（rulebook-maintenance）と 050（sample-maintenance）は統合まで通った
- plan の targets は specdojo:tsp-index-sample。src/exec/worktree-ops-commit.ts は targets を doc-index で引き、引けなければ prj-0001: で始まる ID だけを `local_id` にしてカタログで引くため、specdojo: の ID はどちらでも引けない。050 は sample-maintenance の approach が docs/ja/specdojo/samples/ を参考資料のディレクトリとして許すため通った（orchestrator の見立て、executor が確かめる）
- 第 3 波の 11 種類の 040 は、各 index が tsp-index の 080、対象別が各 index の 080 に依存するため、この件が直るまで流れない。第 4〜6 波も kata ドメインを使う（PJR-6998）

## 3. 影響範囲

| 観点         | 影響                                                                                               |
| ------------ | -------------------------------------------------------------------------------------------------- |
| スコープ     | exec の commit 許可リスト（`src/exec/worktree-ops-commit.ts`・`src/exec/plans-core.ts`）だけを直す |
| スケジュール | 第 3〜6 波の kata ドメインの成果物向けの段が、この件の統合まで流れない                             |
| コスト       | 小さい（照合の関数 1 つと単体・統合テスト）                                                        |
| 品質         | カタログに無い型の文書を成果物向けの段で直したときの守りは変えない                                 |
| 関係者       | DEV・orchestrator                                                                                  |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                       |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | commit してよいファイルへの target の読み替えが、`prj-0001:` 以外の名前空間の ID（kata ドメインの sample の `specdojo:<name>-sample`）をカタログで引けない |
| 対応策   | target がカタログの成果物（kata ドメインを含む）の文書の ID と一致する場合は、その成果物の `path` を commit してよいファイルに入れる                       |
| 依存事項 | なし                                                                                                                                                       |
| 完了条件 | 下記の条件をすべて満たすこと                                                                                                                               |

完了条件の内訳。

- 成果物向けの段（condense・fully-guided・refine など）の plan の `targets` が、カタログの成果物の文書の ID（例: `specdojo:tsp-index-sample`、成果物の `path` は `docs/ja/specdojo/samples/tsp-index-sample.md`）であれば、その `path` を commit してよいファイルに入れる。原因の見立てが違う場合は、executor が本当の原因を確かめて直し、対応結果に書く。
- カタログに載っていない `specdojo:` の文書（型の文書）を成果物向けの段で変えたときは、今までどおり対象外として止める。成果物向けの段で型の文書を勝手に直させない今の守りは変えない。
- 単体テストか統合テストで、kata ドメインの成果物の condense の段の変更が commit の対象に入ることと、カタログに無い型の文書の変更は対象外のままになることを確かめる。
- 統合のあと、orchestrator が止まっている T-KATA-WAVE-3-tsp-index-sample-080 を流し直し、統合まで通ることを確かめてから close する。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` が通り、親の検証が通る。

## 5. 対応結果

原因の確認。

- 見立てどおり、`specdojo:tsp-index-sample` はカタログの `local_id`（`tsp-index-sample`）とも一致せず、`deliverableDocPath` で引けない。
- HEAD の doc-index の引き当ても効いていない。`.specdojo/doc-index.json` は tracking から外れており（`.gitignore`）、`git show HEAD:.specdojo/doc-index.json` が常に失敗する。prj-0001 の ID はカタログで引き直すため影響が見えていなかった。
- 050 が通った理由も見立てどおり。`targetReferenceDirsForApproach("sample-maintenance")` は `docs/ja/specdojo/samples` を返し、`condense` は空を返す。

対応内容。

- `src/exec/plans-core.ts` に `deliverableDocPathByDocId` を足した。カタログの成果物を走査し、文書の frontmatter の id が target と 1 件だけ一致するとき、その `path` を返す。0 件・複数件では `undefined` を返す。
- `src/exec/worktree-ops-commit.ts` の `resolveCommitScope` で、doc-index とカタログの `local_id` で引けず、`<project_id>:` 以外の名前空間で修飾された target のときに限り、この関数で引く。文書の id は worktree の HEAD（checkpoint 済みの版）から読む。
- カタログに無い型の文書（例: `specdojo:tsp-index-rulebook`）は今までどおり unresolved のまま残り、non-target changes として止まる。
- テストを足した。単体テストは `tests/src/exec/plans.test.ts` の `deliverableDocPathByDocId`、統合テストは `tests/src/exec/worktree-ops.integration.test.ts` の「kata domain deliverable targets (PJR-5T0Q)」。condense の段で kata の sample が commit の対象に入ること、カタログに無い rulebook は止まることを確かめる。統合テストのこの 2 件は手元で通った。
- 実リポジトリのカタログでは、`specdojo:tsp-index-sample` が `docs/ja/specdojo/samples/tsp-index-sample.md` に、`specdojo:tsp-index-rulebook` が `undefined` になることを確かめた。

判断した点。

- 文書の id は working tree ではなく HEAD から読む。agent が別の文書の frontmatter の id を書き換えて target に見せかけ、commit の範囲を広げるのを防ぐため。
- 照合は名前空間の違う ID だけにかける。prj-0001 の ID は今の引き方で足りており、カタログの全文書を読む負荷を増やさないため。
- 一致が複数件のときは解決しない（止める側に倒す）。どの文書に許可を出すか決められないため。
- 効いていない HEAD の doc-index の引き当ては、この件の範囲外として残した。改善は別の登録簿の項目で扱う。

再発防止策。単体・統合テストで、名前空間の違う成果物の ID の解決と、型の文書への守りを固定した。

残り。統合のあと、orchestrator が T-KATA-WAVE-3-tsp-index-sample-080 を流し直し、統合まで通ることを確かめてから close する。

### 5.1. CHANGELOG に書く事項

- 区分: Fixed
- 文案: `exec` の commit 許可リストが、kata ドメインなど `<project_id>:` 以外の名前空間で修飾された成果物の target（例: `specdojo:tsp-index-sample`）をカタログの文書の id で引けず、condense などの成果物向けの段で統合が non-target changes として止まる問題を修正（PJR-5T0Q）。

## 6. 関連ドキュメント

- [[prj-0001:dct-kata]]: kata ドメインの成果物カタログ
