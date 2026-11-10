---
specdojo:
  id: prj-0001:pjr-7zzr-cdt-register-type-refine-confirmed-kata
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: hard
  registered_at: "2026-11-10T13:12:42Z"
  block_reason: "parent validation failed: test-integration"
  derived_from:
    - PJR-2GD6
    - PJR-T88P
  autopilot: approved
  approach: fully-guided
  targets:
    - prj-0001:cdt-register-type
---

# PJR-7ZZR 代表の cdt-register-type を、確定した型で磨き込む

## 1. 概要

business-specs-kata で確定した型（specdojo:cdt-rulebook と sample）に合わせて、代表の cdt-register-type を磨き込み、冗長さを整理する。review は schedule の review の段で流す

## 2. 入力

- 型一式の確定（2026-11-10、indie が決定）の後に、代表を磨き込みから流し直す。schedule の磨き込み・condense の段はゲートで bes・br・clis の段まで巻き戻すことになるため、register の todo で行う（orchestrator の判断、indie に報告）。
- 夜間の register の routine で流す（indie が承認）。review は T-BUSINESS-SPECS-REPS-cdt-register-type-090 を reopen 済みで、6:00 の exec cycle で流す。

## 3. 完了条件

- 代表の [[prj-0001:cdt-register-type]] を、確定した型 [[specdojo:cdt-rulebook]] と [[specdojo:cdt-sample]] に合わせて磨き込んでいる。型の本文要件の章立て・必須の項目・記述ガイドの判断の基準に沿い、型が禁止することを書いていない。
- 冗長さを整理している（判断に要る背景・制約・例外と意味は保ち、新しい内容を足さない）。
- 実装・schema・リファレンスと同じことを書かず、正本を参照する方針（PJR-2GD6）を保っている。
- 決められない点は `_UNDECIDED_` か `_ASSUMPTION_` のまま、理由（どの成果物がない、誰の判断が要る）を書いて残してよい。依存の成果物がないことを理由に未完了としない。
- これまでの review の指摘のうち、確定した型の範囲で直せるものを直し、直さないものは理由を個票の対応結果に書いている。
- 型と、ほかの成果物とカタログを変えていない。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`specdojo catalog validate --project prj-0001` が通っている。

## 4. 作業内容

| No  | 作業                               | 担当              | 状態       | メモ                                   |
| --- | ---------------------------------- | ----------------- | ---------- | -------------------------------------- |
| 1   | 確定した型と代表の文書を読み比べる | executor          | 実施済み   | rulebook・sample・辞書・実装入口を確認 |
| 2   | 磨き込みと冗長さの整理を行う       | executor          | 実施済み   | 分類表へ集約し、正本と本書の責務を区別 |
| 3   | 検査を流し、対応結果に書く         | executor / runner | 親検証待ち | sandbox の検査と親検証を第5.3節で区別  |

## 5. 対応結果

### 5.1. 実施内容と成果物

[[prj-0001:cdt-register-type|分類一覧（登録項目の種別）]] を、確定した [[specdojo:cdt-rulebook|分類一覧 作成ルール]] に合わせて磨き込んだ。既存の4章と分類定義表を維持し、分類の意味・選定条件・境界・通常の終端を残した。変更ファイルは同成果物と本個票だけであり、型・他の成果物・カタログ・CHANGELOG は変更していない。

### 5.2. 進め方と実践の型の適用

- rulebook は必須章・正本参照方式・責務境界・禁止事項の判断に使用した。recipe と template は `not-needed` のため読み込んでいない。sample は章と表の形式だけを確認し、別業務の値や管理規約は取り込んでいない。実践の型の欠落・不足、既存本文の `_CONTEXT_:` はなかった。
- [[prj-0001:bdd-register-entry|業務データ辞書（登録項目個票）]] を属性・分類の根拠、[[prj-0001:prj-overview|プロジェクト概要]] を判断と継承を正本に残す Why の根拠として読んだ。共通規約2本、orchestrator playbook、`vp-arc-conciseness` と各 finding の該当観点、検査設定も確認した。実装エビデンスの `src/register/register.ts` は現在動作の入口として読み取り専用で参照した。
- 冒頭の説明は概要・分類定義と重複するため削除した。第3章の5項目の選定手順は分類表へ統合し、判断順序を表の行順と冒頭の一文で保持した。分類の条件・例外は各行に残し、表と手順の二重説明を解消した。
- 第2章でスキーマを許容値の正本、CLI を対応確認先として区別した。第3章冒頭の正本の再説明と、未照合の CLI の動作断定を削除した。第4章の辞書リンクの重複を第1章への参照に置き換えた。
- `risk`・`issue`・`change-request` の終了承認者・PR approve 条件は状態定義へ委ね、受容・対応完了・変更承認という分類選定に必要な違いは維持した。派生ビューの振り分け一覧は実装参照に置き換え、既定の commit 種別の対応表は分類選定に寄与しない実装の再掲のため削除した。業務上の規則自体を変更したものではない。
- 人間の PO の最終承認と人間による `ready` 昇格、値・意味の変更時の確認先を rulebook 第1・6章とプロジェクト概要の責任分界に基づいて補足した。新しい分類・値・業務方針は決定していない。既存構成と sample に優先関係を判断する矛盾はなかった。
- `_ASSUMPTION_`: 既存の schema・CLI 正本参照は維持したが、当該定義の解決・集合一致は未確認。schema・`src/register/item.ts`・CLI の委譲先・状態定義・カタログ本文は本 plan の読み取り対象に宣言されていないため追加探索していない。実装入口に `VALID_TYPES` の import / export とコマンド登録の委譲はあるが、許容値の定義自体はない。これを根拠に集合一致や実装への適合を断定せず、検証コマンドも推測して本文へ追加していない。

