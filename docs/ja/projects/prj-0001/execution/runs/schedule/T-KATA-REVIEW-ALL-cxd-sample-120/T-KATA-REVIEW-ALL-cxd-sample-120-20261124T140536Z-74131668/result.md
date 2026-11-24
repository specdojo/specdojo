---
specdojo:
  id: prj-0001:xer-t-kata-review-all-cxd-sample-120-20261124t140536z-74131668
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-cxd-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-cxd-sample-120/T-KATA-REVIEW-ALL-cxd-sample-120-20261124T140536Z-74131668/plan.md
  started_at: "2026-11-24T14:05:45.486Z"
  completed_at: "2026-11-24T14:17:33.797Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cxd-sample
    - specdojo:cxd-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）レビューを実施し、`docs/ja/specdojo/samples/cxd-sample.md` の外部 API に関する学習用の仮定の段落を、概要から第3.3節 External Software System（外部システム）へ移動した。内容は変えていない。
- grade の F001（Person 表の列見出しの不一致）は R1 で R5 へ申し送り済みのため、新規指摘として再掲しなかった。sample の列名は rulebook 第6.3.2節と一致しているので維持した。
- 既存の章順・必須表・図・検証観点・将来課題は維持した。sample 以外のファイル、result、grade sidecar は変更していない。
- executor が実行した `npx prettier --write` と `git diff --check` は passed だった。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も passed だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cxd-sample.md`: 外部 API を使う学習用の仮定の段落を概要から第3.3節 External Software System（外部システム）の表の導入文の直前へ移した（2 行追加・2 行削除）。外部依存の境界定義と仮定が隣り合い、前提から責任分界・障害時の扱いへ続けて読める。template と一致する章・小節の順序は変えていない。

## 3. 申し送り

- R2 の指摘は次の表のとおり（No・段・箇所・指摘・直した案・根拠・印）。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | - | - | - | - | - | - | - | | R2-1 | R2 | 概要、第3.3節 External Software System（外部システム） | 外部 API を使う学習用の仮定が概要に置かれ、対応する外部依存の境界定義と離れている | 仮定の段落を内容を変えず第3.3節の表の導入文の直前へ移し、前提から責任分界・障害時の扱いへ続けて読めるようにした | `vp-arc-document-structure`、`vp-qe-omissions-consistency`。cxd-rulebook 第6.5節は仮定の宣言を該当する境界定義に置くと定める。Sample 記述標準 第5節に従い、template と一致する章・小節の順序は維持した | - |
- F001 に対応する template 側の列名統一案は、R1 の申し送りどおり後続の R5 で扱う。
- R2-1: R2 / 箇所: 概要、第3.3節 External Software System（外部システム） / 指摘: 外部 API を使う学習用の仮定が概要に置かれ、対応する外部依存の境界定義と離れている / 直した案: 仮定の段落を内容を変えず第3.3節の表の導入文の直前へ移し、前提から責任分界・障害時の扱いへ続けて読めるようにした / 根拠: `vp-arc-document-structure`、`vp-qe-omissions-consistency`。cxd-rulebook 第6.5節は仮定の宣言を該当する境界定義に置くと定める。Sample 記述標準 第5節に従い、template と一致する章・小節の順序は維持した / 印: -
- reporter 向け記録: 変更ファイルは docs/ja/specdojo/samples/cxd-sample.md のみ。判断根拠は result の「進め方と実践の型の適用」に記録すること。cxd-rulebook 第5・6章、cxd-template、cxd-recipe、cxd-mermaid-rulebook、Sample 記述標準、kata-guide 第6章、共通レビュー観点、grade sidecar、R1 result を確認した。既存の章順・必須表・図・検証観点・将来課題は維持し、変更は仮定の段落移動に限定した。指摘 R2-1 は実施内容に Markdown 表で1回だけ記載し、申し送りに重ねない。
- F001 は R1 で R5 へ申し送り済みのため、新規指摘として再掲しない。grade sidecar と実文書を確認し、sample の列名は rulebook 第6.3.2節に一致するため維持した。template 側の列名統一案は後続 R5 で扱う。sample 以外、result、grade sidecar、Git 状態の操作は行っていない。Markdown・frontmatter・図・テスト等の指定された親検証は runner に委ねる。
- 適用外の検証: `npm run validate:schema:file`（YAML・YML ファイルを変更していない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は samples 配下のみで、docs/ja/projects/ 配下の成果物変更がない。）
- 適用外の検証: `npm run validate:history-links`（履歴ファイル・plan・result を変更していない。）

## 4. 進め方と実践の型の適用

sample-maintenance の進め方に従い、R2（構成）として次の資料を確認した。cxd-rulebook 第5・6章、cxd-template、cxd-recipe、cxd-mermaid-rulebook、Sample 記述標準、kata-guide 第6章、共通レビュー観点、grade sidecar、R1 result。 改訂した記述は、外部 API の仮定の段落の位置だけである。根拠は cxd-rulebook 第6.5節（仮定は該当する境界定義に置く）と、観点 `vp-arc-document-structure`・`vp-qe-omissions-consistency` である。template と一致する章・小節の順序は Sample 記述標準 第5節に従って維持した。 維持した記述は、既存の章順、必須表、図、検証観点、将来課題である。いずれも rulebook と整合している。 F001 は、sample の Person 表の列見出しが rulebook 第6.3.2節の「境界上の接点・確認責務」と一致している。そのため sample 側は修正せず維持した。不一致は template 側にあり、rulebook など sample 以外は本タスクで変更しない方針なので、template の列名を rulebook に合わせる案は R5 に回す。F001 は未解消のまま残り、次のアクションは R5 での template 修正である。 rulebook と sample が矛盾した箇所はなかった。根拠不足で見送った finding もない。
