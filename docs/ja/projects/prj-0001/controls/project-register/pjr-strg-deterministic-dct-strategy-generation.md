---
specdojo:
  id: prj-0001:pjr-strg-deterministic-dct-strategy-generation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: ARC
  registered_at: "2026-08-16T13:17:17Z"
  due_on: "2026-08-31"
---

# PJR-STRG DCTとsch-strategyの決定論的ジェネレーター実装

## 1. 概要

agent が保存した `dct-plan-<domain>.yaml` と `sch-assessment-<track>.yaml` を入力に、成果物カタログと `sch-strategy-<track>.yaml` をコードで決定論的に生成する。agent の責務は意味判断と根拠整理に限定し、YAML 構造、ID、パス、owner、フェーズ、ゲート、依存関係、schema 適合性は generator が保証する。

実装は二段階とする。第1段階では DCT plan と既存 DCT template から `dct-<domain>.yaml` を生成する。第2段階では完成した DCT、Timeline、`sch-assessment`、標準 strategy profile から `sch-strategy-<track>.yaml` を生成する。その後は既存の `schedule build` と `exec refresh` を変更せず利用できるようにする。

## 2. 完了条件

- `dct-plan-<domain>.yaml` と既存 DCT template から project 用 `dct-<domain>.yaml` または物理分割された `dct-<domain>-<part>.yaml` を生成できる。
- DCT 生成は `catalog scaffold` の `min_size`、placeholder 展開、`part_of`、domain、base path、物理分割の既存規則を再利用し、別の展開実装を重複して持たない。
- DCT plan に未確定事項、根拠のない必須 placeholder、重複 local ID、存在しない依存先がある場合は部分的な出力を書き込まず、具体的なエラーで停止する。
- 標準 strategy profile が定義され、少なくとも初期整備、4種 Kata 活用、recipe 主導、freeform、実装先行のフローを表現できる。profile はコードまたは schema 検証可能な設定として一元管理する。
- DCT、Timeline、`sch-assessment-<track>.yaml`、標準 profile から、次を含む schema 適合済み `sch-strategy-<track>.yaml` を生成できる。
  - `scope.catalogs` と `include_kinds: [work]`
  - `phase_sets` と `default_phase_sets`
  - DCT の全 `kind: work` を網羅する `owner_rules`
  - local ID ごとの profile / phase set 選択
  - duration、execution、mode、approach
  - phase gate と finalize / bootstrap-finalize
  - DCT と Timeline から解決可能な依存関係
  - 必要と判定された場合の `cross_deliverable_passes`
- owner の導出規則が明文化され、DCT `done_criteria.roles` のレビューロールを `owner_rules` へ誤って複製しない。主担当を決定できない場合は推測せず停止する。
- `bootstrap` 対象とそれ以外を同一 track 内で `deliverable_rules` 等により分けられ、代表成果物だけを bootstrap した後に他成果物を `retrofit` / `fully-guided` へ進める構成を生成できる。
- `schedule build --dry-run` 相当の事前検証を行い、全 strategy の project ID、milestone ID、参照、schema に問題がある場合は既存ファイルを上書きしない。
- 同じ入力から byte 単位または正規化 YAML 単位で同じ出力を生成し、再実行時の不要な差分を発生させない。
- 既存ファイルは既定で保護し、差分表示と明示的な `--force` 相当の操作なしに上書きしない。
- DCT 生成、strategy 生成、混在 approach、物理分割 DCT、owner 未解決、未確定 plan、不正 assessment、既存ファイル競合、再生成安定性を含む unit test / integration test が追加されている。
- Timeline の `catalog_status` は生成完了だけで自動的に `primary` へ昇格させず、draft 生成後の確認と状態更新手順を維持する。
- コマンドリファレンス、Timeline設計ガイド、成果物カタログとScheduleの設計ガイド、関連 rulebook・schema が実装と一致するよう更新されている。
- `npm run typecheck`、変更対象に対応する test、`npm run lint:md`、`npm run validate:schema:sch-strategy`、`npm run validate:catalog` が成功する。

## 3. 作業内容

| No  | 作業                                                                                                      | 担当 | 状態 | メモ                                                                              |
| --- | --------------------------------------------------------------------------------------------------------- | ---- | ---- | --------------------------------------------------------------------------------- |
| 1   | 2種類の agent 判定 YAML と generator の入力境界、正準配置、schema versioning を確定する                   | ARC  | open | PJR-DCTG と PJR-KATA の成果を前提とする                                           |
| 2   | DCT plan を既存 scaffold 処理へ適用する決定論的 DCT generator を実装する                                  | ARC  | open | この段階の完了後に生成 DCT を PJR-KATA の入力として利用できる                     |
| 3   | `approach` とフェーズ列を組み立てる標準 strategy profile を定義する                                       | ARC  | open | task目的と整備状況を分離し、`freeform`、`retrofit`、finalize 系も扱う             |
| 4   | DCT、Timeline、assessment、profile から scope・owner・依存・gate を生成する strategy generator を実装する | ARC  | open | `sch-track` は生成せず、既存 `schedule build` に委ねる                            |
| 5   | dry-run、差分表示、既存ファイル保護、原子的な書き込み、検証失敗時の無変更を実装する                       | ARC  | open | DCT と strategy の片方だけが不完全な状態で書き込まれないようにする                |
| 6   | 代表 track と異常系 fixture による unit test / integration test を追加する                                | ARC  | open | launch と data-flow の既存 strategy を回帰 fixture または期待仕様の参考にする     |
| 7   | CLI、schema、設計ガイド、rulebook、操作手順を更新する                                                     | ARC  | open | `agent判定 → review → generator → schedule build → exec refresh` の順序を記載する |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[specdojo:timeline-design-guide|Timeline設計ガイド]]
- [[specdojo:dct-rulebook|成果物カタログ（ドメイン別）作成ルール]]
- [[specdojo:schedule-design-guide|Schedule設計ガイド]]
- [[specdojo:sch-rulebook|スケジュール作成ルール]]
- [[specdojo:ryu-guide|実践の進め方ガイド]]
- 前提: [[prj-0001:pjr-dctg-data-flow-dct-instance-analysis|data-flow等からDCT成果物インスタンスを判定するagentの実装]]
- 前提: [[prj-0001:pjr-kata-artifact-kata-readiness-assessment|成果物・Kataの利用可能性と推奨フローを判定するagentの実装]]
