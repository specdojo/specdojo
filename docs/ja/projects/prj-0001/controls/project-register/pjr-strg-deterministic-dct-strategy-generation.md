---
specdojo:
  id: prj-0001:pjr-strg-deterministic-dct-strategy-generation
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-16T13:17:17Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-20T12:27:51Z"
  conclusion: catalog scaffold --plan と schedule strategy generate を実装し、DCT と sch-strategy を決定論的に生成できるようにした。異常系・再生成安定性を含むテストと、rulebook・設計ガイド・コマンドリファレンスの更新を完了した。
  register_events:
    - v: 1
      id: reg_922be21c0628ec2c277dcc68b91378a2
      ts: "2026-08-16T13:29:53Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs(register): add catalog and strategy automation todos"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: DCTとsch-strategyの決定論的ジェネレーター実装
        - field: description
          from: ""
          to: agent が保存した `dct-plan-<domain>.yaml` と `sch-assessment-<track>.yaml` を入力に、成果物カタログと `sch-strategy-<track>.yaml` をコードで決定論的に生成する。agent の責務は意味判断と根拠整理に限定し、YAML 構造、ID、パス、owner、フェーズ、ゲート、依存関係、schema 適合性は generator が保証する。
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: ARC
        - field: registered
          from: ""
          to: "2026-08-16"
        - field: due
          from: ""
          to: "2026-08-31"
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: 7769f1ba92e4242dc32091f30ef7c3d57fae7dac
    - v: 1
      id: reg_046cb78371bb1509dd3735553ad01899
      ts: "2026-08-18T22:33:57Z"
      action: start
      actor: SpecDojo Test
      from_status: open
      to_status: in-progress
      reason: "exec(register PJR-STRG): start"
      changes:
        - field: status
          from: open
          to: in-progress
      legacy_commit: 5a2d67a3829fd2e5b17c2348a604f87b2cae67fd
      previous_event_id: reg_922be21c0628ec2c277dcc68b91378a2
    - v: 1
      id: reg_868adccb67f34a59778f21a9d54dd5a6
      ts: "2026-08-18T22:47:22Z"
      action: wait
      actor: SpecDojo Test
      from_status: in-progress
      to_status: waiting
      reason: "exec(register PJR-STRG): wait"
      changes:
        - field: status
          from: in-progress
          to: waiting
        - field: conclusion
          from: "-"
          to: "agent exited with non-zero code: agent exited with non-zero code"
      legacy_commit: 9854cb0d0be0834cbcc3c10bb5d10cc7c435871c
      previous_event_id: reg_046cb78371bb1509dd3735553ad01899
    - v: 1
      id: reg_1e98700ce42bb05ba6a9519284ff8eae
      ts: "2026-08-18T23:01:18Z"
      action: start
      actor: SpecDojo Test
      from_status: waiting
      to_status: in-progress
      reason: "exec(register PJR-STRG): start"
      changes:
        - field: status
          from: waiting
          to: in-progress
      legacy_commit: 88f072f93348296443ef95921a319a5b93cf2c70
      previous_event_id: reg_868adccb67f34a59778f21a9d54dd5a6
    - v: 1
      id: reg_aa599972320dd5d477edac3de9d65d49
      ts: "2026-08-18T23:22:37Z"
      action: wait
      actor: SpecDojo Test
      from_status: in-progress
      to_status: waiting
      reason: "exec(register PJR-STRG): wait"
      changes:
        - field: status
          from: in-progress
          to: waiting
        - field: conclusion
          from: "agent exited with non-zero code: agent exited with non-zero code"
          to: rate limit reached
      legacy_commit: 8024c6c3a6e037fdbeebef77790f046243da8f25
      previous_event_id: reg_1e98700ce42bb05ba6a9519284ff8eae
    - v: 1
      id: reg_c3df51172edf4326b9fa1079a4167f0b
      ts: "2026-08-19T22:56:08Z"
      action: review
      actor: SpecDojo Test
      from_status: waiting
      to_status: review
      reason: "exec(register PJR-STRG): review"
      changes:
        - field: status
          from: waiting
          to: review
      legacy_commit: 99ca98dbfbfd67e7820f0a947d6e7043849d4152
      previous_event_id: reg_aa599972320dd5d477edac3de9d65d49
    - v: 1
      id: reg_ebc1b62850e2b9a88207cb9c472e7c4e
      ts: "2026-08-20T12:27:56Z"
      action: close
      actor: SpecDojo Test
      from_status: review
      to_status: done
      reason: "exec(register PJR-STRG): close"
      changes:
        - field: status
          from: review
          to: done
        - field: completed
          from: "-"
          to: "2026-08-20"
        - field: conclusion
          from: rate limit reached
          to: catalog scaffold --plan と schedule strategy generate を実装し、DCT と sch-strategy を決定論的に生成できるようにした。異常系・再生成安定性を含むテストと、rulebook・設計ガイド・コマンドリファレンスの更新を完了した。
      legacy_commit: d2ba8a8c10ce9deec27cafeeece3d8be884eee1e
      previous_event_id: reg_c3df51172edf4326b9fa1079a4167f0b
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

