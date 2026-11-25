---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opd-sample-110-20261125t140943z-2398d64a
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opd-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opd-sample-110/T-KATA-REVIEW-ALL-opd-sample-110-20261125T140943Z-2398d64a/plan.md
  started_at: "2026-11-25T14:09:53.084Z"
  completed_at: "2026-11-25T14:17:16.226Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opd-sample
    - specdojo:opd-access-control-sample
---

# Edit Result

## 1. 実施内容

- kata レビュー R1（目的の過不足）を実施し、`opd-access-control-sample.md` の 2 か所を直した。概要に差分の範囲を明記し、緊急権限の節に差分の種類（補足）を足した。
- `opd-sample.md` の扱いと概要の未決事項の表の 2 件は、人の判断が要るため「要判断」として残した。rulebook など sample 以外は変更していない。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R1-1 | R1 | opd-access-control-sample.md 1. 概要（access-control） | 最初の文が「具体化する分冊」とだけ書き、opd-index のどの章に対して何を差分として定めるかが読めない。 | 「権限区分、付与・剥奪の契機、共用タブレットでのログイン、緊急権限、監査ログの記録対象、棚卸しの合否を差分として定める分冊」に書き換えた。 | vp-qe-kata-conformance（opd-rulebook の「概要（`&lt;term&gt;`）」の記述ガイド: 扱う運用ドメインと、どの章を補足・具体化・例外にするかを示す） | - |
| R1-2 | R1 | opd-access-control-sample.md 2.4. 緊急権限 | 補足・具体化・例外のどれに当たるかが書かれていない。ほかの節には差分の種類がある。 | 「`opd-index` は緊急権限を定めていないため、本節で加える（補足）」の 1 文を足した。 | vp-qe-kata-conformance（opd-rulebook の「差分を持つ章」の記述ガイド: 各記述は補足・具体化・例外のどれかが分かるように書く） | - |
| R1-3 | R1 | opd-access-control-sample.md 1. 概要（access-control） | rulebook は概要を 1〜3 行としているが、概要に未決事項の表が置かれ厚くなっている。 | - | vp-arc-single-responsibility。未決事項を残すこと自体は document-metadata-standard の未決事項の引き継ぎに合うため削らなかった。選ばなかった案は、表を差分を持つ章の末尾へ移すこと。章の配置の問題なので R2 に任せる。 | 要判断 |
| R1-4 | R1 | opd-sample.md（plan の根拠の成果物） | opd-rulebook の frontmatter の `sample` 宣言に入っておらず、章立て（目的と適用範囲・入力情報・記述内容・最小記述例・未解決事項）が rulebook の本文構成（概要・差分を持つ章・関連ドキュメント導線）と合わない。H1 と表にも Markdown リンクが残っている（履歴蓄積ファイルではないため禁止の対象外）。 | - | vp-po-purpose-alignment、vp-qe-kata-conformance。plan の編集対象は opd-access-control-sample だけなので直さなかった。相手側の案は、opd-sample.md を消すか、opd-index-sample と分冊の sample を指す案内に作り直すこと。消すかどうかは人が決める。 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opd-access-control-sample.md`: 「1. 概要（access-control）」の冒頭文を、権限区分・付与・剥奪の契機・共用タブレットでのログイン・緊急権限・監査ログの記録対象・棚卸しの合否を差分として定める分冊、という書き方に改めた。「2.4. 緊急権限」には、`opd-index` が緊急権限を定めていないため本節で加える（補足）という 1 文を足した。

## 3. 申し送り

- R1-1: R1 / 1. 概要（access-control） / 最初の文が「具体化する分冊」とだけ書き、opd-index のどの章に対して何を差分として定めるかが読めない / 「権限区分、付与・剥奪の契機、共用タブレットでのログイン、緊急権限、監査ログの記録対象、棚卸しの合否を差分として定める分冊」に書き換えた / vp-qe-kata-conformance（opd-rulebook の「概要（`&lt;term&gt;`）」の記述ガイド: 扱う運用ドメインと、どの章を補足・具体化・例外にするかを示す） / -
- R1-2: R1 / 2.4. 緊急権限 / 補足・具体化・例外のどれに当たるかが書かれていない。ほかの節には差分の種類がある / 「`opd-index` は緊急権限を定めていないため、本節で加える（補足）」の 1 文を足した / vp-qe-kata-conformance（opd-rulebook の「差分を持つ章」の記述ガイド: 各記述は補足・具体化・例外のどれかが分かるように書く） / -
- R1-3: R1 / 1. 概要（access-control） / rulebook は概要を 1〜3 行としているが、概要に未決事項の表が置かれ厚くなっている / - / vp-arc-single-responsibility。未決事項を残すこと自体は document-metadata-standard の未決事項の引き継ぎに合うため削らなかった。選ばなかった案は、表を差分を持つ章の末尾へ移すこと。章の配置の問題なので R2 に任せる / 要判断
- R1-4: R1 / opd-sample.md（plan の根拠の成果物） / opd-rulebook の frontmatter の `sample` 宣言に入っておらず、章立て（目的と適用範囲・入力情報・記述内容・最小記述例・未解決事項）が rulebook の本文構成（概要・差分を持つ章・関連ドキュメント導線）と合わない。H1 と表にも Markdown リンクが残っている（履歴蓄積ファイルではないため禁止の対象外） / - / vp-po-purpose-alignment、vp-qe-kata-conformance。plan の編集対象は opd-access-control-sample だけなので直さなかった。相手側の案は、opd-sample.md を消すか、opd-index-sample と分冊の sample を指す案内に作り直すこと。消すかどうかは人が決める / 要判断
- 適用外の検証: `npm run validate:history-links`（変更したのは sample だけで、plan・result・個票を変更していないため）

## 4. 進め方と実践の型の適用

根拠にしたのは、opd-rulebook の「概要（`&lt;term&gt;`）」と「差分を持つ章」の記述ガイド、vp-qe-kata-conformance、vp-arc-single-responsibility、vp-po-purpose-alignment、document-metadata-standard の未決事項の引き継ぎ。plan に展開された grade と condense の finding はなかった。概要は差分の範囲が読めるよう直し、緊急権限の節は差分の種類が書かれていなかったため補った。概要の未決事項の表は、残すこと自体は標準に合うため削らず、配置の問題として R2 と人の判断に回した。opd-sample.md は編集対象外のため直さず、案だけを findings に残した。
