---
specdojo:
  id: prj-0001:xer-t-kata-slim-prj-charter-050-20261117t203438z-068b76f1
  type: exec-result
  task_id: T-KATA-SLIM-prj-charter-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-prj-charter-050/T-KATA-SLIM-prj-charter-050-20261117T203438Z-068b76f1/plan.md
  started_at: "2026-11-17T20:34:47.639Z"
  completed_at: "2026-11-17T21:03:26.667Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:prj-charter
    - specdojo:prj-charter-sample
---

# Edit Result

## 1. 実施内容

- `prj-charter-sample` から文書運用の記述と同じ判断の言い直しを外し、grade の finding F001〜F011 に対応した。
- 大きさは空白と表の区切り行を除いて 3,095 字から 2,813 字（91%）になった。7 割の目安には届かない。もともと役割・承認と agent・文書品質の行がなく、削る余地が小さかった。一方、finding 対応で wikilink、合格条件、AI Agent の支援範囲、ライセンス、秘密情報の記述を足したため。
- executor が実行した `npm run docs:build` は成功した。runner が実行した `lint:fm`、`lint:md`、`lint:mermaid`、`lint:d2`、`validate:schema`、`test:unit`、`test:integration` も成功した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/prj-charter-sample.md`: 未決事項の表から管理台帳の列（期限・担当）と初回承認日の行を外し、「論点・影響・当面の扱い」にして期限条件を当面の扱いへ書いた。「本書はドラフト」の段落（F011）、目的・初期ステークホルダー・前提制約の再掲文を外した。スコープの対象は 2 行（業務と AI Agent）にまとめ、AI Agent の支援範囲（F003・F007）を足した。GO / Not GO の表に合格条件の列を足した（F001）。ライセンス方針の確定（F004）と秘密情報・非公開組織情報の禁止（F005）を足した。参照先は `[[specdojo:...-sample|...]]` の wikilink にした（F006・F009）。初期ステークホルダーは登録簿 sample の ID・Role code に合わせた（F008・F010）。

## 3. 申し送り

- recipe（`docs/ja/specdojo/recipes/prj-charter-recipe.md`）は開発担当を PM とする前提で書かれており、直した sample の `DEV` と食い違う。実行責任者の Role code はメンバー定義に従う書き方へ寄せる変更案を、executor が出している。この段では recipe を変更していない。
- template（`docs/ja/specdojo/templates/prj-charter-template.md`）に未決事項の列が期限・担当で残っていれば、「論点・影響・当面の扱い」へ寄せる変更案を、executor が出している。この段では template を変更していない。
- 開発担当の Role code を `PM` から `DEV` へ、家族利用者を `BA` から `-` へ変えた。常連客・仕入れ先を外して技術メンターを足した。これらは結論の変更だが、直接根拠の登録簿 sample に合わせるための変更である（F008・F010）。
- 大きさ（空白と表の区切り行 `| --- |` を除いた文字数）: 3,095 字から 2,813 字（91%）。7 割の目安に届かない理由: この sample には役割の段落、承認と agent の段落、文書品質の検証の行がもともとなかった。一方で finding の対応で、wikilink（`[[id|表示名]]`）約 618 字、GO / Not GO の合格条件の列、AI Agent の支援範囲、ライセンス、秘密情報・非公開組織情報を足した。
- 外した記述: 未決事項の表の管理台帳の列（期限・担当）を外し「論点・影響・当面の扱い」にした。初回承認日の行は「認可対象」の認可条件の行と「承認」の表の言い直しのため外した。「承認」の章の「本書はドラフト…」の段落を外した（F011。認可条件の行が同じ判断を持つ）。目的の章の概要の再掲の文、初期ステークホルダーの章の登録簿への参照の文、前提・制約の章の前置き文を外した。スコープの対象の行を 3 行から 2 行（業務と AI Agent）にまとめた。
- finding への対応: F001 は GO / Not GO の表に合格条件の列を足した。F002 は未決事項の当面の扱いに「詳細計画の承認前」「GO / Not GO の前」の期限条件を書いた。F003・F007 はスコープに AI Agent の支援範囲（草案作成・整理・検証の支援、承認と最終判断は人間）を足し、詳細化先を組織定義にした。F004 は留保する判断にライセンス方針の確定を足した。F005 は公開文書の禁止に秘密情報・非公開組織情報を足した。F006・F009 は参照先を `[[specdojo:...-sample|...]]` の wikilink にした（overview、stakeholder-register、success-criteria、scope、pm-organization、dct-index、assumptions、pm-plan、pm-raci、pm-quality-management-plan）。F008・F010 は初期ステークホルダーを登録簿 sample に合わせた（`STH-SHOP-OWNER`/`PO`、`STH-DEVELOPER`/`DEV`、`STH-TECH-MENTOR`/-、`STH-FAMILY-USER`/-）。F011 はドラフトの段落を外し、認可条件を「未承認として扱う」と書いた。
- 結論の変更と理由: 開発担当の Role code を `PM` から `DEV` に、家族利用者を `BA` から `-` に変え、常連客・仕入れ先を外して技術メンターを足した（F008・F010。直接根拠の登録簿 sample に合わせるため）。権限委譲の実行責任者も 開発担当（`DEV`）に合わせた。GO / Not GO の体制の観点は「PO・PM・BA の責任範囲」から「各作業の責任者が 1 人に決まり、承認の決裁者が店主代表」に変えた（F001）。未決事項に期限条件を足し、初回承認日の行を外した。認可対象、認可しない範囲、予算枠の扱い（確定まで外部支出なし）、未決の論点（費用上限、リリース目標日、オフライン時の扱い）は変えていない。
- 変更案（この段では対象外）: recipe（`docs/ja/specdojo/recipes/prj-charter-recipe.md`）は「PM などへ委譲する権限」「PM に委譲してよい判断」と、開発担当を PM とする前提で書かれている。直した sample（`DEV`）と食い違うため、実行責任者の Role code はメンバー定義に従う書き方に寄せる案を出す。template（`docs/ja/specdojo/templates/prj-charter-template.md`）には役割の段落、承認と agent の段落、文書品質の行はない。未決事項の列が期限・担当になっていれば、論点・影響・当面の扱いへ寄せる案。
- executor は `npm run docs:build` を実行し、ビルドの完了（build complete）を確かめた。lint:md などの検査は親の runner に任せた。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/prj-charter-sample.md だけで、plan・result・個票を含まない）

## 4. 進め方と実践の型の適用

根拠は直した rulebook、直接根拠の overview と stakeholder-register の sample、手本の `sld-sample.md` である。運用の記述と言い直しを外し、同じ判断は 1 か所に寄せた。finding 11 件は、rulebook と登録簿 sample を正として修正した。認可対象・認可しない範囲・予算枠の扱い・未決の論点は維持した。7 割の目安に届かなかった理由は summary に記した。recipe と template は commit 対象外のため変更せず、変更案を handoff に残した。