| No  | 作業                                                                                                      | 担当 | 状態 | メモ                                                                          |
| --- | --------------------------------------------------------------------------------------------------------- | ---- | ---- | ----------------------------------------------------------------------------- |
| 1   | 2種類の agent 判定 YAML と generator の入力境界、正準配置、schema versioning を確定する                   | ARC  | done | plan / assessment の既存 schema v1 と正準配置を入力契約として再利用           |
| 2   | DCT plan を既存 scaffold 処理へ適用する決定論的 DCT generator を実装する                                  | ARC  | done | `catalog scaffold --plan` で通常・物理分割 DCT を一括生成                     |
| 3   | `approach` とフェーズ列を組み立てる標準 strategy profile を定義する                                       | ARC  | done | 全 approach の phase・duration・execution・mode・pipeline をコードで一元管理  |
| 4   | DCT、Timeline、assessment、profile から scope・owner・依存・gate を生成する strategy generator を実装する | ARC  | done | `schedule strategy generate` を追加し、既存 `schedule build` は変更せず再利用 |
| 5   | dry-run、差分表示、既存ファイル保護、原子的な書き込み、検証失敗時の無変更を実装する                       | ARC  | done | 候補を全検証後に書き込み、既存差分は `--force` なしで保護                     |
| 6   | 代表 track と異常系 fixture による unit test / integration test を追加する                                | ARC  | done | 混在 profile、物理分割、owner 未解決、facts 改変、競合、再生成安定性を検証    |
| 7   | CLI、schema、設計ガイド、rulebook、操作手順を更新する                                                     | ARC  | done | 判定から `schedule build` / `exec refresh` までの実行順序を反映               |

## 4. 対応結果

- `catalog scaffold --plan` を追加し、`dct-plan-<domain>.yaml` と同一 domain の全 DCT template から、通常 DCT または物理分割 DCT を決定論的に生成できるようにした。template 展開は既存 scaffold の `min_size`、placeholder、`part_of`、group、base path 処理を共用する。
- DCT 生成は blocking な未確定事項、未解決 placeholder、未判定 template entry、重複 `local_id`、未解決 `depends_on`、schema 違反で停止する。domain 内の全候補を検証してから一時領域経由で書き込み、既存ファイル競合時は分割ファイルを含めて一件も変更しない。
- 標準 strategy profile をコードで一元化し、`bootstrap`、`retrofit`、`fully-guided`、`recipe-guided`、`freeform`、4種の maintenance、`cross-deliverable-dedup`、`finalize`、`bootstrap-finalize` を固定の phase ID・suffix・duration・execution・mode・pipeline へ写像した。
- `schedule strategy generate` を追加した。既存 strategy の scope を優先し、新規 track は Timeline の domains から物理分割を含む DCT を解決する。assessment の schema・facts・全 work 成果物の網羅性を再検証し、成果物別 profile、owner rules、bootstrap 順序、phase gate、横断 pass、milestone を生成する。
- owner は明示 override、既存 strategy、default owner の順で解決し、`pm-roles.yaml` に照合する。DCT の `done_criteria.roles` はレビュー観点として主担当導出に使用せず、未解決時は具体的なエラーで停止する。
- strategy 候補は schema 検証と `schedule build --dry-run` 相当の展開を実施し、project ID、参照、全 strategy の milestone ID を検証してから書き込む。既存 strategy は差分を表示し、`--force` なしでは上書きしない。同一内容は `Unchanged` とする。
- unit / CLI integration test を追加し、DCT の通常・物理分割生成、未確定 plan、既存競合、再生成安定性、混在 approach、bootstrap 順序、横断 pass、owner 未解決、assessment facts 改変、strategy 競合を検証した。
- CLI リファレンス、Timeline / Schedule / Quick Start ガイド、DCT / Schedule rulebook を新しい生成順序へ更新し、plan / assessment schema の一括検証 script を追加した。generator は Timeline の `catalog_status` を変更せず、生成物の `status` も人間の確認なしに昇格させない。

## 5. 関連ドキュメント

- [[specdojo:timeline-design-guide|Timeline設計ガイド]]
- [[specdojo:dct-rulebook|成果物カタログ（ドメイン別）作成ルール]]
- [[specdojo:schedule-design-guide|Schedule設計ガイド]]
- [[specdojo:sch-rulebook|スケジュール作成ルール]]
- [[specdojo:ryu-guide|実践の進め方ガイド]]
- 前提: [[prj-0001:pjr-dctg-data-flow-dct-instance-analysis|data-flow等からDCT成果物インスタンスを判定するagentの実装]]
- 前提: [[prj-0001:pjr-kata-artifact-kata-readiness-assessment|成果物・Kataの利用可能性と推奨フローを判定するagentの実装]]
