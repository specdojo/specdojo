---
specdojo:
  id: prj-0001:xer-t-launch-pm-roles-120
  type: exec-result
  task_id: T-LAUNCH-pm-roles-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-LAUNCH-pm-roles-120-plan.md
  started_at: "2026-06-30T14:43:48.398Z"
  completed_at: "2026-06-30T14:50:25.658Z"
  agent: claude-edit-agent
  approach: sample-maintenance
  targets:
    - prj-0001:pm-roles
    - pm-roles-sample
---

# Edit Result

## 1. 実施内容

- 参照の向きを「成果物 → sample」に切り替え、[[pm-roles-sample|ロール定義 サンプル]] を見直し対象として、approve 済みの完成版 [[prj-0001:pm-roles|ロール定義]]、その review result `T-LAUNCH-pm-roles-090-result.md`、[[pm-roles-rulebook|ロール定義 作成ルール]]、`pm-roles-template.yaml`、隣接 sample（`pm-organization-sample.md`、`pm-members-sample.yaml`）の慣行を根拠に妥当性を確認した。
- 構成（`id`/`type`/`status`/`based_on`/`version`/`project_id`/`roles[].code,name,project_note`）、Role code の標準順（PO→PM→BA→ARC→DEV→QE→UX→OPS）、member nickname・agent 名・個人名・兼務割り当てを含めない記述、業務文脈が `共通サンプル文脈`（駄菓子屋きぬや）に統一されている点は rulebook・sample-authoring-standard と整合しており、書き直しの必要はないと判断し維持した。
- 完成版 `pm-roles.yaml` と `pm-roles-template.yaml` はいずれも `roles:` 直前に、共通定義・兼務割り当て・採用方針の正本所在を示す 3 行のコメント（`# ... を参照する。`）を置いているが、sample にはこのコメントがなく、粒度・文体の完成例として手本になっていなかった。完成版・template と同一文面のコメントを sample にも追加し、「このファイルに書かない情報がどこにあるか」を示す書き方を完成例として揃えた。
- 完成版 `pm-roles.yaml`・隣接 sample（`pm-members-sample.yaml` の `note`、`pm-organization-sample.md` の本文）の `project_note`/説明文はすべて句点「。」で終わっているのに対し、sample の `roles[].project_note` 8 件は句点を欠いていた。文体の完成例としての一貫性を欠く表記ゆれと判断し、全 8 件に句点を補った。内容（業務文脈、専任化条件、公開判断上の注意）自体は完成版の粒度と整合しており、書き換えなかった。
- 上記以外（Role code の語彙、project_note が示す責務・専任化条件・公開判断上の注意の内容、配置順）は、完成版・review result・recipe・隣接 sample のいずれとも矛盾せず、丸写しでもない適切な粒度の完成例になっていたため維持した。
- 整形・スキーマ検証として、共通規約に従い `npx prettier --write` と `npm run validate:schema:file -- --schema docs/specdojo/schemas/v1/pm-roles.schema.yaml --data <対象ファイル>` を実行し、いずれも問題なし（prettier: unchanged、schema: valid）であることを確認した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pm-roles-sample.yaml`
- `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-pm-roles-120-result.md`

## 3. 申し送り

- sample の `id`（`prj-0001:pm-roles`）と `based_on`（`prj-0001:pm-organization` など）は、実プロジェクト `prj-0001` の実成果物と同一の ID 表記になっている。これは隣接 sample（`pm-members-sample.yaml`）にも共通する既存の慣行であり、本タスクの見直し範囲（`pm-roles-sample.yaml` 単体の粒度・文体・完成例としての妥当性）を超えて複数 sample 間の ID 設計に踏み込む変更になるため、本タスクでは変更せず申し送りとする。ID 設計の見直しが必要と判断される場合は、`pm-roles-sample.yaml` 単独ではなく、`pm-organization-sample.md`/`pm-members-sample.yaml` を含む sample 群一式で `sample-maintenance` または `bootstrap` の範囲を再検討することを推奨する。

## 4. 参考資料の活用

- `approach: sample-maintenance` のため、`specdojo-reference-materials-guide.md` の「参考資料メンテナンスの進め方」に従い、参照の向きを「成果物 → sample」に切り替えた。見直す対象は [[pm-roles-sample|ロール定義 サンプル]] とし、主な見直し観点は「粒度、文体、表の書き方、完成例としての妥当性」とした。
- 根拠とした成果物・review result は次のとおり実際に読み込んだ。
  - 完成版 [[prj-0001:pm-roles|ロール定義]]: approve 済みの実成果物として、コメントの書き方、`project_note` の句点の有無などの文体を比較する一次根拠にした。
  - `T-LAUNCH-pm-roles-090-result.md`（review result）: RVP-001（PO）/RVP-002（ARC）/RVP-003（QE）すべて pass・findings なしで承認済みであることを確認し、完成版の構造・内容自体を比較対象として信頼できると判断した根拠にした。
  - [[pm-roles-rulebook|ロール定義 作成ルール]]: 本文構成（§5）、記述ガイド（§6）、禁止事項（§7）を、sample の構造・記述が満たすべき正本として参照した。改訂判断における優先順位は rulebook を正とした。
  - `pm-roles-template.yaml`: `roles:` 直前のコメント文面が完成版と一致していることを確認し、コメント追加の根拠にした。
  - `pm-organization-sample.md`/`pm-members-sample.yaml`: 同じ駄菓子屋きぬや文脈・YAML 系成果物の隣接 sample として、句点の付け方や人物名を使わない記述などの文体慣行を確認する根拠にした。
- 複数の参考資料間に構造的な矛盾はなく、rulebook を正として上書きする必要が生じた箇所はなかった。
- sample の `id`/`based_on` の ID 表記が実プロジェクトの実成果物と重複している点は、隣接 sample にも共通する既存設計であり、本タスク単独の根拠だけでは改訂の要否を判断できなかったため、推測で変更せず「3. 申し送り」に事実と判断を記録した。
