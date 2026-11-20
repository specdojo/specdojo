---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-ifx-file-agent-evidence-040-20261118t122247z-9bf81681
  type: exec-result
  task_id: T-KATA-SLIM-2-ifx-file-agent-evidence-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-ifx-file-agent-evidence-040/T-KATA-SLIM-2-ifx-file-agent-evidence-040-20261118T122247Z-9bf81681/plan.md
  started_at: "2026-11-18T12:23:00.796Z"
  completed_at: "2026-11-18T12:53:13.183Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - ifx-file-agent-evidence
    - specdojo:ifx-file-rulebook
---

# Edit Result

## 1. 実施内容

- `ifx-file-rulebook` から、どの成果物にも共通する運用の記述を外し、全体方針に「共通の運用」を 1 項目だけ置いて共通の正本への参照にした。外した記述は、役割の表、status の昇格と承認、改訂と廃止の役割表、共通規約と重なる禁止事項、言い直しだけの用語表、整形を業務の検証に含める記述である。
- grade の finding F001〜F004 に対応した。F001 は良い例を抜粋に絞った。F002 は modeline が none でもメタ情報の照合は省かれないと明記した。F003 は検証手順から `status: draft` の要求を外し、合格条件付きの照合手順にした。F004 は sample を Markdown とする規定を外した。
- 章名は「位置づけと用語定義」を「位置づけ」に変えた。用語の表を外したためである。必須・条件付きの区分は変えていない。
- 大きさは、空白と改行を除き表の区切り行も除いて 13,193 字から 10,440 字(79.1%)になった。区切り行を含めると 14,222 字から 11,004 字(77.4%)で、バイト数は 30,946 B から 24,273 B である。
- 成果物本体、sample、recipe、template は変更していない。検証では、`npx prettier --check`、`npm run lint:fm`、`npm run lint:md`、`npm run lint:mermaid`、`npm run lint:d2`、`npm run validate:schema`、`npm run test:unit`、`npm run test:integration` が通った。`npm run lint:ts` と `npm run typecheck` は変更種別により対象外である。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/ifx-file-rulebook.md`: 運用の記述を外して共通の正本への参照に置き換え、規約を簡潔にした。全体方針に「共通の運用」を 1 項目置いた。役割の表と段落、status 昇格と承認、改訂と廃止の役割表、共通規約と重なる禁止事項、整形を業務の検証に含める記述を削除した。用語の表も削除し、第 2 章を「位置づけ」に改めて source/target と writer/reader の違いだけを残した。良い例は抜粋に絞った。検証手順は、modeline が none でもメタ情報の照合を省かず、`status: draft` を要求しない合格条件付きの手順にした。sample を Markdown とする規定も外した。

## 3. 申し送り

- sample に関する変更案は 2 つある。1 つ目は F004 の根本解消である。rulebook は `target_format: yaml` だが `ifx-file-sample.md` は Markdown なので、sample を `ifx-file-sample.yaml`(`x-spec-meta` 付きの YAML 形式)へ移し、Frontmatter の sample 宣言との対応を見直す必要がある。この段は rulebook だけを直す範囲のため、sample は変えていない。2 つ目は、sample に役割の段落、ready 昇格の承認、文書品質の検査などの運用の記述が残っていれば、kata-slim の一覧に沿って外すことである。
- 共通の正本への追記は不要と判断した。外した記述は、`document-metadata-standard` の「成果物の値制約」と「文書の改訂・廃止とライフサイクル変更管理」で賄える。
- 変更案（sample）: rulebook は `target_format:` yaml だが ifx-file-sample.md は Markdown のため、F004 の根本解消には sample を ifx-file-sample.yaml（x-spec-meta 付きの YAML 成果物形式）へ移し、Frontmatter の sample 宣言との対応を見直す必要がある。この段は rulebook だけを直す範囲のため sample は変えていない。
- 変更案（sample）: sample 内に役割の段落・ready 昇格の承認・文書品質の検査などの運用の記述が残っていれば、kata-slim の一覧に沿って外す。
- 共通の正本への追記は不要と判断した。外した記述は document-metadata-standard の「成果物の値制約」と「文書の改訂・廃止とライフサイクル変更管理」で賄える。
- 章名の変更: 第 2 章「位置づけと用語定義」を「位置づけ」に変えた。用語の表（`source/target/writer/reader/direction/atomic_write`）は本文要件の言い直しだったため外し、source/target と writer/reader の違いだけを位置づけの第 3 項として残した。
- 大きさ: 空白と改行を除き、表の区切り行も除いて 13,193 字から 10,440 字（79.1%）。区切り行を含めると 14,222 字から 11,004 字（77.4%）、バイト数は 30,946 B から 24,273 B。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/rulebooks/ifx-file-rulebook.md のみで、plan・result・pjr 個票を変更していないため）
- 適用外の検証: `npm run validate:schema:file`（変更ファイルは Markdown のみで `*.yaml` / `*.yml` の変更がないため）
- rate limit後に sol-executor から opus-executor へ切り替え、2026-11-18T12:26:04.243Z に再開

## 4. 進め方と実践の型の適用

rulebook-maintenance として、`ifx-file-rulebook` を kata-slim の一覧(sld の試行と改訂済み `sld-rulebook`)に沿って見直した。共通の運用(役割、status と承認、改訂と廃止、未決事項の引き継ぎ)は `document-metadata-standard` などの正本への参照にまとめた。型固有の判断基準、標準の列と章の受入条件、良い例と悪い例、型固有の禁止事項、業務の受入確認の手順は残した。F001〜F004 は executor の報告では対応済みである。F004 は rulebook 側で sample を Markdown とする規定を外したところまでで、sample 自体の形式移行は変更案として申し送った。evidence には根拠とした資料の読み込み記録がないため、各 finding の解消確認は executor の報告に基づく。章名の変更は第 2 章のみで、理由は用語の表を外したためである。
