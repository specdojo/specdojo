---
specdojo:
  id: prj-0001:pjr-smw7-ccd-project-planning-refine-confirmed-kata
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: hard
  registered_at: "2026-11-10T13:13:18Z"
  derived_from:
    - PJR-2GD6
    - PJR-T88P
  autopilot: approved
  approach: fully-guided
  targets:
    - prj-0001:ccd-project-planning
---

# PJR-SMW7 代表の ccd-project-planning を、確定した型で磨き込む

## 1. 概要

business-specs-kata で確定した型（specdojo:ccd-mermaid-rulebook と sample）に合わせて、代表の ccd-project-planning を磨き込み、冗長さを整理する。review は schedule の review の段で流す

## 2. 入力

- 型一式の確定（2026-11-10、indie が決定）の後に、代表を磨き込みから流し直す。schedule の磨き込み・condense の段はゲートで bes・br・clis の段まで巻き戻すことになるため、register の todo で行う（orchestrator の判断、indie に報告）。
- 夜間の register の routine で流す（indie が承認）。review は T-BUSINESS-SPECS-REPS-ccd-project-planning-090 を reopen 済みで、6:00 の exec cycle で流す。

## 3. 完了条件

- 代表の [[prj-0001:ccd-project-planning]] を、確定した型 [[specdojo:ccd-mermaid-rulebook]] と [[specdojo:ccd-sample]] に合わせて磨き込んでいる。型の本文要件の章立て・必須の項目・記述ガイドの判断の基準に沿い、型が禁止することを書いていない。
- 冗長さを整理している（判断に要る背景・制約・例外と意味は保ち、新しい内容を足さない）。
- 実装・schema・リファレンスと同じことを書かず、正本を参照する方針（PJR-2GD6）を保っている。
- 決められない点は `_UNDECIDED_` か `_ASSUMPTION_` のまま、理由（どの成果物がない、誰の判断が要る）を書いて残してよい。依存の成果物がないことを理由に未完了としない。
- これまでの review の指摘のうち、確定した型の範囲で直せるものを直し、直さないものは理由を個票の対応結果に書いている。
- 型と、ほかの成果物とカタログを変えていない。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`specdojo catalog validate --project prj-0001` が通っている。

## 4. 作業内容

| No  | 作業                               | 担当  | 状態       | メモ         |
| --- | ---------------------------------- | ----- | ---------- | ------------ |
| 1   | 確定した型と代表の文書を読み比べる | Codex | done       | 5.1・5.2参照 |
| 2   | 磨き込みと冗長さの整理を行う       | Codex | done       | 5.1・5.2参照 |
| 3   | 検査を流し、対応結果に書く         | Codex | 親検証待ち | 5.4参照      |

## 5. 対応結果

### 5.1. 実施内容・変更ファイル

- [[prj-0001:ccd-project-planning|概念クラス図（プロジェクトの立上と計画）]] の第2〜4章で、キー継承・一意性の説明を第4章へ集約した。成果物定義のカタログ横断の一意性、計画要素のタスク・マイルストーン共通の識別範囲を保持した。
- 第3章の登録項目とエピックの責務分担・完了判断を [[prj-0001:bdd-register-entry|業務データ辞書（登録項目個票）]] への参照に整理した。起票元と先行依存の区別、通常・横断タスクの違いは関連表に集約した。
- 第4章で全クラスの主キーの対応名・識別範囲を明示し、第5章で未作成辞書との照合範囲と文書間の未確認事項を明確にした。
- 本個票の作業内容と対応結果を記入した。

### 5.2. 進め方と実践の型の適用

