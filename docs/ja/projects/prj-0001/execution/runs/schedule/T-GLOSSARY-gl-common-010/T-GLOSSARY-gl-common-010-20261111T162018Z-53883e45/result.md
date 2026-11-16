---
specdojo:
  id: prj-0001:xer-t-glossary-gl-common-010-20261111t162018z-53883e45
  type: exec-result
  task_id: T-GLOSSARY-gl-common-010
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-GLOSSARY-gl-common-010/T-GLOSSARY-gl-common-010-20261111T162018Z-53883e45/plan.md
  started_at: "2026-11-11T16:20:19.874Z"
  completed_at: "2026-11-11T16:35:04.339Z"
  agent: sol-executor
  execution: agent
  approach: retrofit
  targets:
    - gl-common
---

# Edit Result

## 1. 実施内容

- 共通用語集を「部分反映」により更新し、6語の追加および定義・別名・関連・出典の補強を行いました。
- 実装エビデンス（`src/specdojo.ts`、各種 `schema.yaml`）を調査し、文書成熟度、項目の処理状態、タスクの起点とモードの区別などの現在動作を反映しました。
- Schema 等で定義された条件付き項目については、詳細な条件式を複製せず、関係性の要約と `schema` への参照として記述しました。
- 意図された仕様（`prj-overview.md` 等）と照合し、Schedule の英語名訂正や track の管理単位としての区別を維持しました。
- 実装・仕様間で乖離が確認された `docs/ja/specdojo/guides/schedule-design-guide.md` の責務分担表については、本タスクでは用語集側を正本として整合させ、ガイドの修正は後続の finding 候補として申し送りました。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/060-glossary/gl-common.yaml`: 既存構造と用語 ID を維持しつつ、作成規範・作成手順・記述例・雛形・タスク・文書成熟度を追加し、分類と関連用語を補強。また、条件付き項目の `schema` 参照を反映。

## 3. 申し送り

- reporter 記録用: 変更ファイルは `docs/ja/product/010-business-specs/060-glossary/gl-common.yaml` のみ。既存構造と用語 ID を維持する「部分反映」を選択した。作成規範・作成手順・記述例・雛形・タスク・文書成熟度を追加し、分類と関連用語を補強した。`status` は draft のまま。result は pipeline 指示に従い編集していない。
- 参照した実装エビデンス: `src/specdojo.ts` は catalog・register・schedule・exec・routine・job・grade・kata 等のコマンド登録を各モジュールへ委譲している。個別コマンド名・引数・処理分岐はこのファイルだけでは確認できず、列挙外の実装は追加調査していない。
- 参照した実装エビデンス: `docs/specdojo/schemas/v1/register-item-frontmatter.schema.yaml` は文書成熟度と項目の処理状態を区別し、epic と track、閉鎖状態と完了日時、進め方と対象・参照元の条件付き関係を定義する。用語集には関係の要約と `schema` 参照を反映し、条件式は複製していない。
- 参照した実装エビデンス: `docs/specdojo/schemas/v1/exec-common.schema.yaml` はタスクの起点（schedule・register・job）、作業モード（edit・review）、進め方等を定義する。起点とモードの区別を反映した。一方、タスク状態一覧や event・trial・evidence の記録構造は定義されておらず、実装から確認不能として残す。
- 参照した実装エビデンス: `docs/specdojo/schemas/v1/sch-common.schema.yaml` は track、タスク、担当、期間、依存、マイルストーン、段の識別情報を定義し、タスクに実行状態を持たせていない。ゲートの定義や生成条件は含まれないため未確認。領域固有の詳細は後続の `gl-planning` で宣言済みエビデンスから調査する。
- 意図された仕様との照合: `prj-overview.md` の人と AI が共有できる正本という判断軸、`cdfd-overview.md` のデータストア定義、PJR-BB92 の Schedule と実行状態の責務分担、PJR-S64H の記帳・起票の区別を維持した。Schedule の英語名を schedule に訂正し、track は管理単位として区別した。
- 未反映の乖離: `docs/ja/specdojo/guides/schedule-design-guide.md` の責務分担表は Schedule がタスク実行状態を持つと記述し、CDFD・PJR-BB92・指定 `schema` と食い違う。本タスクでは用語集に計画と実行記録の責務分担を反映し、ガイドは変更していない。後続 finding としてガイド修正を検討する。
- スコープの申し送り: 最新カタログは領域別用語集への分割を指定している。種類・状態値・ゲート等を共通用語集へ追加しなかった。既存の記帳・起票などは決定済み定義と ID を保持したため、領域別用語集の新設時に既存用語の配置を調整し、重複定義を避けること。routine・job・grade 等の詳細動作も指定エビデンスのみでは確認できず、既存仕様を保持した。
- 参照記法: プロジェクト文書と SpecDojo 文書は修飾済み ID を使用した。プロダクト文書 `cdfd-overview` は frontmatter と既存索引の正式 ID が未修飾のため、存在する ID によるリンクを使用した。文書 ID を持たない規約断片と `schema` はコード形式のパスで参照した。親 runner 所有の検査と Git 操作は実行していない。
- 参照した実装エビデンス: `docs/specdojo/schemas/v1/register-item-frontmatter.schema.yaml` は文書成熟度と項目の処理状態を区別し、epic と track、閉鎖状態と完了日時、進め方と対象・参照元の条件付き関係を定義する。用語集には関係の要約と schema 参照を反映し、条件式は複製していない。
- 未反映の乖離: `docs/ja/specdojo/guides/schedule-design-guide.md` の責務分担表は Schedule がタスク実行状態を持つと記述し、CDFD・PJR-BB92・指定 schema と食い違う。本タスクでは用語集に計画と実行記録の責務分担を反映し、ガイドは変更していない。後続 finding としてガイド修正を検討する。
- 参照記法: プロジェクト文書と SpecDojo 文書は修飾済み ID を使用した。プロダクト文書 `cdfd-overview` は frontmatter と既存索引の正式 ID が未修飾のため、存在する ID によるリンクを使用した。文書 ID を持たない規約断片と schema はコード形式のパスで参照した。親 runner 所有の検査と Git 操作は実行していない。
- 適用外の検証: `npm run validate:catalog`（executor の変更はプロダクト配下の用語集のみで、`docs/ja/projects/` 配下に変更がない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票や既存 plan・result 等の履歴ファイルを変更していない。）

## 4. 進め方と実践の型の適用

retrofit
