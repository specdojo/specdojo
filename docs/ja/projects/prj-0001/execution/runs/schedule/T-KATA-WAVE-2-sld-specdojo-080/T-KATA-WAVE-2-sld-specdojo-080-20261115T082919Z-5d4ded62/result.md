---
specdojo:
  id: prj-0001:xer-t-kata-wave-2-sld-specdojo-080-20261115t082919z-5d4ded62
  type: exec-result
  task_id: T-KATA-WAVE-2-sld-specdojo-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-2-sld-specdojo-080/T-KATA-WAVE-2-sld-specdojo-080-20261115T082919Z-5d4ded62/plan.md
  started_at: "2026-11-15T08:29:21.519Z"
  completed_at: "2026-11-15T08:55:16.533Z"
  agent: flash-executor
  execution: agent
  approach: condense
  targets:
    - sld-specdojo
  condense_records:
    - location: '## 2. 保管場所一覧 > ### 2.1. リポジトリ内の保管場所 表1行目「共有の有無」列'
      category: repetition
      action: delete
      reason: '### 1.1. 対象範囲と隣接仕様との分担 で既に2リポジトリ構成と単一リポジトリ構成の共通論理パス表記が定義されており、表セル内での再掲「（2リポジトリ構成では product と project に分担して追跡）」は不要なため削除。'
      cause:
        type: document
    - location: '## 2. 保管場所一覧 > ### 2.1. リポジトリ内の保管場所 表4行目「置くもの」「寿命・管理頻度」列'
      category: repetition
      action: merge
      reason: 同一セル内および列間で「同一 run 内への退避」の説明が重複していたため、「置くもの」はファイル種別（再試行退避ファイル）とし、「寿命・管理頻度」は保持期間と退避運用（恒久保持・再試行時は同一 run 内に退避）に集約して整理。
      cause:
        type: document
    - location: '## 2. 保管場所一覧 > ### 2.2. 端末ローカル・リポジトリ外の保管場所 直後の「補足（旧配置との互換性）:」'
      category: table-prose
      action: merge
      reason: 第2章表および第4章表と重複する実装モジュール名や移行ロジックの散文記述を削り、運用判断に必要な旧配置の削除可否（旧実行記録は削除不可、旧定期処理状態は移行後に整理可）に要約・整理。
      cause:
        type: document
    - location: '## 4. 関連仕様・実装配置との対応と検証 > ### 4.1. 概念データストア・実装配置との対応 表「配置・共有を制御する実装・設定の正本」列'
      category: canonical-restatement
      action: reference
      reason: rulebook 1章・5.3節および本書1.1節が定める「コード内部構造の再掲は行わない」方針に従い、内部関数名や個別除外パターンの転記をモジュール・設定ファイルへの参照表記に集約。
      cause:
        type: kata
        kind: rulebook
        location: docs/ja/specdojo/rulebooks/sld-rulebook.md §1.25, §5.3.131
    - location: '## 3. 削除・退避・復旧の判断基準 > ### 3.1. 削除可否の3区分と運用者の判断基準 表'
      category: repetition
      action: retain
      reason: 第2章一覧表の削除可否列と対象・理由が一部重なるが、運用者（OPS/DEV）が日常運用や障害復旧時に3区分で横断判断するための必須基準であり保持。
      cause:
        type: kata
        kind: rulebook
        location: docs/ja/specdojo/rulebooks/sld-rulebook.md §5.2.122-126
    - location: '## 4. 関連仕様・実装配置との対応と検証 > ### 4.2. 検証手順と受入条件 表'
      category: repetition
      action: retain
      reason: 第1章概要のロール責務と対応しているが、合格条件・確認手順を具体化した受入検証の完了条件であり保持。
      cause:
        type: kata
        kind: rulebook
        location: docs/ja/specdojo/rulebooks/sld-rulebook.md §5.3.132-136
    - location: '## 5. 確認事項と変更影響 表'
      category: repetition
      action: retain
      reason: 上位 CDSD の未決事項および第4章4.1表の追加候補データストアと一部重複するが、判断時期・担当・追跡先 PJR を特定する必須管理情報のため保持。
      cause:
        type: kata
        kind: rulebook
        location: docs/ja/specdojo/rulebooks/sld-rulebook.md §5.4.140-141
