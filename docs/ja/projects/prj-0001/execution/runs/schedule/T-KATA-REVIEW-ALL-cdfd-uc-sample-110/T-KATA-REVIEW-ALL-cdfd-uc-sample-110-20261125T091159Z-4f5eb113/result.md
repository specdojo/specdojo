---
specdojo:
  id: prj-0001:xer-t-kata-review-all-cdfd-uc-sample-110-20261125t091159z-4f5eb113
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-cdfd-uc-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-cdfd-uc-sample-110/T-KATA-REVIEW-ALL-cdfd-uc-sample-110-20261125T091159Z-4f5eb113/plan.md
  started_at: "2026-11-25T09:12:09.751Z"
  completed_at: "2026-11-25T09:28:43.566Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cdfd-uc-sample
    - specdojo:cdfd-uc-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R1（目的の過不足）を `cdfd-uc-sample` に対して実施した。足すべき内容はなく、要らない記述を削る差分だけを入れた。
- 削ったのは 5.1 と 5.2 の図の後の注記にある、凡例の言い直し、データストアの表や図をなぞる文、rulebook の言い直しである。
- 導入文の product ID の文は、残すか削るかを人が決める「要判断」の指摘として残し、本文は直していない。
- lint-md-changed、lint-fm-changed、lint-mermaid、lint-d2、test-docs、validate-schema は passed だった。executor の prettier と markdownlint も passed だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cdfd-uc-sample.md`: 5.1「欠品から売場補充まで」の図の後の注記から、凡例の言い直しと、データストアの表や図をなぞる文を削り、共有ノードと委ねる範囲の注記だけを残した。5.2「例外時の戻り」の図の後の注記は、図の説明の繰り返しと凡例・rulebook の言い直しをやめた。「凡例は全体概要を参照する。在庫・仕入・販売は通常の図と同じ代表ノードとし、データストアと商品の流れは通常の図、各グループ内部の例外は役割表の参照先へ委ねる。」の 1 文にまとめた（2 行追加・2 行削除）。

## 3. 申し送り

- R1 の指摘は No.1〜No.3 を直し、No.4（導入文の product ID の文）は要判断として未修正で残した。実施内容の表は、evidence.handoff の指摘 1 件ずつを元に runner 側で 1 回だけ書く。この申し送りには表を重ねない。
- No: 1 / 段: R1 / 箇所: 5.1「欠品から売場補充まで」の図の後の注記 / 指摘: 「通常線は情報、太線は商品の流れに用いる」が凡例を言い直している / 直した案: 凡例は全体概要への参照だけにして、この文を削った / 根拠: cdfd-uc-rulebook の「概念データフロー」（凡例は別の短い注記にし再定義しない）と禁止事項（詳細 CDFD に独自の凡例を再掲・重複定義する） / 印: なし
- No: 2 / 段: R1 / 箇所: 5.1 の図の後の注記 / 指摘: 「在庫記録は補充判断と入荷数量確認の双方の正本とし、商品台帳は〜、仕入記録と売場棚は〜のために置く」が、データストアの表の「横断上の利用」と図をなぞっている / 直した案: この文を削り、共有ノードと委ねる範囲の注記だけを残した / 根拠: cdfd-uc-rulebook の禁止事項（図をなぞる長文の注記を書く）。データストアの表が用途の正本 / 印: なし
- No: 3 / 段: R1 / 箇所: 5.2「例外時の戻り」の図の後の注記 / 指摘: 「本図は〜漏れなく示す」が図の説明文の繰り返しで、「通常線で情報の戻りと再提示を描く」は凡例の言い直し、「内部の再試行は描かない」は rulebook の言い直しになっている / 直した案: 「凡例は全体概要を参照する。在庫・仕入・販売は通常の図と同じ代表ノードとし、データストアと商品の流れは通常の図、各グループ内部の例外は役割表の参照先へ委ねる。」にまとめた / 根拠: cdfd-uc-rulebook の「概念データフロー」（図ごとに共有ノードと委ねる範囲を短く注記する）、「例外時の戻りの図」、禁止事項 / 印: なし
- No: 4 / 段: R1 / 箇所: 導入文の 2 文目「product 成果物として作成する場合の ID は `cdfd-uc-replenishment` とする」 / 指摘: sample についての説明で、rulebook の導入文の要件（ケース ID と業務名を 1 文で示す）の外にある。ただし全体概要の詳細 CDFD 一覧とつなぐ役目もあるため、本文は直していない / 直した案: 残すか削るかを人が決める。削る場合は、ID を全体概要の一覧だけに任せる / 根拠: cdfd-uc-rulebook の「導入文と目的」、Sample 記述標準の記述ガイド / 印: 要判断
- 次の段への申し送り: 適用範囲の「店番担当」が共通登場人物の役割名（家族利用者代表など）と合っていない点、「売場棚」をデータストアのどの区分に置くかが全体概要と合っているかは R5、役割表の前に 1 文がない点は R2・R3 で扱う。
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイル（plan・result・個票）を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更した YAML ファイルがない）

## 4. 進め方と実践の型の適用

根拠は cdfd-uc-rulebook の「概念データフロー」「例外時の戻りの図」「導入文と目的」と禁止事項、Sample 記述標準、kata-guide の R1 の観点である。plan に展開された grade の finding と成果物から届いた Kata が原因の finding はなかった。このため R1 の確かめに当たる箇所だけを直した。rulebook など sample 以外は変更していない。凡例とデータストアの用途は、全体概要と表を正本とし、sample 側の再掲を削った。frontmatter の `status` は `draft` のまま据え置いた。適用範囲の「店番担当」の役割名と「売場棚」のデータストア区分は R5、役割表の前に 1 文がない点は R2・R3 に申し送る。根拠不足で見送った finding はない。
