---
specdojo:
  id: prj-0001:xer-t-kata-review-all-otp-sample-120-20261125t010333z-660ad5e3
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-otp-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-otp-sample-120/T-KATA-REVIEW-ALL-otp-sample-120-20261125T010333Z-660ad5e3/plan.md
  started_at: "2026-11-25T01:03:41.945Z"
  completed_at: "2026-11-25T01:12:11.792Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:otp-sample
    - specdojo:otp-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）のレビューを行った。`otp-sample` の章の順・見出しは rulebook の本文構成 11 章と一致していた。直した箇所は 1 件で、「6. 問合せ窓口/一次対応」のエスカレーション条件の位置である。
- otp の template が `docs/ja/specdojo/templates/` にないため、構成は rulebook だけで照合した。
- 実施内容の指摘は次の表のとおり。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R2-1 | R2 | 6. 問合せ窓口/一次対応 / エスカレーション条件 | エスカレーション条件（P1・P2、金額や連絡先に関わる P3、2 営業日を過ぎた未解決）が問合せ記録の表の後に置かれていた。rulebook の本文要件（窓口・受付時間・チャネル・一次対応範囲・エスカレーション条件）の順を、表が分断していた。 | 「エスカレーション条件:」の箇条として一次対応の範囲の直後へ移し、子の箇条 3 つにまとめた。問合せ記録の表は章の最後に置いた。 | `vp-arc-document-structure` | - | | R2-2 | R2 | 全体（章構成） | 11 章の順・見出しは rulebook の本文要件と一致していた。各章で表の前に 1 文、表の後に補足という配置もそろっていた。「2. 監視/アラート」で「8.」の当番表を先に参照しているが、章の順を rulebook が決めているため動かさない。 | 変更なし | `vp-arc-document-structure`、`vp-qe-omissions-consistency` | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/otp-sample.md`: 「6. 問合せ窓口/一次対応」で、エスカレーション条件を一次対応の範囲の直後へ移し、子の箇条 3 つにまとめた。問合せ記録の表は章末に置いた。差分は 4 行追加・7 行削除である。

## 3. 申し送り

- otp の template は `docs/ja/specdojo/templates/` にない。template を作るかどうかは型の schedule で判断する。
- R2-1: R2 / 6. 問合せ窓口/一次対応 / エスカレーション条件（P1・P2、金額や連絡先に関わる P3、2 営業日を過ぎた未解決）が問合せ記録の表の後に置かれ、rulebook の本文要件（窓口・受付時間・チャネル・一次対応範囲・エスカレーション条件）の順を問合せ記録の表が分断していた / 「エスカレーション条件:」の箇条として一次対応の範囲の直後へ移し、子の箇条 3 つにまとめた。問合せ記録の表は章の最後に置いた / vp-arc-document-structure / -
- R2-2: R2 / 全体（章構成） / 11 章の順・見出しは rulebook の本文要件と一致し、各章で表の前に 1 文、表の後に補足という配置もそろっている。2. 監視/アラートで 8. の当番表を先に参照しているが、章の順を rulebook が決めているため動かさない / - / vp-arc-document-structure、vp-qe-omissions-consistency / -
- 申し送り: otp の template は docs/ja/specdojo/templates/ にない。このため、R2 の照合は rulebook の本文構成だけで行った。template を作るかどうかは型の schedule で判断する。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/otp-sample.md のみで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がない）

## 4. 進め方と実践の型の適用

根拠は rulebook の本文構成（11 章）と、`otp-sample` の frontmatter から辿れる `otp-index-sample` である。構成は rulebook を正として照合した。章の順と見出しは一致していたため維持し、「6. 問合せ窓口/一次対応」の要素の順だけを rulebook の本文要件に合わせた。rulebook など sample 以外は変更していない。R1 の指摘は繰り返していない。plan に展開された grade の finding と、成果物から届いた Kata 起因の finding はなく、根拠不足で見送った項目もない。executor の検査では、prettier と markdownlint が通った。runner の検査では、`lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通った。
