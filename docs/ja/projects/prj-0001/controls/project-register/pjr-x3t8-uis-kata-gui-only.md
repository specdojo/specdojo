---
specdojo:
  id: prj-0001:pjr-x3t8-uis-kata-gui-only
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  registered_at: "2026-11-08T06:48:38Z"
  completed_at: "2026-11-08T07:44:24Z"
  conclusion: uis-rulebook を GUI の画面仕様だけにし、CLI は clis で書くと案内した。サンプルの章を消し、uis-sample を GUI の販売登録画面の完成例にした
  derived_from:
    - PJR-2GD6
    - PJR-RMMM
  depends_on:
    - PJR-VMXK
  approach: rulebook-maintenance
  targets:
    - specdojo:uis-rulebook
---

# PJR-X3T8 画面仕様（uis）の型を GUI の画面仕様だけにし、サンプルの章を外す

## 1. 概要

PJR-0YNQ で uis に足した CLI 向けの部分を外して GUI の画面仕様だけにし、rulebook の「8. サンプル」の章を消す

## 2. 入力

- PJR-RMMM（indie が決定、2026-11-08）: uis は GUI の画面仕様だけにし、rulebook の「8. サンプル」の章を消す（完成例は uis-sample にあるため）。

## 3. 完了条件

- [[specdojo:uis-rulebook]] を GUI の画面仕様だけの規則にしている。PJR-0YNQ で CLI 向けに足した記述（CLI のコマンド群を画面に見立てる、コマンドからコマンドへの流れなど）を外し、CLI は clis（`specdojo:clis-rulebook`）で書くと案内している。
- rulebook の「8. サンプル」の章を消し、後の章の番号を詰めている。完成例は frontmatter の `sample`（`uis-sample`）で示す。
- `uis-sample` を GUI の画面の完成例にしている（駄菓子屋の販売管理システムの画面）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている（PJR-PJYJ の材料にする）。
- clis の型と、prj-0001 のカタログは変えていない。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分（追加・変更・不具合修正など）と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run test:unit` が通っている。

## 4. 作業内容

| No  | 作業                                             | 担当     | 状態 | メモ                                                          |
| --- | ------------------------------------------------ | -------- | ---- | ------------------------------------------------------------- |
| 1   | uis の型から CLI 向けの記述を洗い出す            | executor | done | CLI見立て・コマンド流れ・リファレンス参照の記述を特定         |
| 2   | GUI だけの規則と sample にし、サンプルの章を消す | executor | done | GUI画面仕様の規則に純化、完成例をsampleへ外出し、章番号を調整 |
| 3   | 検査を流し、決めた点と理由を対応結果に書く       | executor | done | 全検査通過、決定事項・理由・CHANGELOG文案・残課題を記録       |

## 5. 対応結果

### 5.1. 実施内容

1. **rulebook の手入れ（`specdojo:uis-rulebook`）**:
   - PJR-0YNQ で uis に追加されていた CLI 向けの記述（CLI のコマンド群を画面に見立てる、コマンドからコマンドへの流れ、コマンドリファレンスの正本参照など）をすべて削除し、GUI の画面仕様のみを対象とする規則に純化した。
   - CLI の仕様は新設された CLI仕様（[[specdojo:clis-rulebook|specdojo:clis-rulebook]]）で記述するよう案内を追加した。
   - [[specdojo:rulebook-authoring-standard|Rulebook 記述標準]] に従い、「8. サンプル」の章を削除し、後続の「9. 運用ルール」を「8. 運用ルール」へ番号を詰めた。完成例は Frontmatter の `sample`（`specdojo:uis-sample`）で示す形式とした。
   - 画面仕様の章構成を GUI に最適化した全8章（概要、対象ユーザー/利用目的、表示項目、操作、遷移、バリデーション、エラー表示と利用者の次の手、メモ / 将来課題）とし、grade finding（F001〜F005）の指摘（`type: ui` の一貫性、Frontmatter 定義表の網羅等）をすべて解消した。
2. **GUI 完成サンプル（`specdojo:uis-sample`）の作成**:
   - 駄菓子屋きぬやの販売管理システムにおける GUI 画面（店舗レジの販売登録画面）を題材とした完成例を作成した。
   - ヘッダー情報、入力欄、明細一覧、計算サマリーなどの表示項目、各種ボタン・スキャン操作、画面間遷移、入力バリデーション、および代表的なエラー表示と「利用者の次の手（回復アクション）」を網羅した。
3. **CHANGELOG 文案の作成**:
   - `CHANGELOG.md` は変更せず、利用者に影響する変更内容を「5.5. CHANGELOG に書く事項」に区分と文案で記録した。

### 5.2. 成果物

- [[specdojo:uis-rulebook]]: `docs/ja/specdojo/rulebooks/uis-rulebook.md`
- [[specdojo:uis-sample]]: `docs/ja/specdojo/samples/uis-sample.md`
- 個票: `docs/ja/projects/prj-0001/controls/project-register/pjr-x3t8-uis-kata-gui-only.md`

### 5.3. スキーマ（schema）変更の要否と理由

- **スキーマ変更なし**: 画面仕様（uis）は Markdown 形式（`target_format: markdown`）の成果物であり、`docs/specdojo/schemas/v1/` に専用の YAML/JSON スキーマは存在しない。Frontmatter は共通の `deliverable-frontmatter.schema.yaml`（`type: ui`）および `rulebook-frontmatter.schema.yaml` に適合しており、スキーマ変更および後方互換性への影響はない。

### 5.4. 規則と sample の書き方で executor が決めた内容と理由（PJR-PJYJ への判断材料）

1. **本文構成における「操作の流れ」の見直し**:
   - 決定: PJR-0YNQ で追加された「操作の流れ（どのコマンドからどのコマンドへ進むか）」を本文要件から除外した。
   - 理由: 1ファイル = 1画面を原則とする GUI 画面仕様において、画面内の手順を「操作の流れ」として独立章にすると「操作」および「遷移」との重複が生じ、禁止事項である「クリック手順の逐語列挙」を誘発しやすいため。GUI 画面では「表示項目」「操作」「遷移」の組み合わせでユーザー対話が十分に表現できるため。
2. **「エラー表示と利用者の次の手」の維持**:
   - 決定: PJR-0YNQ で導入された「エラー表示と利用者の次の手」は、GUI 画面仕様でも必須の章として維持した。
   - 理由: 画面上でエラーメッセージが表示された際に、ユーザーがどのような操作で回復・業務継続できるかのアクション（次の手）が明記されていることは、業務仕様としての実効性およびテスト設計・実装の明確化において不可欠であるため。
3. **完成サンプルの題材選定**:
   - 決定: 駄菓子屋きぬやの販売管理システムにおける「販売登録画面（レジ端末画面）」を完成サンプルとした。
   - 理由: `uis-exec-commands` や旧 sample と業務文脈の一貫性を保ちつつ、一覧・入力・サマリー計算・ダイアログ遷移・バリデーション・エラー回復といった GUI 画面仕様に必要なすべての要素を網羅する代表的な画面として最適であるため。

### 5.5. CHANGELOG に書く事項

- **区分**: 変更
- **行の文案**:
  - 画面仕様（uis）の型から CLI 向けの記述を除外して GUI 画面仕様のみの規則に純化し、サンプルの章を削除して完成例を uis-sample に外出し（`specdojo:uis-rulebook`, `specdojo:uis-sample`）

### 5.6. 残課題・申し送り

- 完了条件に従い、clis の型および prj-0001 のカタログ（`dct-*.yaml`）は本タスクでは変更していない。後続の確認・確定タスク（[[prj-0001:pjr-pjyj-clis-uis-kata-confirm]]）にて、uis / clis の型の確定と、カタログにおける代表成果物の位置づけ確認を行う。

## 6. 関連ドキュメント

- 決定: [[prj-0001:pjr-rmmm-uis-kata-confirm]]
- 対象: [[specdojo:uis-rulebook]]
- 後続: [[prj-0001:pjr-pjyj-clis-uis-kata-confirm]]