#### 5.2.1. 展開済み finding の扱い

以下は編集対応の記録であり、解消判定の再レビューは後続の独立した review に委ねる。

| finding                | 対応・残した理由と次のアクション                                                                                                                                                                                                                                     |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F001                   | 新たな分類方針の決定はしていない。正本・CLI・状態定義との照合は未了であり、承認判断の前提として本節と第5.4節に残した。照合結果を受けて人間の PO が承認・保留を判断する。                                                                                             |
| F002                   | 第1章に人間の PO の区分方針・公開可否の最終承認を明記した。本文は分類の業務判断と正本参照を扱い、実個票の個人情報・非公開情報を追加していない。公開可否そのものは人間が判断する。                                                                                    |
| F003・F005             | 本個票と executor の `handoff` を管理・報告先とし、第5.4節に既定の review への引き継ぎと確認の終了条件を記録した。個別の進捗管理や日程を CDT 本文に作り込まない。                                                                                                    |
| F004                   | 参照先との照合未了を依存上の残課題として記録した。不整合や阻害要因がないとは断定していない。PM へ既定の review 前提として引き継ぎ、日程変更は本タスクで決定しない。                                                                                                  |
| F006・F012             | 辞書の分類識別子と本書の説明行を照合し、8件の集合一致と業務的意味に相反する記述がないことを確認した。状態定義・schema・CLI・カタログの意味を含む照合は参照範囲外のため未了として引き継ぐ。catalog の機械検査だけで全体の意味の一致を確認済みとは扱わない。           |
| F007・F008・F010・F011 | スキーマ正本と CLI 対応確認先を区別した。定義位置の解決、許容値集合、CLI の受理・拒否、派生ビューへの対応の実動確認は指定の実装入口だけでは裏付けられない。既存コマンドを確認できる根拠がないため、新規コマンドや合格結果を捏造せず、第5.4節の照合条件を後続へ渡す。 |
| F009・F014             | 第4章に値・意味の変更時の辞書・状態定義・schema・CLI・派生ビューへの確認責務を補足した。具体的な同期コマンドや再生成手順は実装・リファレンスの責務であり、未宣言の根拠から CDT へ作り込まない。                                                                      |
| F013                   | 第1章に人間が `ready` 昇格を判断する前提を明記し、`draft` を維持した。未了の照合と親検証を本個票に残した。公開・昇格や「阻害要因なし」の宣言は行っていない。                                                                                                         |

### 5.3. 検査

- executor: 変更した2文書を Prettier で整形した。`node --input-type=module` の標準入力スクリプトで辞書の `item_type` と分類表の説明行を比較し、8識別子の集合一致・既存の選定順序の保持を確認した。これは schema・CLI の照合を代替しない。
- `node --import tsx src/specdojo.ts catalog validate --project prj-0001`: 成功（終了コード0）。変更していないカタログに未作成文書や再 export のみの実装参照などの警告がある。カタログの修正は範囲外のため行っていない。
- `npm run validate:history-links`: 成功（終了コード0）。
- 親 runner: `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema` を含む指定済みの親検証を実行する。executor は重複実行していないため、親検証の合格結果は runner が追記する evidence を正とする。
- `npm run validate:schema:file` は YAML の変更がないため非適用。`specdojo index build` は runner の責務であり実行していない。

### 5.4. 残課題と申し送り

- PM / 夜間 orchestrator へ: 対応結果と未了の照合を、入力で指定された `T-BUSINESS-SPECS-REPS-cdt-register-type-090` の review に引き継ぐ。新たな登録項目の実行・起票、日程変更、decision の決定は行っていない。
- ARC・DEV・QE 向けの確認候補: 宣言済み正本のファイルと定義位置が解決でき、各正本値と本書の業務説明が一対一で対応し、CLI が正本値だけを受理し、それ以外を拒否すること。分類の意味と派生ビューの対応、辞書・状態定義・カタログとの不整合があれば箇所と影響を記録する。一つでも欠落・余分な値・不一致があれば照合は不合格とする。必要な参照範囲を後続タスクで宣言した上で確認し、未解消箇所を PO に渡す。
- 上記は独立 review への申し送りであり、その実行や人間の最終承認を本 edit で代行しない。result は pipeline reporter が本記録と `handoff` を転記する。

### 5.5. CHANGELOG に書く事項

なし。分類の値・業務上の意味・実装動作は変更しておらず、代表文書の型適合と重複整理のみ。

## 6. 関連ドキュメント

- 親: [[prj-0001:pjr-2gd6-business-specs-reps]]、[[prj-0001:pjr-t88p-business-specs-kata]]
- 対象: [[prj-0001:cdt-register-type]]
- 型: [[specdojo:cdt-rulebook]]
