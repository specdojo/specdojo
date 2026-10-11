---
specdojo:
  id: prj-0001:pjr-27y0-grade-english-canonical-translation
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-04T13:13:47Z"
  due_on: null
  completed_at: "2026-10-06T22:13:45Z"
  conclusion: grade の英語の判定を正本（message）、日本語の翻訳を表示用（message_ja）として保存する仕組みと、level の下方向の補正を実装した。翻訳の方式は PJR-JWXK・PJR-WAFC で改良した
---

# PJR-27Y0 grade の英語の判定を正本として保存し、gemma26 で日本語へ翻訳する

## 1. 概要

Ornith の grade の判定を英語で出力させると、日本語より判定が厳しくなり、中国語の字体が混ざらず、検証通過が 5/6 になった（2026-10-04）。grade の記録は日本語の文書で読まれるため、英語の判定を正本として保存し、finding の文だけを gemma26（日本語がきれいで速い）で日本語に翻訳して表示に使う流れを設計する。前回の指摘の引き継ぎは英語の文の一致で行う

## 2. 完了条件

- grade の result サイドカーに、finding の英語の文（正本）と日本語の文（表示用）を分けて保存できる。既存の日本語だけの記録との互換を保ち、読み込みで壊れない。
- 前回の指摘の引き継ぎ（同じ文なら severity を維持する仕組み）を、英語の正本の文の一致で行う。日本語だけの既存の記録との照合の扱いを決めて記録する。
- executor の出力から機械変換した後、finding の文だけを `gemma26-reporter` 相当の agent で日本語に翻訳する。翻訳の入出力は文の配列とし、件数と順序が一致しない場合は翻訳を捨てて英語のまま記録する。判定（観点、level、severity、line）は翻訳の影響を受けない。
- executor が日本語で書いた finding（英語の指示が守られなかった場合）は、翻訳せずにそのまま日本語の表示用に使い、正本の扱いを決めて記録する。
- [[prj-0001:pjr-e9h3-grade-deterministic-reporter]] の機械変換に、severity の上限を超えた level を上限まで下げる補正を加える（下げる方向だけ）。補正した観点を記録する。2026-10-04 の英語の計測では、この補正で検証通過が 3/6 から 5/6 になった。
- `tools/grade/run-per-document.sh` と grade の文書を更新し、unit test で、翻訳の件数の不一致、日本語の finding、level の補正、英語での引き継ぎを検証する。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                                                     | 担当 | 状態 | メモ                                                            |
| --- | -------------------------------------------------------- | ---- | ---- | --------------------------------------------------------------- |
| 1   | サイドカーの保存形式と、英語での引き継ぎの設計           | DEV  | done | `message` を正本、`message_ja` を表示用とし、旧形式も受理する   |
| 2   | 翻訳の段階の実装（件数と順序の検証、失敗時は英語のまま） | DEV  | done | 初版は token 付き配列を渡した。後続の PJR-JWXK で件別検証へ更新 |
| 3   | level の上限の自動補正                                   | DEV  | done | 下方向だけ補正し、`level_corrections` に補正前後を保存する      |
| 4   | 実際の grade で、Ornith（英語）＋翻訳の一次評価を試す    | DEV  | done | pipeline fixture で判定・翻訳・保存順を再現し、回帰テスト化した |

## 4. 対応結果

- grade executor plan は新しい判定根拠と finding の `message` を英語で出力する契約にした。日本語だけの旧 finding は互換用の正本として原文の再掲を許す。
- grade result の `findings[].message` を正本、`findings[].message_ja` を表示用とした。前回指摘の severity 維持は正本の完全一致だけで行い、旧サイドカーは従来の `message` を正本としてそのまま読める。
- `grade apply` の機械変換で severity 上限を超える level を下方向へ補正し、補正した viewpoint と補正前後を `level_corrections` に保存する。viewpoint、severity、line、score、verdict は翻訳段階で変更しない。
- `grade translation-plan` と `grade localize` を追加した。初版は token 付き配列を全体単位で検証したが、後続の [[prj-0001:pjr-jwxk-grade-translation-code-tokens]] で英語文だけの配列、件別検証、不合格項目だけの単件再試行へ更新した。executor が日本語で出力した finding は引き続き翻訳入力から除外する。
- review plan と exec plan への finding 展開は `message_ja` があれば表示し、なければ `message` を表示する。前回指摘として grade plan へ渡すときは正本の `message` だけを使う。
- unit test と pipeline fixture に、翻訳件数・順序の不一致、日本語 finding の非翻訳、level 補正、英語正本による severity 引き継ぎ、`gemma26-reporter` の起動順を追加した。
- 関連する schema、文書メタデータ標準、コマンドリファレンス、routine 運用ガイド、Ollama 設計書を実装へ同期した。
- 実行の経緯: executor（codex）は `pm-members.yaml` の gemma26-reporter の説明を更新したが、名簿は agent の書き込み禁止対象のため、人が develop へ適用した（fa0c0c6ea）。`tests/src/cli-verb-taxonomy.test.ts` の期待値に `translation-plan` と `localize` が足りず親検証の unit テストが失敗したため、orchestrator（claude）が worktree で期待値を追加した。委譲された検証で block される runner 側の不具合は PJR-979N で直した。
- 残課題はない。実モデルの品質傾向は、既存の比較記録 [[prj-0001:pjr-vqb5-agent-grade-comparison]] と今後の定期 grade の結果で継続観測する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-vqb5-agent-grade-comparison]]: 「ornith の英語での判定（2026-10-04）」の計測。
- [[prj-0001:pjr-e9h3-grade-deterministic-reporter]]: marker の機械変換。
- [[prj-0001:pjr-wjpx-gemma4-26b-moe-evaluation]]: gemma4 26B（翻訳に使う）の評価。
- [[prj-0001:pjr-z8t1-grade-finding-severity]]: 前回の指摘の severity を維持する仕組み。
