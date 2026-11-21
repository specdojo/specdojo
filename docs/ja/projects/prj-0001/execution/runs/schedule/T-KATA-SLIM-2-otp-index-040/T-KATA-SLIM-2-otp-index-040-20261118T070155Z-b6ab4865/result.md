---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-otp-index-040-20261118t070155z-b6ab4865
  type: exec-result
  task_id: T-KATA-SLIM-2-otp-index-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-otp-index-040/T-KATA-SLIM-2-otp-index-040-20261118T070155Z-b6ab4865/plan.md
  started_at: "2026-11-18T07:02:03.449Z"
  completed_at: "2026-11-18T07:30:45.688Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - prj-0001:otp-index
    - specdojo:otp-index-rulebook
---

# Edit Result

## 1. 実施内容

- otp-index-rulebook を見直し、grade の finding F001〜F003 を解消した。
- F001: 成果物 ID を `&lt;project-id&gt;:otp-index` の形式にした。
- F002: Frontmatter の参照と例に `rulebook` キーを含めた。
- F003: 記述の判断基準と良い例・悪い例を足し、記述ガイドの具体性を補った。
- 用語の箇条書きを位置づけの表にし、Frontmatter 表の `title` と壊れた表を直し、「共通の運用」の参照を足した。
- 成果物の 11 章の章名と、すべて必須の区分は変えていない。
- 大きさは空白と表の区切り行を除いて 1,842 字から 2,632 字（約 143%）となり、8 割以下の目安を超えた。
- runner の検証（lint:fm、lint:md、lint:mermaid、lint:d2、validate:schema、test:unit、test:integration）は通過した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/otp-index-rulebook.md`: ID を project 修飾形式にし、Frontmatter の参照と例に `rulebook` キーを含め、記述の判断基準と良い例・悪い例を足した。用語の箇条書きを位置づけの表にし、Frontmatter 表の `title` と壊れた表を直した。「共通の運用」を 1 項目だけ置いて共通の正本を参照するようにした。第 5 章の名前を「本文構成（標準テンプレ）」から「本文要件」に変えた。

## 3. 申し送り

- `otp-index-sample` の変更案（commit の対象外のため未変更）は executor の handoff のとおり。
- grade サイドカーは再評価時に更新されるため、直接編集していない。
- 大きさ: 空白と表の区切り行を除いて前 1,842 字、後 2,632 字（約 143%）。外せる運用の記述がもともと少なく（役割・status・承認・lint・管理台帳の記述はなかった）、F001〜F003 の修正（Frontmatter の例、判断基準と良い例・悪い例）と、壊れた表を整えたことで増えた。
- rulebook の第 5 章の名前を「本文構成（標準テンプレ）」から「本文要件」に変えた。rulebook-authoring-standard の標準章構成に合わせるため。成果物の 11 章の章名と、すべて必須の区分は変えていない。
- sample の変更案（commit の対象外のため未変更）: `otp-index-sample` は本文要件の受入条件に対して、バックアップの保管先、権限移行の旧新の差分、障害対応フローの判断・連絡・復旧・報告の流れ、クローズ条件の判断者と最終報告物が欠けている。recipe と template は `undecided` のまま。
- 成果物本体の `docs/ja/projects/prj-0001/060-migration-planning/otp-index.md` はまだ作られていない。根拠には sample と成果物カタログ `dct-migration-planning.yaml` を使った。共通の正本への追記は不要と判断した。
- 適用外の検証: `npm run validate:history-links`（変更したのは rulebook だけで、plan・result・個票を変更していない）
- rate limit後に sol-executor から opus-executor へ切り替え、2026-11-18T07:05:04.729Z に再開

## 4. 進め方と実践の型の適用

参照の向きを成果物から rulebook に切り替え、otp-index-rulebook を見直した。grade の finding F001〜F003 を修正要件として扱い、rulebook-authoring-standard に沿って直した。外せる運用の記述がもともと少なかったため、大きさは目安を超えた。根拠は sample と成果物カタログ `dct-migration-planning.yaml` で、成果物本体はまだ作られていない。第 5 章の改名は rulebook-authoring-standard の標準章構成に合わせた。共通の正本への追記は不要と判断した。recipe と template は `undecided` のままで、変えていない。
