---
specdojo:
  id: prj-0001:pjr-v5az-quick-start-conversation-flow
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: BA
  registered_at: "2026-11-02T11:56:56Z"
  due_on: "2026-11-30"
---

# PJR-V5AZ Quick Start ガイドを初期設定から実運用までの対話ベースに書き直す

## 1. 概要

landing page から来た利用者が、管理対象リポジトリと Git flow の初期設定、register の起票・実行、schedule による成果物作成、routine 登録までを対話で体験できる Quick Start に改訂する。コマンドと設定差分は折りたたむ。

## 2. 入力

- 対象は docs/ja/specdojo/guides/quick-start-guide.md。landing page から訪れる初学者向けに、コマンド主体の構成を対話主体へ改訂する。
- 共通の題材は ../landing-page。導入・起動、管理対象リポジトリへの追加、Git flow のブランチルール設定を対話で示す。
- FAQ 追加の todo、スマートフォンでメニューが閉じない不具合の issue、問い合わせフォームの実装方針を比較する decision の起票例を示す。これらはガイド用の例であり、実プロジェクトの事実ではない。
- 登録した作業の AI 実行と確認、成果物カタログなどの準備から schedule によるまとまった成果物の作成、routine の登録と定期起動の仕組みへ進む。
- 各節は前提・具体的対話・得られる結果と確認先・折りたたんだコマンドと設定差分の順とし、不足事項の確認と提案・承認・実行を示す。
- 完了時は現行 CLI・設定仕様との整合、既存リンクと見出しへの参照、Markdown lint と適用される親の文書検証を確認する。保護された設定や実際の landing-page リポジトリの変更は対象外。
- 統合後の実物確認で現行仕様との不整合を確認したため、元の完了条件に沿って修正する（2026-11-02、specdojo-orchestrator）。init の人の名簿は `projects.<id>.members_path` が指す 030-project-management/pm-members.yaml であり .specdojo/pm-members.yaml ではない。`schedule_path` の既定は project base 配下の schedule であり execution/schedule ではない。project list は project ID と schedule/execution パスを表示し、repos 一覧は表示しない。issue/risk の正常終端は done、question は decided であり、resolved/answered/mitigated/closed は現行の登録簿状態ではない。setup.install は追跡済み package-lock.json ごとの npm ci であり npm install ではない。commit scope 未指定では {scope} は空であり、feat(add-faq-section) と出力を約束するなら --commit-scope 等を明示する。
- 同じ修正で導入から実行までの例を CLI と設定リファレンスに照合する。初期 commit と SpecDojo 側 develop ブランチ、exec に必要な設定の commit、`catalog_path`・`roles_path`・schedule/execution・`routines_path`・`jobs_path` と Job 定義の準備を対話と設定差分で具体化し、未提供の Job や固定の task ID・成果物パスを利用可能と仮定しない。schedule の実際の生成 ID・配置と、BA ロールと owner の割当を確認する。register add 例は具体的な description と入力を残し、decision の close は --status decided と利用者 nickname の --by を明示する。FAQ の owner 質問の重複を除く。routine YAML 自体は現行 routine.schema.yaml と一致しているため、不正な形式と誤認して変えない。保護設定と実プロダクトは変更せず、対応結果に照合根拠と検証結果を記録する。
- 2回目の実物確認で残った箇所だけを最小修正する（2026-11-02、specdojo-orchestrator）。schedule strategy generate の --default-owner/--gate-owner/--milestone-owner は nickname ではなく pm-roles.yaml の ROLE code を受け取る。command-reference.md の主担当・gate/milestone owner の説明と src/schedule/strategy-generate-scope.ts の実装を確認し、例は --default-owner BA --gate-owner BA --milestone-owner BA とし、BA を pm-members.yaml の人の roles に割り当てる説明と、実行時 --by owner の nickname を区別する。前回の修正で nickname を直接渡すようにした箇所を戻す。decision close 例に重複した --status decided / --by owner は各1回にする。FAQ todo の register add に具体的な --description を加え、起票例に --by specdojo-orchestrator を明示する。シェル例の空白入り日本語 placeholder は `<task-id>`/`<nickname>` にし、置換方法を本文へ記載する。対話形式と既存の設定準備の改善は保持し、ガイド全体を再構成しない。完了報告前に上記の文字列・引数を実ファイルで確認し、照合根拠と結果を個票へ記録する。

## 3. 完了条件

- 導入・起動から、`../landing-page` の管理対象への追加と Git flow のブランチルール設定までを、具体的な対話で説明している。
- 機能追加の todo、不具合の issue、判断の decision の起票と、登録した作業の AI 実行・確認を、一貫した題材で体験できる。
- 成果物カタログなどの前提設定から schedule によるまとまった成果物の作成、routine の登録と定期起動の仕組みまで案内している。
- 各ユースケースに前提、利用者とオーケストレーターの対話、得られる結果と確認先を記載し、不足事項の確認と提案・承認・実行の流れを示している。
- 対話に対応するコマンドと設定差分は `<details>` で折りたたみ、導入と起動に必要なコマンドは本文で確認できる。
- コマンドと設定例が現行仕様に整合し、担当・期限・判断を勝手に確定する対話例を含まない。既存の参照元からの導線と文書内リンクを確認している。
- Markdown lint と適用される親の文書検証を通し、検証結果を対応結果へ記録している。

## 4. 作業内容

