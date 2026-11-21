---
specdojo:
  id: prj-0001:pjr-5t0q-kata-domain-commit-scope
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
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

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

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

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
