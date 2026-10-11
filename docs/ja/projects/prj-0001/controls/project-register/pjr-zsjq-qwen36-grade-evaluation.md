---
specdojo:
  id: prj-0001:pjr-zsjq-qwen36-grade-evaluation
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-06T12:58:02Z"
  due_on: null
  completed_at: "2026-10-06T22:04:38Z"
  conclusion: Qwen3.6 は grade の判定に使わない。thinking ON は判定が甘く、OFF は Ornith と同程度の精度で約2倍遅く、oMLX の memory guard に拒否されやすい。member は disabled にした
---

# PJR-ZSJQ oMLX の Qwen3.6 を grade の executor として評価する

## 1. 概要

2026-10-06、利用者が oMLX に Qwen3.6 35B-A3B（4bit）を導入した。`opencode.json` の omlx の provider には、モデル `qwen3.6-35b-a3b`（context 131072、output 32768、thinking ON、Qwen の推奨サンプリング）が定義済みである。一方、Qwen3.6 を使う opencode の agent と、`pm-members.yaml` の member はまだない。

[[prj-0001:pjr-vqb5-agent-grade-comparison]] の「ornith の英語での判定（2026-10-04）」と同じ条件で grade の判定を計測し、Ornith・codex・agy と比べて用途を判断する。既存の `qwen-*` の agent は Ollama の qwen3.8 用なので、名前が重ならないよう `qwen36-` で始める。

## 2. 完了条件

- `.opencode/agents/qwen36-expert-executor.md` を追加する。モデルは `omlx/qwen3.6-35b-a3b` とし、grade の根拠と finding を英語で出力させる指示は `ornith-expert-executor` と同じにする。
- `pm-members.yaml` に `qwen36-expert-executor`（provider: opencode、stage_role: executor、proficiency: expert）を追加する。
- agent の定義と名簿は agent の書き込み禁止対象のため、orchestrator が利用者の承認を得て agent の実行の外で追加する。
- oMLX が返すモデル ID が `opencode.json` の `qwen3.6-35b-a3b` と一致することを確かめる。
- 「ornith の英語での判定（2026-10-04）」と同じ条件（本文埋め込み、同じ 3 文書×2 回、機械変換）で計測し、次を記録する。
  - 検証通過の数、score、major が出た回の数、中国語の字体の混入、平均時間。
  - 同じ文書での codex・agy・Ornith の判定との level の一致の傾向。
- thinking ON（推奨の設定）で計測する。時間や判定に問題があれば thinking OFF でも計測し、比べる。
- 結果を PJR-VQB5 に新しい節として追記し、Qwen3.6 の用途（grade の一次評価に使えるか、Ornith と置き換えるか、使わないか）を決めて記録する。
- 用途によって設計書（tsd-omlx-opencode など）の記載が変わる場合は、合わせて更新する。

## 3. 作業内容

| No  | 作業                                   | 担当         | 状態 | メモ                                   |
| --- | -------------------------------------- | ------------ | ---- | -------------------------------------- |
| 1   | agent の定義と名簿の member を追加する | orchestrator | done | 保護された設定のため利用者の承認が必要 |
| 2   | モデル ID と疎通を確かめる             | orchestrator | done | -                                      |
| 3   | 1.26 と同じ条件で grade を計測する     | orchestrator | done | thinking ON、必要なら OFF も           |
| 4   | 結果を PJR-VQB5 に記録し、用途を決める | orchestrator | done | 用途の決定は利用者の確認を得る         |

## 4. 対応結果

- `qwen36-expert-executor` の agent 定義と名簿の member を追加し（6847e7e0f）、モデル ID と疎通を確かめた。
- thinking ON、thinking OFF（Qwen の推奨値）、thinking OFF（Ornith と同じ値）の3条件で計測した。Ornith と同じ値の条件は、oMLX の memory guard に繰り返し拒否されたため3回で打ち切った。利用者の判断で、残りの計測は行わない。
- 結果と、Ornith・agy との finding の内容の比較を [[prj-0001:pjr-vqb5-agent-grade-comparison]] の「oMLX の Qwen3.6 35B-A3B（2026-10-06〜07）」に記録した。
- 結論: grade の判定には使わない。thinking ON は判定が甘く、OFF は Ornith と同程度の精度で約2倍遅く、memory guard に拒否されやすい。名簿の member を `disabled: true` にした（ef1d33cd7）。agent の定義は再現用に残す。
- 設計書（tsd-omlx-opencode）の Qwen3.6 の記載は、モデルの導入手順として残し、変更しない。

## 5. 関連ドキュメント

- [[prj-0001:pjr-vqb5-agent-grade-comparison]]（agent の grade の比較）
- [[tsd-omlx-opencode]]（oMLX と opencode の設定）