- 指定 rulebook は5章構成、全関連の根拠表、全クラスの辞書対応と識別範囲、未解決事項の確認責務の基準として適用した。sample はキー継承・未照合の表現の形式を確認した。既存の章構成を採用した。recipe は主 rulebook の `not-needed` に従い非適用とした。
- 直接の根拠として対象成果物、登録項目の辞書、個票の入力・完了条件、プロジェクト概要を読んだ。概要の参加者交代・共通の正本・人間の判断責任は、既存の目的と整合していた。共通規約2文書と共通レビュー観点の `vp-arc-conciseness`、検査設定も確認した。
- 指定実装 `src/catalog/catalog.ts` と `src/exec/exec.ts` を読み、前者のカタログ読込・検証呼出し、後者の再公開という既存の調査範囲を確認した。実体の型定義や検証内部との照合は第5章の申し送りに残した。
- executor の判断で、主キーの説明は第4章を正本とし、第2章のエピックのキー継承と第3章の一意性の重複を統合した。第4章の計画要素と `id` の対応も表へ集約した。図の概念・関連・多重度、抽象概念の保存上の扱い、戦略とトラックを分ける理由、初期状態・例外・制約は保持した。
- 第3章の子 todo・Schedule との責務分担と epic の自動完了に関する説明は、作成済み辞書への参照に置き換えた。起票元から先後関係を推測しない条件と通常・横断タスクの違いは関連表に残し、表の下の重複を削った。これは rulebook の正本参照方針と簡潔性の基準に基づく。
- 未作成の5辞書との対応は `_ASSUMPTION_` とし、既存のキー構成から識別範囲を明示した。project の識別子と Role code の物理名は未照合のまま、具体化を見送った。既存のデータストア定義に関する論点は `_UNDECIDED_` として保持した。当該定義・CDFD・本文で参照する個別業務ルール・過去 review の本文は宣言された参照範囲に含まれず、追加参照していない。
- plan に展開された review finding は「なし」であり、過去 review の個別指摘との突合せは未実施。既存の未解決事項は第5章に残し、後続の独立した schedule review に引き継ぐ。

### 5.3. 残課題・申し送り

- 未作成の `bdd-project-config`・`bdd-operations-config`・`bdd-deliverables-catalog`・`bdd-schedule-strategy`・`bdd-schedule-track` は、作成後に BA が主キーの対応名・識別範囲・関連を照合する。
- PM が実体の型定義・参照解決を調査入力へ追加する別の調査を手配し、BA・ARC が照合する。状態管理の正本に関する既存論点も BA・ARC の読み合わせで解消する。
- 今回の変更判断と未照合範囲は executor の `handoff` にも渡す。後続 review は個票の入力にある `T-BUSINESS-SPECS-REPS-ccd-project-planning-090` に委ねる。
- catalog 検証では、参照先未作成と `src/exec/exec.ts` が再公開のみであることに関する警告が出た。カタログや調査入力の整備が必要かは、夜間 orchestrator が別問題として扱う。

### 5.4. 検証

- 図の11クラスと第4章、19関連と第3章の対応、名前・向き・関係種別・役割名・多重度を確認した。
- executor で変更2文書の Prettier 整形、`node --import tsx src/specdojo.ts catalog validate --project prj-0001`、`node --import tsx src/specdojo.ts register build --project prj-0001`、`npm run validate:history-links` を実行し、すべて終了コード0だった。catalog 検証の警告は5.3に記録した。
- `git diff --check` は通過した。hook の `node tools/check-evidence-secrets.mjs --staged` は対象0件・検出0件で通過した。
- `npm run lint:md`・`npm run lint:fm`・`npm run lint:mermaid`・`npm run lint:d2`・`npm run validate:schema` を含む設定済み検査は親 runner が実行し、その結果を evidence に追記する。

### 5.5. CHANGELOG に書く事項

- 区分は Changed。行の文案は「概念クラス図（プロジェクトの立上と計画）の主キーの識別範囲と未照合箇所を明確にし、重複説明を整理した。」

## 6. 関連ドキュメント

- 親: [[prj-0001:pjr-2gd6-business-specs-reps]]、[[prj-0001:pjr-t88p-business-specs-kata]]
- 対象: [[prj-0001:ccd-project-planning]]
- 型: [[specdojo:ccd-mermaid-rulebook]]
