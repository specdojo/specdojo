---
specdojo:
  id: prj-0001:xer-t-business-specs-reps-cdt-register-type-010-20261108t164224z-c51ebf51
  type: exec-result
  task_id: T-BUSINESS-SPECS-REPS-cdt-register-type-010
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-BUSINESS-SPECS-REPS-cdt-register-type-010/T-BUSINESS-SPECS-REPS-cdt-register-type-010-20261108T164224Z-c51ebf51/plan.md
  started_at: "2026-11-08T16:42:24.853Z"
  completed_at: "2026-11-08T16:58:52.358Z"
  agent: opus-executor
  execution: agent
  approach: retrofit
  targets:
    - cdt-register-type
---

# Edit Result

## 1. 実施内容

- 分類一覧（登録項目の種別）を定義する成果物 `docs/ja/product/010-business-specs/020-data-model/cdt-register-type.md` を新設しました。
- 実装エビデンスである `src/register/register.ts` およびそこから参照される `VALID_TYPES` の定義を調査し、`bdd-register-entry` 等の意図された仕様と照合した結果、乖離がないことを確認し反映しました。
- 各分類値（`issue`, `decision`, `todo`, `question`, `risk`, `change-request`, `note`, `epic`）の業務上の意味、使い分け、および分類の選択順序について記述しました。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/020-data-model/cdt-register-type.md`: 登録項目の種別（`type`）の定義を新設し、実装上の許容値および業務上の使い分けを記述した。

## 3. 申し送り

- 根拠の範囲: エビデンスは `src/register/register.ts` だけだが、そこが re-export している `VALID_TYPES` の定義が `src/register/item.ts` にあるため、`item.ts`・`core.ts`（`validateFields` による type 検証）・`views.ts`（分類別の派生ビュー）も読んだ。いずれも未編集で、`evidence_refs` に含まれていない未確認範囲として記録する。
- 実装だけを根拠にした記述: 関連仕様の章にある『分類から派生ビューへの振り分け』（`views.ts`）と『既定の commit 種別マッピング』（`item.ts` の `DEFAULT_ITEM_TYPE_COMMIT_TYPE_MAP`）は現在の動作のみを根拠としており、承認済み仕様での裏付けを確認していない。成果物に残すかどうかはレビューでの判断を要する。
- 後続の更新候補: `stsd-register-entry` の M-04 には `bdd-register-entry` が未作成と書かれているが、辞書はすでに存在する。stsd の更新は別タスクとして扱う。
- 実装と仕様の値の乖離はない（todo/epic/question/risk/issue/change-request/decision/note が実装・schema・BDD で一致）。
- 適用外の検証: `npm run validate:catalog`（変更ファイルは docs/ja/product/ 配下のみで、docs/ja/projects/ 配下の成果物を変更していないため適用外）
- 適用外の検証: `npm run validate:history-links`（plan/result/個票などの履歴蓄積ファイルを変更していないため適用外）
- 適用外の検証: `npm run validate:schema:file`（変更ファイルは Markdown のみで、`*.yaml` / `*.yml` を変更していないため適用外）

## 4. 進め方と実践の型の適用

retrofit
