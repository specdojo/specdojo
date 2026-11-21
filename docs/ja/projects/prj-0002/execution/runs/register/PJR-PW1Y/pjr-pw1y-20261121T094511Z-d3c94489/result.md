---
specdojo:
  id: prj-0002:xer-pjr-pw1y-20261121t094511z-d3c94489
  type: exec-result
  task_id: PJR-PW1Y
  mode: edit
  status: blocked
  project_id: prj-0002
  origin: register
  plan_ref: runs/register/PJR-PW1Y/pjr-pw1y-20261121T094511Z-d3c94489/plan.md
  started_at: "2026-11-21T09:45:11.523Z"
  completed_at: "2026-11-21T09:55:26.451Z"
  agent: opus-executor
  block_reason: "executor validation failed or not run: npm run validate:history-links"
---

# Edit Result

## 1. 実施内容

- `specdojo-philosophy` に章「分野: Continuous Specification Engineering」を追加し、定義の文、近い概念との関係、および略称の扱い（愛称の Spec道 を使用し、CSE という略称は避ける方針）を記述した。
- 反映作業として、README (`PJR-P8G7`)、概要ガイド (`PJR-KGH2`)、specdojo-lp (`PJR-T1TH`) に対する todo を起票した。
- 個票 `PJR-PW1Y` の作業内容と対応結果を更新した。

## 2. 変更ファイル

- `docs/ja/specdojo/philosophy/specdojo-philosophy.md`: 分野「Continuous Specification Engineering」に関する定義、近い概念との関係、および略称の扱いに関する章を追加した。

## 3. 申し送り

- 正本は `specdojo:specdojo-philosophy` の章「分野: Continuous Specification Engineering」に置いた。概要ガイドではなくここにした理由（philosophy の役割に合う、概要ガイドは入口の文書で status が `ready`、新しいガイドにすると内容が重なる）は個票 `PJR-PW1Y` の対応結果に書いた。
- 略称は設けず、短く呼ぶときは愛称の Spec道 を使うと決めた（CSE は既存の略称とぶつかる、CSpE などの造語は伝わらない、短い呼び名は愛称が担っている）。
- `_ASSUMPTION_:` 定義の文（日本語と英語）と関係の表は、BA が `PJR-WBWX` と個票の入力から起草した案である。文言は人間のレビューで確定する。`specdojo-philosophy` は `draft` のまま。
- 反映の todo `PJR-P8G7`・`PJR-KGH2`・`PJR-T1TH` の期限は未定（`due_on: null`）。`register add` を実行しても `pjr-index.md` の行は変わらなかったため、一覧への追加は runner による `register` の再生成で行う。
- `register add` が `events/pjr-pw1y.yaml` の引用符だけを書き直していたため、index 側の内容へ戻した（意味は変わらない）。
- `npm run validate:history-links` は exit 1。今回変更していない `pjr-9tsg-lp-changelog-release-2026-11-02.md` と `PJR-9TSG` の plan に、既存の違反（ラベル付きの外部 URL）がある。今回変更・作成した個票は valid。
- 正本は `specdojo:specdojo-philosophy` の章「分野: Continuous Specification Engineering」に置いた。概要ガイドではなくここにした理由（philosophy の役割に合う、概要ガイドは入口の文書で status が `ready`、新しいガイドにすると内容が重なる）は個票 PJR-PW1Y の対応結果に書いた。
- `_ASSUMPTION_:` 定義の文（日本語と英語）と関係の表は、BA が PJR-WBWX と個票の入力から起草した案である。文言は人間のレビューで確定する。`specdojo-philosophy` は `draft` のまま。
- 反映の todo PJR-P8G7・PJR-KGH2・PJR-T1TH の期限は未定（`due_on: null`）。`register add` を実行しても `pjr-index.md` の行は変わらなかったため、一覧への追加は runner による register の再生成で行う。
- `npm run validate:history-links` は exit 1。今回変更していない `pjr-9tsg-lp-changelog-release-2026-11-02.md` と PJR-9TSG の plan に、既存の違反（ラベル付きの外部 URL）がある。今回変更・作成した個票は valid。

## 4. 進め方

``specdojo-philosophy`` を正本として、分野の定義と略称の扱いを明文化した。今後の反映漏れを防ぐため、影響範囲となる各成果物への todo を個票に記録した。
