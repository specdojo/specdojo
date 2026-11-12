---
specdojo:
  id: prj-0001:xer-t-business-specs-kata-2-ifx-cmd-ai-provider-cli-040-20261112t154621z-f09b79c0
  type: exec-result
  task_id: T-BUSINESS-SPECS-KATA-2-ifx-cmd-ai-provider-cli-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-BUSINESS-SPECS-KATA-2-ifx-cmd-ai-provider-cli-040/T-BUSINESS-SPECS-KATA-2-ifx-cmd-ai-provider-cli-040-20261112T154621Z-f09b79c0/plan.md
  started_at: "2026-11-12T15:46:30.105Z"
  completed_at: "2026-11-12T16:06:38.878Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - ifx-cmd-ai-provider-cli
    - specdojo:ifx-cmd-rulebook
---

# Edit Result

## 1. 実施内容

- ifx-cmd の `rulebook`、`recipe`、`template` を同期し、検証手順とファイル契約の記述を明確化しました。
- finding F001 に基づき、`docs/ja/specdojo/rulebooks/ifx-cmd-rulebook.md` において、具体的な schema 検査コマンド、期待される成功結果、エラー時の対応方針を明記し、執筆標準に沿った章構成（見出し連番の付与、サンプル章の外出し等）へ再整備しました。
- finding F002 については、現行 sample のファイル契約が要件を満たしていることを確認し、`rulebook` と `template` 側の案内を整合させました。
- `recipe` では検証手順とファイル契約の問いを同期し、`template` では可変パスや作成・読取主体の記入案内、および空配列の扱いを整備しました。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/ifx-cmd-recipe.md`: 検証手順およびファイル契約に関する問いを `rulebook` の改訂内容と同期しました。
- `docs/ja/specdojo/rulebooks/ifx-cmd-rulebook.md`: 検証手順（schema 検査コマンド、期待結果、エラー対応）を具体化し、記述ガイドに判断基準・良い例・悪い例を追加しました。また、`rulebook-authoring-standard` に従い見出し連番の付与とサンプル章の外出しを実施しました。
- `docs/ja/specdojo/templates/ifx-cmd-template.yaml`: 可変パス、作成／読取主体、内容仕様の記入案内を充実させ、空配列の扱いについての記述を `rulebook` と整合させました。

## 3. 申し送り

- 実施内容・変更ファイル: docs/ja/specdojo/rulebooks/ifx-cmd-rulebook.md は検証対象・コマンド・期待結果・エラー時対応、ファイル責務、改訂時の影響確認を整理。docs/ja/specdojo/recipes/ifx-cmd-recipe.md は検証手順とファイル契約の問いを同期。docs/ja/specdojo/templates/ifx-cmd-template.yaml は可変パス・作成／読取主体・内容仕様の記入案内と空配列の扱いを同期。成果物本体・sample・result・grade サイドカーは未編集。
- 進め方と実践の型の適用に記録する根拠: rulebook-authoring-standard、recipe-authoring-standard、template-authoring-standard、document-metadata-standard、ryu-guide のメンテナンス手順、共通レビュー観点の vp-dev-testability・vp-qe-kata-conformance・vp-arc-conciseness、PJR-2GD6・PJR-4N3R・PJR-FGSE、ifx-cmd.schema.yaml、schema 検証実装を確認した。代表成果物 ifx-cmd-ai-provider-cli と現行 ifx-cmd-sample、および rulebook・recipe・sample・代表成果物の grade result を照合した。plan に condense 由来の記録はない。
- F001（source=grade、vp-dev-testability）: 現行版に存在した検証手順を整理し、対象パスを引用符付きで指定する schema・整形コマンド、成功表示と終了コード、エラー時の再実行、共通規範への参照を明記した。章参照を番号からタイトルに変更し、検証手順にも判断基準・良い例・悪い例を揃えた。個別 schema 検査で実際に対象パスと : valid、終了コード 0 を確認した。
- F002（source=grade、vp-qe-kata-conformance）: 現行 sample は指摘時の `{order_id}` を使わず、receipts/receipt-YYYYMMDD-NNNN.txt について販売 CLI が会計確定時に作成すること、店舗データディレクトリ基準、確定済み取引情報から日付8桁・連番4桁を解決すること、内容仕様 kinuya-receipt-format-schema、印刷 CLI は読取のみ、`outputs: []` を明示している。指摘は現行版で解消済みと確認し、sample への追加変更や要件緩和は行わなかった。template の片側配列を省略可能とする案内は rulebook を正として修正した。
- 要否判断・維持理由: recipe は正本選定と契約判断を進める手順、template は同系統の仕様に再利用する記入骨組みとして必要。rulebook の recipe: specdojo:ifx-cmd-recipe、template: specdojo:ifx-cmd-template、sample: specdojo:ifx-cmd-sample を維持した。引数表の禁止、管理されたシェル起動の例外、秘密値を持たない方針は代表成果物と既存決定に整合するため維持した。ファイル契約は既存の description で表現できるため schema 変更は不要。
- 後続作業案: sample-maintenance では現行 sample のファイル契約と完成例の厚さを維持し、sample grade F001 が指摘する生成ページの状態を再確認する。代表成果物の入力ファイルの作成主体・内容仕様への導線は、後続の成果物磨き込みで具体化を検討する。他系統の recipe・template の変更は不要。
- 検証補足: 親 runner 所管の lint・全体 schema・型検査・単体／統合テストは実行していない。補助構成チェックは Node 内の Git 子プロセス起動が EPERM となったため、Git 確認を分離して再実行し、全項目を通過した。親検証の結果は runner が追記する。
- 適用外の検証: `npm run validate:catalog`（成果物の変更が docs/ja/specdojo/ 配下に限定され、docs/ja/projects/ 配下に及ばないため。）
- 適用外の検証: `npm run validate:history-links`（登録簿・既存 plan・result などの履歴ファイルを変更していないため。）

## 4. 進め方と実践の型の適用

rulebook-maintenance
