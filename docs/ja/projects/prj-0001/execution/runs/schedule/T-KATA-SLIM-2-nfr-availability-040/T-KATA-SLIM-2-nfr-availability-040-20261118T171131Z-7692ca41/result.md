---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-nfr-availability-040-20261118t171131z-7692ca41
  type: exec-result
  task_id: T-KATA-SLIM-2-nfr-availability-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-nfr-availability-040/T-KATA-SLIM-2-nfr-availability-040-20261118T171131Z-7692ca41/plan.md
  started_at: "2026-11-18T17:11:40.627Z"
  completed_at: "2026-11-18T17:42:29.741Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - nfr-availability
    - specdojo:nfr-availability-rulebook
---

# Edit Result

## 1. 実施内容

- 不可用性 (nfr-availability) の `rulebook` から共通の運用記述を削除し、正本への参照に切り替えることで文書の簡素化を実施した。
- 具体的には、全体方針に「共通の運用」項目を追加し、Frontmatter の章定義における specdojo 名前空間および `schema` 正本の参照形式へ修正を行い、不要なタイトルや Markdown リンクを削除した。
- 空白を除いた文字数は 3,314 字から 2,653 字（約 80.05%）へと削減し、型固有の判断基準や最小例を維持しつつ冗長さを排除した。
- grade 指摘 F001 ( `vp-qe-kata-conformance` ) は、`specdojo:nfr-availability-sample` 側の構成不備に起因するため、本タスクの編集対象外として handoff に修正案を記載した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/nfr-availability-rulebook.md`: 共通の運用記述を削除して正本参照に切り替え、Frontmatter を整理し、サンプル章を最小例に絞り込むことで内容を簡素化した。

## 3. 申し送り

- F001（major / `vp-qe-kata-conformance`）は未解消: `specdojo:nfr-availability-sample` が rulebook の「本文構成（標準テンプレ）」の 5 章に合っていない（今は「目的と適用範囲／入力情報／記述内容／最小記述例／未解決事項」）。この段では sample が commit の対象外のため直していない。sample への変更案: 見出しを「概要（対象・目的）／適用範囲・除外条件／可用性要件一覧（`id`・内容・指標・基準・備考）／測定・検証方法／関連ドキュメント導線」に組み替え、駄菓子屋の販売管理システムの文脈で稼働率・RTO・RPO を定量で書く。H1 と表の中にある rulebook への Markdown リンクも外す（sample へのリンクを置かない規約に合わせる）。その後、型を grade し直す。
- 大きさ: 空白を除いた文字数で、表の区切り行を除くと 3,314 字から 2,653 字（80.05%）。区切り行を含むと 3,821 字から 3,068 字、バイト数は 8,813 B から 6,733 B。目安の 8 割をわずかに超えたが、残りは型固有の判断基準と最小例のため、これ以上は削らなかった。
- 章名と必須の区分は変えていない。用語の表（稼働率・RTO・RPO）は本文要件の列定義の言い直しではないため残した。役割の表・status 昇格・承認・台帳の列は、もともとこの rulebook になかった。
- サンプル章は rulebook 作成標準の経過措置に従い、章を消さずに最小例へ絞った。成果物と同じ見出しの完成例は sample へ移すこと。
- 共通の正本（document-metadata-standard）への追記は不要と判断した。recipe と template は `undecided` のため変更案はない。`includes` で取り込む記法の rulebook もない。成果物本体 `docs/ja/product/060-non-functional-requirements/nfr-availability.md` はまだない。
- 適用外の検証: `npm run validate:history-links`（変更したのは rulebook だけで、plan・result・個票などの履歴ファイルを変えていない）
- rate limit後に sol-executor から opus-executor へ切り替え、2026-11-18T17:13:38.484Z に再開

## 4. 進め方と実践の型の適用

rulebook-maintenance
