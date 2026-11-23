---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-opr-incident-sample-050-20261123t175335z-06cad1eb
  type: exec-result
  task_id: T-KATA-WAVE-5-opr-incident-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-opr-incident-sample-050/T-KATA-WAVE-5-opr-incident-sample-050-20261123T175335Z-06cad1eb/plan.md
  started_at: "2026-11-23T17:53:38.770Z"
  completed_at: "2026-11-23T18:07:30.405Z"
  agent: opus-executor
  execution: agent
  approach: fully-guided
  targets:
    - specdojo:opr-incident-sample
---

# Edit Result

## 1. 実施内容

- &lt;code&gt;docs/ja/specdojo/samples/opr-incident-sample.md&lt;/code&gt; を、&lt;code&gt;opr-rulebook&lt;/code&gt; の章構成および共通サンプル文脈（駄菓子屋きぬや 販売管理システム）に沿った完成例として全面的に書き直しました。
- Frontmatter の `rulebook` を `specdojo:opr-rulebook` に、`based_on` を実在する `specdojo:opd-incident-management-sample` に修正しました。
- Grade 指摘（F001〜F024, F026）に基づき、システムスコープの明示、障害対応表の構成改善（SLA 起点、目標値の追記、エスカレーション先の Role code 適用）、および &lt;code&gt;opr-rulebook&lt;/code&gt; が定める必須章（適用範囲・前提、定期点検、アラート対応、バックアップ、バッチ、変更、アカウント、問い合わせ）の追加を行いました。
- ``F025``（draft から ready への移行基準）については、PJR-76N9 の規定に基づき、文書の本文には含めず申し送り事項として扱いました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-incident-sample.md`: &lt;code&gt;opr-rulebook&lt;/code&gt; の 12 章構成および共通サンプル文脈に沿った完成例への書き換え。章構成の修正、必須要素（スコープ、SLA 起点、目標値、各種手順の章）の追加、および Role code を用いたエスカレーション定義の改善を行いました。

## 3. 申し送り

- frontmatter の `based_on` を存在しない `opd-incident-management` から実在する `specdojo:opd-incident-management-sample` へ差し替えた。plan の対象成果物の欄の `based_on` 表記も合わせて直す必要がある。
- F014 は復旧目標（P1: 4h、P2: 1d）を前提にしているが、`based_on` の opd-incident-management-sample では『優先度ごとの復旧の期限』が `_UNDECIDED_` のため、推測で埋めずに `_UNDECIDED_` のまま残した。利用者（`PO`）が決める必要がある値: 優先度ごとの復旧の期限、オフライン時の記録方法、営業時間外の緊急連絡手段、証跡の保管期間。
- plan の指示（磨き込みでは template を読まない）に従い template を読まなかった。見出しは opr-sample（括弧書きなし）と、grade 指摘 F021 の『template にない括弧書き』に合わせた。opr-index-sample は括弧書き付きの見出しなので、どちらが正しいかを template と照らして確認し、食い違うほうを直すこと。
- opr-sample は『緊急権限は置かない』としているが、opd-access-control-sample と opd-incident-management-sample は緊急権限を定めている。本書は方針（opd）に従った。opr-sample の手直しが必要（本タスクの範囲外）。
- F025（draft から ready への移行の前提・基準）は、PJR-76N9 / sample-authoring-standard の決まり（承認の進み具合を本文に書かない）に当たるため本文に足さなかった。rulebook 側で sample の grade 観点から ready 化の基準を外すか検討すること。
- 紙の販売控えの手順のうち『転記は店番担当、照合は `OPS`』という分担と、日次点検の『20 枚以上』という基準は、共通サンプル文脈から置いた仮定である。関連する opr / opd sample と値をそろえるか確認すること。
- rulebook の変更案: 6.12 は『`opr-&lt;term&gt;` が差分元の `opr-index` を導線に載せる』ことを明示していない。分冊の場合に差分元の `opr-index` を必ず載せる旨を加えるとよい。
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/ 配下の sample だけで、plan・result・個票（履歴ファイル）は変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更した `*.yaml` / `*.yml` ファイルがない）

## 4. 進め方と実践の型の適用

既存の成果物を `opr-rulebook` の要求事項および共通サンプル文脈に合わせて磨き込み、完成例としての厚みを持たせる作業を行いました。既存の記述を尊重しつつ、不足していた必須章の追加や、SLA に関する定量的指標の補完、Role code を用いた責任定義の明確化を実施しました。