---

# Condense Result

## 1. 実施内容

- 対象文書 `docs/ja/product/010-business-specs/020-data-model/sld-specdojo.md` の冗長さを整理しました。
- 具体的には、リポジトリ構成に関する重複記述の削除、退避運用説明の集約、旧配置互換性に関する散文の要約、および実装コード内部構造の再掲を正本への参照に置き換える修正を行いました。
- 一方で、運用判断基準や検証完了条件など、必須情報として維持すべき箇所は `retain` として保持しています。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/020-data-model/sld-specdojo.md`: 文書内の重複記述の削除、表と本文の二重説明の集約、および具体名による再掲を正本参照への置き換えによる冗長さの整理を実施しました。

## 3. 申し送り

- 適用外の検証: `npm run validate:schema:file`（no changed `*.yaml` or `*.yml` files）
- 適用外の検証: `npm run validate:history-links`（no changed history files）
- 適用外の検証: `npm run validate:catalog`（changes outside docs/ja/projects/）

## 4. 進め方と実践の型の適用

condense

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `## 2. 保管場所一覧 > ### 2.1. リポジトリ内の保管場所 表1行目「共有の有無」列` | `repetition` | `delete` | `### 1.1. 対象範囲と隣接仕様との分担 で既に2リポジトリ構成と単一リポジトリ構成の共通論理パス表記が定義されており、表セル内での再掲「（2リポジトリ構成では product と project に分担して追跡）」は不要なため削除。` | `document` |
| `## 2. 保管場所一覧 > ### 2.1. リポジトリ内の保管場所 表4行目「置くもの」「寿命・管理頻度」列` | `repetition` | `merge` | `同一セル内および列間で「同一 run 内への退避」の説明が重複していたため、「置くもの」はファイル種別（再試行退避ファイル）とし、「寿命・管理頻度」は保持期間と退避運用（恒久保持・再試行時は同一 run 内に退避）に集約して整理。` | `document` |
| `## 2. 保管場所一覧 > ### 2.2. 端末ローカル・リポジトリ外の保管場所 直後の「補足（旧配置との互換性）:」` | `table-prose` | `merge` | `第2章表および第4章表と重複する実装モジュール名や移行ロジックの散文記述を削り、運用判断に必要な旧配置の削除可否（旧実行記録は削除不可、旧定期処理状態は移行後に整理可）に要約・整理。` | `document` |
| `## 4. 関連仕様・実装配置との対応と検証 > ### 4.1. 概念データストア・実装配置との対応 表「配置・共有を制御する実装・設定の正本」列` | `canonical-restatement` | `reference` | `rulebook 1章・5.3節および本書1.1節が定める「コード内部構造の再掲は行わない」方針に従い、内部関数名や個別除外パターンの転記をモジュール・設定ファイルへの参照表記に集約。` | `kata:rulebook; location=docs/ja/specdojo/rulebooks/sld-rulebook.md §1.25, §5.3.131` |
| `## 3. 削除・退避・復旧の判断基準 > ### 3.1. 削除可否の3区分と運用者の判断基準 表` | `repetition` | `retain` | `第2章一覧表の削除可否列と対象・理由が一部重なるが、運用者（OPS/DEV）が日常運用や障害復旧時に3区分で横断判断するための必須基準であり保持。` | `kata:rulebook; location=docs/ja/specdojo/rulebooks/sld-rulebook.md §5.2.122-126` |
| `## 4. 関連仕様・実装配置との対応と検証 > ### 4.2. 検証手順と受入条件 表` | `repetition` | `retain` | `第1章概要のロール責務と対応しているが、合格条件・確認手順を具体化した受入検証の完了条件であり保持。` | `kata:rulebook; location=docs/ja/specdojo/rulebooks/sld-rulebook.md §5.3.132-136` |
| `## 5. 確認事項と変更影響 表` | `repetition` | `retain` | `上位 CDSD の未決事項および第4章4.1表の追加候補データストアと一部重複するが、判断時期・担当・追跡先 PJR を特定する必須管理情報のため保持。` | `kata:rulebook; location=docs/ja/specdojo/rulebooks/sld-rulebook.md §5.4.140-141` |
