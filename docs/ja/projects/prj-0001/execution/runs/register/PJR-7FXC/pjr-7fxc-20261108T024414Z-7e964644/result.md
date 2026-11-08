---
specdojo:
  id: prj-0001:xer-pjr-7fxc-20261108t024414z-7e964644
  type: exec-result
  task_id: PJR-7FXC
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-7FXC/pjr-7fxc-20261108T024414Z-7e964644/plan.md
  started_at: "2026-11-08T02:44:36.659Z"
  completed_at: "2026-11-08T03:02:56.581Z"
  agent: flash-high-executor
  approach: rulebook-maintenance
  targets:
    - specdojo:cdt-rulebook
---

# Edit Result

## 1. 実施内容

- 分類一覧（CDT）の型定義における正本参照の規約を策定し、`docs/ja/specdojo/rulebooks/cdt-rulebook.md` を更新しました。
- 値の列挙を避け、業務上の意味と使い分けに特化する記述方針を定義しました。
- `docs/ja/specdojo/samples/cdt-sample.md` を新しい規約に適合するように更新しました。
- `CHANGELOG.md` に今回の型の変更に関する記述を追加しました。

## 2. 変更ファイル

- `CHANGELOG.md`: 型定義の変更に関する履歴を追加しました。
- `docs/ja/specdojo/rulebooks/cdt-rulebook.md`: 分類定義における正本参照の記述方式（`schema_ref` や `type_ref` の使用）と、値ごとの業務上の意味・使い分けに特化した記述規則、およびスタンドアロン定義の際の構成ルールを追記しました。
- `docs/ja/specdojo/samples/cdt-sample.md`: 新しく策定された `cdt-rulebook` の記述ルールに従い、正本参照を用いた記述形式に修正しました。

## 3. 申し送り

- スキーマ変更の有無と理由: 変更なし。分類一覧（CDT）は Markdown ドキュメント形式（`target_format:` markdown）として管理されており、docs/specdojo/schemas/v1/ 配下に直接 CDT の本文構造を制約する YAML スキーマは存在しないため、スキーマの変更は不要でした。既存の frontmatter スキーマ（type: data）により完全な後方互換性が維持されています。
- 決定事項と判断理由（PJR-RZ9Q 申し送り）: 正本参照の記述方式として、分類定義表内に `schema_ref`: &lt;path&gt;#&lt;pointer&gt;（スキーマ参照）、`type_ref`: &lt;path&gt;#&lt;TypeName&gt;（TypeScript 型参照）、または「なし（スタンドアロン定義）」を明記する規約としました（BDD の選定およびカタログの `evidence_refs` と統一）。正本参照がある場合の値表は「値」「分類名」「業務上の意味と使い分け」の 3 列構成とし、コード定義の機械的再掲を避けて使い分けの判断基準に特化する方針としました。実装にない業務上の分類（人が決める区分など）は「値」「分類名」「表示形式」「説明・成立条件」の 4 列構成によるスタンドアロン記述としました。
- 決定事項と判断理由（PJR-RZ9Q 申し送り）: 正本参照の記述方式として、分類定義表内に `schema_ref:` &lt;path&gt;#&lt;pointer&gt;（スキーマ参照）、`type_ref:` &lt;path&gt;#&lt;TypeName&gt;（TypeScript 型参照）、または「なし（スタンドアロン定義）」を明記する規約としました（BDD の選定およびカタログの `evidence_refs` と統一）。正本参照がある場合の値表は「値」「分類名」「業務上の意味と使い分け」の 3 列構成とし、コード定義の機械的再掲を避けて使い分けの判断基準に特化する方針としました。実装にない業務上の分類（人が決める区分など）は「値」「分類名」「表示名」「説明・成立条件」の 4 列構成によるスタンドアロン記述としました。

## 4. 進め方と実践の型の適用

分類一覧の型定義において、実装コードの機械的な再掲を廃止し、業務上の意味と使い分けを記述するための正本参照規約を `cdt-rulebook` に導入しました。これに伴い、サンプルである `cdt-sample` および `CHANGELOG.md` を更新しています。
