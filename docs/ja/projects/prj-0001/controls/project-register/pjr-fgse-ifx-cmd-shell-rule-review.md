---
specdojo:
  id: prj-0001:pjr-fgse-ifx-cmd-shell-rule-review
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: low
  difficulty: medium
  owner: sol-executor
  registered_at: "2026-11-09T03:21:10Z"
  derived_from:
    - PJR-2GD6
  autopilot: approved
---

# PJR-FGSE ifx-cmd の型の shell: false の決まりに、雛形で外部の CLI を起動する場合の扱いを足すか見直す

## 1. 概要

ifx-cmd-rulebook は command.shell に false を求めるが、SpecDojo は exec-defaults.yaml の起動コマンドの雛形（"$(cat)" などシェルの置き換え）で AI provider CLI を shell: true で起動している。雛形で起動する場合の例外を型に足すか、実装を shell を使わない形に変えるかを見直す

## 2. 入力

- 2026-11-09、代表の ifx-cmd-ai-provider-cli の磨き込みで、型（shell: false）と実装（src/exec/run/agent.ts の shell: true）の食い違いが出た。代表は今の実装どおり shell: true とし理由を書く、型の見直しは別の todo にする（indie が推奨どおりと決定）。

## 3. 完了条件

- ifx-cmd の型定義（`[[specdojo:ifx-cmd-rulebook|外部コマンド連携仕様作成ルール]]`、`[[specdojo:ifx-cmd-recipe|外部コマンド連携仕様 作成レシピ]]`、`[[specdojo:ifx-cmd-template|外部コマンド連携仕様テンプレート]]`、`[[specdojo:ifx-cmd-sample|外部コマンド連携仕様サンプル]]`、`docs/specdojo/schemas/v1/ifx-cmd.schema.yaml`）と実装（`src/exec/run/agent.ts`、`src/exec/agent-config.ts`、`.specdojo/exec-defaults.yaml`）のシェル起動に関する仕様と実装実態を調査・比較し、食い違いの背景を明確にしている。
- 「実装を shell を使わない形に変える」案の技術的妥当性・影響（引数長制約 `ARG_MAX`、stdin 非対応 CLI へのプロンプト引き渡し、シェル置換パーサの自前実装リスク等）を評価している。
- 「型に例外を足す」案について、先行する kata 改訂（`T-BUSINESS-SPECS-KATA-ifx-cmd-ai-provider-cli-040`）で反映された「シェル起動の例外」規定の内容を検証し、型体系および代表仕様（`[[prj-0001:ifx-cmd-ai-provider-cli|AI provider CLI 非対話起動のコマンド連携仕様]]`）との整合性を確認している。
- 型および実装への追加変更の要否を判断し、見直しの結論・根拠を個票および報告の `handoff` に記録している。
- 利用者に影響する変更の有無を確認し、個票の対応結果の「CHANGELOG に書く事項」および報告の `handoff` に記載している。

## 4. 作業内容

| No  | 作業                                     | 担当     | 状態 | メモ                                                                    |
| --- | ---------------------------------------- | -------- | ---- | ----------------------------------------------------------------------- |
| 1   | 型定義と実装におけるシェル起動の現状調査 | executor | done | rulebook、recipe、template、schema、agent.ts、exec-defaults.yaml を確認 |
| 2   | 実装改修（shell: false 化）の妥当性評価  | executor | done | 引数長制約（`ARG_MAX`）や stdin 非対応 CLI へのプロンプト引き渡しを評価 |
| 3   | 型定義におけるシェル例外規定の整合性確認 | executor | done | kata 改訂（kata-040）の例外規定と代表仕様（PJR-H90H）を検証             |
| 4   | 見直し結論の整理と個票・申し送りへの記録 | executor | done | 追加改修不要の結論と根拠を個票および `handoff` に記録                   |

## 5. 対応結果

### 5.1. 実施内容・見直し結果

- **調査と現状確認**:
  - 2026-11-09 起票時点では、`[[specdojo:ifx-cmd-rulebook|外部コマンド連携仕様作成ルール]]` は `command.shell: false` を原則として求め、`command.shell: true` やパイプ・置換を禁止していた。
  - 一方、SpecDojo 本体（`src/exec/run/agent.ts`）は、AI provider CLI（`copilot`, `antigravity` 等）の起動において `.specdojo/exec-defaults.yaml` の `command_template` に含まれる `"$(cat)"`（stdin からのプロンプト取得）や `"$(pwd)"` を展開するため、`shell: true` で child process を起動していた。
