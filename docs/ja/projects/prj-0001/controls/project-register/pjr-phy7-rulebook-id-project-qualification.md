---
specdojo:
  id: prj-0001:pjr-phy7-rulebook-id-project-qualification
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  registered_at: "2026-11-05T10:45:48Z"
  completed_at: "2026-11-23T05:13:02Z"
  conclusion: プロダクト文書の id を名前空間なしで定めるよう、cdt と ifx-file の rulebook の id の規則と、ifx-cmd・ifx-index の template の id を直した。1 回目の 6 つの rulebook の変更は捨てた。grade は rulebook が pass 94・90、template が pass 94・90
  derived_from:
    - PJR-Q9AW
    - PJR-00NY
  depends_on:
    - PJR-AEKE
    - PJR-BM07
---

# PJR-PHY7 プロダクト文書の id を名前空間なしで定める型（rulebook・template・sample）をそろえる

## 1. 概要

id-and-file-naming-standard のとおり、プロダクト文書の id は名前空間なしを正とする。cdt・ifx-file の rulebook と ifx の YAML template が名前空間ありで定めているので直す。1 回目の rulebook の変更は捨てる

## 2. 入力

- PJR-Q9AW の磨き込みで、stsd-rulebook の frontmatter の規則（id はプロジェクト修飾なしの `stsd-<term>`）と、scaffold が作った stsd-task-execution が食い違った。既存の stsd-register-entry は修飾なしの id を持つ（2026-11-05）
- 同じ「プロジェクト修飾なし」の書き方は cdfd・cdfd-uc・bps の rulebook にもある

## 3. 完了条件

- プロダクト文書（`docs/<lang>/product/` の下）の id は、`id-and-file-naming-standard` のとおり名前空間なしのローカル ID（例: `stsd-task-execution`）を正とする（利用者の決定、2026-11-23、indie）。2026-11-22 の「修飾した形を正とする」決定はこれで置き換える。プロジェクト文書（`docs/<lang>/projects/<project-id>/` の下）は、これまでどおり `<project-id>:` で修飾する。
- 1 回目の実行（2026-11-22）で `stsd`・`cdfd`・`cdfd-uc`・`bps`・`sf`・`cdfd-overview` の rulebook に入れた修飾の形への変更は、統合せずに捨てる。これらの rulebook はもともと標準どおりのため、変えない。
- `cdt-rulebook` の ID の規則（`<project-id>:cdt-<term>`）を、プロダクト文書としての `cdt-<term>` に直す。例も名前空間なしにする。
- `ifx-file-rulebook` の「仕様 ID 規則」を、プロダクト文書は `ifx-file-<kebab-case>`、プロジェクト文書は `<project-id>:ifx-file-<kebab-case>` と、置き場所で決まる形に書き直す。frontmatter と `x-spec-meta` の例は、プロダクト文書の例として名前空間なしにする。
- `ifx-index-template.yaml` と `ifx-cmd-template.yaml` の id の `_PROJECT_ID_:_LOCAL_ID_` を `_LOCAL_ID_` に直す。生成される表示のページ（`templates/generated/`）は yaml-pages で作り直す。
- ほかの rulebook・template・sample で、プロダクト文書の id や例を名前空間ありで定めているものを `rg` で探し、同じく直す。プロジェクト文書についての記述は変えない。探した方法と直した一覧を個票の対応結果に書く。
- 対応する sample の id や例が rulebook と食い違えば、合わせて直す。
- 既存の成果物（`docs/ja/product/` の下）の id と `based_on` は、この項目では変えない（後続の todo で直す）。CLI のコードも変えない。
- 型の grade は統合の後に orchestrator が流す。executor は grade を実行しない。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                      | 担当     | 状態 | メモ                                                          |
| --- | ------------------------- | -------- | ---- | ------------------------------------------------------------- |
| 1   | 対象の探索                | executor | done | `rg` で rulebook・template・sample の名前空間付き id を探した |
| 2   | rulebook・template の修正 | executor | done | cdt・ifx-file・ifx-index・ifx-cmd と生成ページを直した        |

## 5. 対応結果

### 5.1. 実施内容

- `cdt-rulebook` の ID を `cdt-<term>`（例 `cdt-register-type`）に直した。
- `ifx-file-rulebook` の仕様 ID を置き場所で決まる形（プロダクト `ifx-file-<kebab-case>`、プロジェクト `<project-id>:ifx-file-<kebab-case>`）に書き直し、frontmatter と `x-spec-meta` の例、ID 対応の例を名前空間なしにした。
- `ifx-index-template.yaml`・`ifx-cmd-template.yaml` の id を `_LOCAL_ID_` にし、`templates/generated/` の対応ページは同じ置換で更新した（yaml-pages の出力と同じ内容）。
- stsd・cdfd・cdfd-uc・bps・sf・cdfd-overview の rulebook は 1 回目の変更を統合せず、変えていない。

### 5.2. 探した方法と一覧

- `rg` で `prj-0001:(ifx|cdt|stsd|cdfd|bps|sf)-`、`<project-id>:<型>-`、`_PROJECT_ID_:_LOCAL_ID_` を rulebooks・templates・samples から探した。
- 残った `<project-id>:imp-*` は `docs/ja/projects/<project-id>/` の下に置くプロジェクト文書の記述なので変えていない。cdt・ifx の sample には名前空間付きの id はなかった。

### 5.3. CHANGELOG に書く事項

- 区分: Changed
- 文案: `cdt`・`ifx-file` の rulebook と `ifx-index`・`ifx-cmd` の template で、プロダクト文書の id を名前空間なしの形に改めた。

### 5.4. 残課題

- `docs/ja/product/` の既存成果物の id と `based_on` は後続の todo で直す。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
