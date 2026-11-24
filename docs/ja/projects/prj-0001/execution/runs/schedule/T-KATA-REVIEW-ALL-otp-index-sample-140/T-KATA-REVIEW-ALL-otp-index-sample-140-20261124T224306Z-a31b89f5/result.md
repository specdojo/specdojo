---
specdojo:
  id: prj-0001:xer-t-kata-review-all-otp-index-sample-140-20261124t224306z-a31b89f5
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-otp-index-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-otp-index-sample-140/T-KATA-REVIEW-ALL-otp-index-sample-140-20261124T224306Z-a31b89f5/plan.md
  started_at: "2026-11-24T22:43:19.472Z"
  completed_at: "2026-11-24T22:55:56.868Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:otp-index-sample
    - specdojo:otp-index-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）の段として、`otp-index-sample` の記述を schema・関連 sample（`cop-index-sample`、`mip-index-sample`、`dmd-index-sample`、`otp-sample`）と突き合わせた。
- 誤りは 1 件だった。「権限/アカウント移行」のアカウント発行時期が `cop-index-sample` の手順 4 と 5 と食い違っていたため、直した。
- F001（`opr-*` 分冊への導線がない）は前の段で、関連ドキュメントに `opr-sales`、`opr-credit`、`opr-daily-closing`、`opr-shift-handover` が足されて解消済み。この段では追加の変更をしていない。
- `npx prettier --check` と runner の検査（`lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema`）はすべて passed。`lint:ts`、`lint:md`、`lint:fm`、`test:integration`、`typecheck`、`test:unit` は変更種別により `not_applicable`。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/otp-index-sample.md`: 「権限/アカウント移行」を直した。アカウントの発行を「取り込みの後」としていたが、`cop-index-sample` の手順 4 では取り込みの前に権限を確かめる。そこで、発行と権限の設定を「取り込む前」に改め、検証は「取り込みの後の動作確認で」行うと書いた（2 行の差し替え）。

## 3. 申し送り

- R4 の確かめの表は executor の handoff に残っている（10 項目のうち 9 項目が一致、アカウントの発行時期の 1 項目が不一致で修正済み）。確かめられなかった主張はない。
- 要判断（R5 向け）: 「5. 運用手順の変更点」の参照列にある `opr-sales`、`opr-credit`、`opr-daily-closing`、`opr-shift-handover` が `opr-index-sample` に出てこない（そこにあるのは `opr-incident` だけ）。`opr-index-sample` 側に分冊を足すか、こちらの名前を合わせるかを決める必要がある。
- 要判断（R5 向け）: `cop-index-sample` の手順 8 では店主代表と家族利用者代表が記録して取り消すが、この sample では家族利用者代表は販売を取り消せない。手順 8 に取り消すのは店主代表と明記する案がある。
- R4-1: R4 / 4. 権限/アカウント移行 / アカウントの発行を「取り込みの後」としていたが、cop-index-sample では取り込みの前の手順 4 で権限を otp-index に従って確かめる / 発行と権限の設定を「取り込む前」に改め、検証は「取り込みの後の動作確認で」行うと書いた / vp-arc-technical-constraints、vp-qe-verifiability（正本: cop-index-sample の手順 4 と 5） / -
- R4-2: R4 / 11. 関連ドキュメント（必須） / F001（`opr-*` の分冊への導線がない）は前の段で opr-sales・opr-credit・opr-daily-closing・opr-shift-handover が足されて解消済み / - / vp-qe-omissions-consistency / -
- R4-3: R4 / 5. 運用手順の変更点 / 参照列の opr-sales・opr-credit・opr-daily-closing・opr-shift-handover が opr-index-sample に出てこない（そこにあるのは opr-incident だけ） / -（R5 で、opr-index-sample 側に分冊を足すか、こちらの名前を合わせるかを決める） / vp-dev-change-impact / 要判断
- R4-4: R4 / 4. 権限/アカウント移行 / cop-index-sample の手順 8 では店主代表と家族利用者代表が記録して取り消すが、この sample では家族利用者代表は販売を取り消せない / -（R5 で、cop-index-sample の手順 8 に取り消すのは店主代表と明記する案を検討する） / vp-qe-verifiability / 要判断
- R4 確かめの表（主張 / 正本 / 結果）: 1 specdojo.type: operations / docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml 17 行目 / 一致。2 rulebook と `based_on` の ID / 各 sample と rulebook の frontmatter / 一致。3 11 章の構成と禁止事項 / otp-index-rulebook の本文要件と禁止事項 / 一致。4 アカウントの発行時期 / cop-index-sample の手順 4 と 5 / 不一致のため直した。5 並行記録 1 週間の後に GO4 で正本切替、ハイパーケア 2 週間、SLA は当日の閉店後まで / mip-index-sample の T+7 日の行と移行後ハイパーケア方針 / 一致。6 復旧の条件 / cop-index-sample の GO3 / 一致。7 転記用の表は正本切替の後に裁断 / mip-index-sample 25 行目 / 一致。8 旧ノートの保管期間は `_UNDECIDED_` / dmd-index-sample 51 行目 / 一致。9 店舗運営アドバイザーの聞き取り / mip-index-sample 93 行目 / 一致。10 分冊 otp-hypercare / otp-sample の H1 と概要（hypercare） / 一致。

## 4. 進め方と実践の型の適用

sample-maintenance の R4 として、sample の事実主張（`specdojo.type`、`rulebook` と `based_on` の ID、11 章の構成と禁止事項、並行記録・正本切替・ハイパーケア・SLA の値、復旧条件、旧ノートの保管期間、分冊名）を、schema、`otp-index-rulebook` と関連 sample に突き合わせた。不一致だったアカウント発行時期だけを `cop-index-sample` の手順 4 と 5 に合わせて直した。F001 は前の段で解消済みのため再修正していない。関連 sample 側の食い違い 2 件は、確証のない推測で直さず、R5 の判断に回した。`status` は `draft` のまま据え置いた。
