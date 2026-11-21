---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-sysd-cross-cutting-policy-040-20261118t072232z-5b9d96dc
  type: exec-result
  task_id: T-KATA-SLIM-2-sysd-cross-cutting-policy-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-sysd-cross-cutting-policy-040/T-KATA-SLIM-2-sysd-cross-cutting-policy-040-20261118T072232Z-5b9d96dc/plan.md
  started_at: "2026-11-18T07:22:41.244Z"
  completed_at: "2026-11-18T07:50:39.508Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - sysd-cross-cutting-policy
    - specdojo:sysd-cross-cutting-policy-rulebook
---

# Edit Result

## 1. 実施内容

- `sysd-cross-cutting-policy-rulebook` から、どの成果物にも共通する運用の記述（役割、承認・status、未決事項の担当・期限・登録、見出し連番の規約、agent 昇格禁止の行）を外した。
- 全体方針に「共通の運用」を 1 項目置き、ドキュメントメタ情報標準とメンバー定義を参照する形にした。
- F001・F002 に対応し、Rule ID の置き換え・廃止時の後継 ID または廃止理由の記録、Owner による参照更新の確認を第 3 章へ追加した。禁止事項にも Rule ID の再利用・後継なしの廃止を加えた。
- 章名と必須・条件付きの区分は変更していない。空白を除く文字数は 4,194 字から 3,753 字（約 89%）で、目安の 8 割には届かなかった。
- 整形・lint・schema・unit・integration の各検査は passed で、`lint:ts` と `typecheck` は変更種別により `not_applicable` だった。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/sysd-cross-cutting-policy-rulebook.md`: 共通の運用（役割の表と段落、status・承認、未決事項の担当・期限・台帳登録、共通規約と重複する禁止事項）を削り、全体方針の「共通の運用」1 項目からドキュメントメタ情報標準とメンバー定義を参照する形にした。「未決事項・公開条件」は章名を残し、論点と影響、実装の根拠にする前の適合確認の内容へ変えた。第 3 章に Rule ID の置き換え・廃止時の扱い（再利用しない、後継 ID または廃止理由を残す、Owner が参照先と検証対応の更新を確認する）を追加し、禁止事項にも対応する行を加えた。

## 3. 申し送り

- sample への変更案: `docs/ja/specdojo/samples/sysd-cross-cutting-policy-sample.md` の「1.1. 利用・確認・承認責務」と「6.2. 公開・昇格の判断条件」は共通の運用にあたる。外すか、適合確認の内容へ寄せることを提案する。今回の段では変更していない。
- template への変更案: `docs/ja/specdojo/templates/sysd-cross-cutting-policy-template.md` の同名の 2 節も sample と同様に見直す。今回の段では変更していない。
- 大きさ: 空白（改行を含む）と表の区切り行を除いた文字数で 4,194 字から 3,753 字（約 89%）になり、目安の 8 割（3,355 字）に届かなかった。改訂前から短く（sld は改訂前 8,974 字）、残りは必須領域、retry と timeout の接続、六要素、良い例・悪い例など型固有の判断基準のため、これ以上は削らなかった。
- 章名と必須区分: 変更していない。「未決事項・公開条件」は名前を残し、中身を論点と影響、実装の根拠にする前の適合確認へ変えた（既存の成果物との対応を保つため）。
- F001・F002: 第 3 章に「置き換え・廃止した Rule ID は再利用せず、ルール一覧に後継 Rule ID または廃止理由を残す。その Rule の Owner が参照先（システム設計索引・実装・テスト・運用文書）と検証の対応の更新を確かめる」を足し、禁止事項に Rule ID の再利用・後継なしの行を足した。文書単位の改訂・廃止はドキュメントメタ情報標準の「文書の改訂・廃止とライフサイクル変更管理」に委ねた。
- sample への変更案: docs/ja/specdojo/samples/sysd-cross-cutting-policy-sample.md の「1.1. 利用・確認・承認責務」と「6.2. 公開・昇格の判断条件」は共通の運用（役割・承認）にあたるため、外すか適合確認の内容へ寄せる。
- template への変更案: docs/ja/specdojo/templates/sysd-cross-cutting-policy-template.md の「1.1. 利用・確認・承認責務」と「6.2. 公開・昇格の判断条件」も sample と同様に見直す。
- 共通の正本への追記: 不要と判断した。ドキュメントメタ情報標準の「成果物の値制約」と「文書の改訂・廃止とライフサイクル変更管理」で、外した記述を賄える。
- rate limit後に sol-executor から opus-executor へ切り替え、2026-11-18T07:25:38.550Z に再開

## 4. 進め方と実践の型の適用

根拠は、plan の finding（F001・F002）と、手本とされた sld の試行および改訂済み sld-rulebook の「他の型へ広げるときの一覧」である。外す記述と残す記述はこの一覧に沿って分けた。共通の運用はドキュメントメタ情報標準の「成果物の値制約」と「文書の改訂・廃止とライフサイクル変更管理」で賄えるため、共通の正本への追記は不要と判断した。F001 は、文書単位のライフサイクルを標準へ委ね、Rule ID 単位の置き換え・廃止の責任を第 3 章に定めて解消した。F002 は、後継 ID または廃止理由の記録と、Owner による参照・検証対応の更新確認を要求して解消した。大きさは 4,194 字から 3,753 字（約 89%）で目安に届かなかった。残りは必須領域、retry と timeout の接続、六要素、良い例・悪い例など型固有の判断基準であり、削ると判断に要る内容を失うため残した。