- **実装を `shell: false` に変える案の評価**:
  - `copilot` や `antigravity` などの一部 CLI は stdin から直接プロンプトを読み込むオプションがなく、引数（`-p`）でプロンプトを渡す仕様となっている。
  - これらを `shell: false`（固定 argv による直接起動）で動かすには、SpecDojo 自身がプロンプト文字列を引数配列に埋め込む必要があるが、exec plan のような大規模テキスト（数万〜数十万文字）をコマンドライン引数に渡すと、OS のコマンドライン引数長上限（`ARG_MAX`）に抵触する恐れがある。
  - また、設定内のコマンド置換を展開するための独自シェルパーサを実装することは、不具合やセキュリティリスクの温床となる。
  - 現在の実装は、`src/exec/agent-config.ts` において `nickname` を英数字に限定（`NICKNAME_PATTERN`）するなど、3層の多層防御によってシェルインジェクションを防止しており、安全性が担保されている。
  - 従って、実装を無理に `shell: false` 化することは不適切であり、`shell: true` を維持することが妥当と判断した。
- **型に例外を足す案の評価と整合性確認**:
  - 先行する kata 改訂タスク（`T-BUSINESS-SPECS-KATA-ifx-cmd-ai-provider-cli-040`、2026-11-10 コミット `9a41e1c84`）において、すでに `[[specdojo:ifx-cmd-rulebook|外部コマンド連携仕様作成ルール]]` の 6.2 節に「シェル起動の例外」が新設されていた。
    - 管理された起動設定を呼び出し元が展開し、その起動契約がシェルを必要とする場合は `shell: true` を認める。
    - シェルを必要とする理由、テンプレートの正本と管理境界、展開する値の検証・制限を確認できる参照先を示す。
    - 禁止事項も「シェル起動の例外条件を満たさず `shell: true` とすること、または実際の起動方式を隠して `false` とすること」に見直された。
  - `[[specdojo:ifx-cmd-recipe|外部コマンド連携仕様 作成レシピ]]`（4.2 節・6 節）、`[[specdojo:ifx-cmd-template|外部コマンド連携仕様テンプレート]]`（29 行目コメント）、`docs/specdojo/schemas/v1/ifx-cmd.schema.yaml`（`BooleanOrPlaceholder`）もこれに合わせて整合性が確保されている。
  - 代表仕様 `[[prj-0001:ifx-cmd-ai-provider-cli|AI provider CLI 非対話起動のコマンド連携仕様]]` も `[[prj-0001:pjr-h90h-ifx-cmd-ai-provider-cli-refine-confirmed-kata|PJR-H90H]]` でこの例外規定に従って磨き込まれ、`shell: true` とその根拠コメント・正本参照が記述されている。
- **結論**:
  - 本タスクが提起した「型に例外を足すか、実装を shell を使わない形に変えるか」の見直しについて、
    1. 実装の `shell: false` 化は行わず、既存の多層防御による `shell: true` 起動を維持する。
    2. 型へのシェル例外の追加は kata-040 で過不足なく完了しており、現行の型体系（rulebook, recipe, template, sample, schema）と代表仕様および実装は完全に整合している。
    3. 従って、追加のファイル変更・改修は不要であり、本見直しをもって完了とする。

### 5.2. CHANGELOG に書く事項

なし

## 6. 関連ドキュメント

- `[[specdojo:ifx-cmd-rulebook|外部コマンド連携仕様作成ルール]]`
- `[[specdojo:ifx-cmd-recipe|外部コマンド連携仕様 作成レシピ]]`
- `[[specdojo:ifx-cmd-template|外部コマンド連携仕様テンプレート]]`
- `[[specdojo:ifx-cmd-sample|外部コマンド連携仕様サンプル]]`
- `[[prj-0001:ifx-cmd-ai-provider-cli|AI provider CLI 非対話起動のコマンド連携仕様]]`
- `[[specdojo:exec-config-guide|exec設定ガイド]]`
- `[[prj-0001:pjr-2gd6-business-specs-reps|PJR-2GD6 業務仕様の種類ごとに代表の文書を 1 件ずつ作る]]`
- `[[prj-0001:pjr-h90h-ifx-cmd-ai-provider-cli-refine-confirmed-kata|PJR-H90H 代表の ifx-cmd-ai-provider-cli を、確定した型で磨き込む]]`