| No  | 作業                                                                 | 担当 | 状態 | メモ                                                |
| --- | -------------------------------------------------------------------- | ---- | ---- | --------------------------------------------------- |
| 1   | 現行 CLI・設定仕様と関連ガイド、参照元の導線を確認する               | BA   | done | ROLE code・nickname・register 引数を再照合済み      |
| 2   | 合意した利用順に構成し、対話例と折りたたんだコマンド・設定差分を書く | BA   | done | 対話構成を維持し、2 回目の実物確認の指摘を最小修正  |
| 3   | リンクと文書検証を確認し、対応結果へ記録する                         | BA   | done | README の旧見出し参照を修正し、検証分担と結果を記録 |

## 5. 対応結果

統合後の実物確認で判明した現行仕様との差を、完了条件の範囲で Quick Start に反映した。照合根拠は `docs/ja/specdojo/references/command-reference.md`、`docs/ja/specdojo/references/specdojo-config-reference.md`、`docs/specdojo/schemas/v1/routine.schema.yaml`、`src/shared/specdojo-config.ts`、`src/register/create-commands.ts`、`src/register/transition-commands.ts`、`src/exec/schedule/schedule.ts` である。

- init が作る人の名簿は `projects.<id>.members_path` の `030-project-management/pm-members.yaml` と記載し、`.specdojo/pm-members.yaml` の誤記を修正した。`schedule_path` の既定配置を project base 配下の `schedule` とし、`project list` は project ID と schedule / execution パスを表示し repos を表示しない旨を記載した。
- 初期 commit と SpecDojo 側 `develop` ブランチ、exec 用設定の commit を導入手順に追加した。`setup.install` は追跡済み `package-lock.json` ごとの `npm ci` と説明した。
- register の正常終端を issue / risk は `done`、question は `decided` に訂正した。todo の具体的説明・入力と issue / decision の説明・入力を CLI 例に加え、decision close では `--status decided` と `--by owner` を明示した。FAQ owner 確認の重複を取り除いた。
- 実行 agent / owner の選択を設定・名簿由来として説明し、実際に生成される task ID や成果物パスを決め打ちしないよう schedule / exec の対話を修正した。BA ロールと名簿の owner nickname を区別するようにした。
- routine は現存する Job と入力仕様を確認してから登録する流れに修正し、未提供 Job の存在を仮定しないようにした。routine YAML の形式は現行 `routine.schema.yaml` との照合で妥当なため変更していない。
- Markdown 文書内の参照先と導線を維持した。保護設定および実際の `../landing-page` は変更していない。

### 2 回目の実物確認への対応

- [[specdojo:command-reference|CLI コマンドリファレンス]] の schedule strategy の主担当・gate / milestone owner の説明と、`src/schedule/strategy-generate-scope.ts` の `resolveDeliverableOwners` / `loadKnownRoles`、`src/schedule/strategy-generate.ts` の gate / milestone owner 検証を照合した。strategy の担当引数は nickname ではなく `pm-roles.yaml` の ROLE code であるため、例を `--default-owner BA --gate-owner BA --milestone-owner BA` に修正した。
- `pm-members-template.yaml` と `pm-members.schema.yaml` に照らし、人の `roles` に `BA` を割り当て、実行時は nickname を `--by owner` として使う説明を加えた。5.4 の対話も schedule の owner（ROLE code）と実行者の nickname を区別した。
- `src/register/create-commands.ts` と `src/register/transition-commands.ts`、CLI リファレンスの actor 規則を照合した。FAQ todo に具体的な `--description` を加え、todo / issue / decision の起票例すべてに `--by specdojo-orchestrator` を明示した。decision close の `--status decided` と `--by owner` はそれぞれ 1 回にした。
- claim / complete のシェル例を `<task-id>` / `<nickname>` に統一し、実際の Ready 一覧と人の名簿から値を読み、山括弧ごと置換する手順を記載した。
- Quick Start の見出し、既存リンク、対話構成、設定準備、routine YAML は維持した。`README.md` 冒頭に残っていた改訂前の「10分で体験する — 仕様の判断台帳」への参照を、現在の Quick Start の内容に沿った案内へ修正した。`docs/ja/index.md`、`use-case-guide.md`、設定リファレンスからの導線も確認した。

**検証分担と結果**: `package.json`、`.specdojo/specdojo.config.json`、`lefthook.yml` を確認した。変更は Markdown のみ。次の検証を executor で実施した。

- `npx prettier --write README.md docs/ja/specdojo/guides/quick-start-guide.md docs/ja/projects/prj-0001/controls/project-register/pjr-v5az-quick-start-conversation-flow.md`: 成功。対象 3 ファイルを整形した。
- `git diff --check`: 成功。指定された引数とプレースホルダーも実ファイルで再確認した。
- `node --import tsx tools/catalog-validate-if-configured.mjs`: 成功（終了コード 0）。`catalog_path` のある project 配下の個票変更のため適用した。カタログが参照する未作成の product 文書について `based_on` を照合できない警告が出たが、今回変更した文書に関するエラーはない。
- `node --import tsx src/specdojo.ts register build --project prj-0001`: 成功（終了コード 0）。hook に従い個票から一覧・派生ビューを再生成できることを確認した。
- `npm run validate:schema:file`: 適用外。executor による YAML ファイルの変更はない。

Markdown lint / frontmatter / Mermaid / D2 を含む指定の親検証は重複実行せず、親 runner が後段で結果を追記する。これらの成功は本段階では判定していない。保護設定、登録簿の状態、result、実際の `../landing-page` は変更していない。

## 6. 関連ドキュメント

- [[specdojo:quick-start-guide]]
- [[specdojo:orchestrator-operation-guide]]
- [[specdojo:register-operation-guide]]
- [[specdojo:command-reference]]
