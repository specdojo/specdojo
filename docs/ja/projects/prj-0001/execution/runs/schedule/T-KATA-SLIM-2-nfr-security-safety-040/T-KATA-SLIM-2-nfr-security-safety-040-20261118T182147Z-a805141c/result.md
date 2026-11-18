---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-nfr-security-safety-040-20261118t182147z-a805141c
  type: exec-result
  task_id: T-KATA-SLIM-2-nfr-security-safety-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-nfr-security-safety-040/T-KATA-SLIM-2-nfr-security-safety-040-20261118T182147Z-a805141c/plan.md
  started_at: "2026-11-18T18:21:53.330Z"
  completed_at: "2026-11-18T18:54:40.862Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - nfr-security-safety
    - specdojo:nfr-security-safety-rulebook
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/rulebooks/nfr-security-safety-rulebook.md` から共通の運用記述を削除し、共通正本への参照に置き換えることで文書を簡潔化した（空白除き 3,538 字から 2,813 字へ削減、約 79.5%）。
- 具体的には、役割の表・段落、`status` 管理、承認条件、改訂・廃止手順、品質検査などの共通運用記述を削除し、全体方針に「共通の運用」項目を追加した。
- 併せて、finding に基づき以下の修正を行った：F006（表の表示崩れ）の解消、F003（frontmatter 例の名前空間不備）の修正、F001（判定基準を具体化する例示の追加）。
- サンプル章は最小例に縮小した。章名および必須・条件付き区分は維持している。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/nfr-security-safety-rulebook.md`: 共通運用記述の削除と共通正本への参照化、および finding (F001, F003, F006) に基づく記述内容の改善とサンプル章の簡略化を実施。

## 3. 申し送り

- F004/F005: `specdojo:nfr-security-safety-sample` の章構成が rulebook の 5 章構成と乖離している。sample を 5 章構成の完成例に作り直すことを変更案とする。
- F002: `recipe` および `template` の要否については、nfr 系 rulebook 全体で判断根拠がないため据え置いた。今後まとめて要否を決定することを次のアクションとする。
- F004/F005: specdojo:nfr-security-safety-sample の章構成（目的と適用範囲／入力情報／記述内容／最小記述例／未解決事項）が、rulebook の 5 章構成（概要（対象・目的）／適用範囲・脅威前提／機密性・安全性要件一覧／測定・検証方法／関連ドキュメント導線）と合っていない。H1 の Markdown リンクも外す必要がある。sample を 5 章構成の駄菓子屋文脈の完成例に作り直すことを変更案とする（今回の段では sample を変えていない）。
- F002: `recipe`・`template` は nfr 系の rulebook 9 件がすべて `undecided` で、要否を判断する根拠がないため据え置いた。nfr 系でまとめて要否を決める（例: 5 章構成が rulebook で決まるなら `not-needed`）ことを次のアクションとする。
- サイズ: 空白（改行を含む）と表の区切り行を除いた文字数で、3,538 字から 2,813 字（約 79.5%）。
- 章名・必須の区分は変えていない。用語の表（機密性・安全性・認可逸脱）は本文要件の言い直しではないため残した。サンプル章は rulebook 作成標準の経過措置に合わせて最小例に縮め、削除はしていない。
- 共通の正本（document-metadata-standard）への追記は不要と判断した。成果物 nfr-security-safety.md は未作成のため、成果物の実態との突き合わせはしていない。
- 適用外の検証: `npm run validate:history-links`（変更したのは rulebook だけで、plan・result・個票などの履歴ファイルは変更していないため）
- rate limit後に sol-executor から opus-executor へ切り替え、2026-11-18T18:23:42.471Z に再開

## 4. 進め方と実践の型の適用

rulebook-maintenance
