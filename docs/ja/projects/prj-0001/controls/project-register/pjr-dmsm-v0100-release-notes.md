---
specdojo:
  id: prj-0001:pjr-dmsm-v0100-release-notes
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-23T22:38:15Z"
  due_on: "2026-11-30"
  commit_type: docs
  commit_scope: release
---

# PJR-DMSM v0.10.0 の CHANGELOG と移行の注意をまとめる

## 1. 概要

v0.10.0 に入れた項目の CHANGELOG に書く事項を集めて CHANGELOG.md にまとめ、既存の利用者向けの移行の注意を書く

## 2. 入力

- v0.10.0 に入れる（利用者の指定、2026-11-24）
- リリースは 12 月の第 1 週を目標にする（利用者の判断、2026-11-24）

## 3. 完了条件

- v0.10.0 に入れた項目（個票の `入力` に「v0.10.0 に入れる」とあるもの、と close 済みの項目）の対応結果から「CHANGELOG に書く事項」を集め、`CHANGELOG.md` の v0.10.0 の節に区分ごとにまとめる。公開済みの版の節は変えない。集めた項目の一覧と、文案が見つからなかった項目を個票の対応結果に書く。
- 既存の利用者（coderdojo-lessons・OpenFisca-Japan など）向けに、移行の注意を v0.10.0 の節に書く。少なくとも、Antigravity CLI（`agy`）の対応を外したこと、pm-* のログの型の非推奨（PJR-X141）、`specdojo update` での上げ方を含める。
- PJR-XC5P（coderdojo-lessons への申し送り）の内容を移行の注意に取り込み、取り込んだことを XC5P の個票に書く（close はオーケストレーターが確かめてから行う）。
- `package.json` の版の更新とタグの作成は行わない（リリースの手順でオーケストレーターが利用者の承認のもとで行う）。
- `npm run lint:md` を通す。

## 4. 作業内容

| No  | 作業             | 担当 | 状態 | メモ                                                                     |
| --- | ---------------- | ---- | ---- | ------------------------------------------------------------------------ |
| 1   | 文案の収集と照合 | DEV  | done | 再開の指示の 2 組（34 件と 89 件）の個票を読み、下の一覧に区分を記録した |
| 2   | 移行の注意       | DEV  | done | agy、削除した 9 コマンド、ログの型、更新手順、XC5P の注意を記載          |
| 3   | 検証             | DEV  | done | `npm run lint:md` などは親 runner が実行する                             |

## 5. 対応結果

- `CHANGELOG.md` の未公開の `## [0.10.0] - 未公開` の節を、区分（移行の注意・削除・非推奨・追加・利用者から見て動きが変わる点・性能・セキュリティ・型と文書・不具合修正）ごとにまとめた。公開済みの版の節、`package.json` の版、タグは変えていない。
- PJR-XC5P の注意（approach を外した個票と `*-maintenance`、markdownlint の構成と `.markdownlintignore`）を移行の注意に取り込み、XC5P の個票の背景・文脈に取り込んだことを書いた。

### 5.1. 集めた項目と区分

| 区分                         | 項目                                                                                                                                                                                                                                                                                                                                                                             |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 移行の注意                   | PJR-N6FQ、PJR-GV43、PJR-X141、PJR-SJR7、PJR-MS7X、PJR-XC5P                                                                                                                                                                                                                                                                                                                       |
| 削除                         | PJR-N6FQ、PJR-GV43                                                                                                                                                                                                                                                                                                                                                               |
| 非推奨                       | PJR-SJR7（PJR-X141 の決定）                                                                                                                                                                                                                                                                                                                                                      |
| 追加                         | PJR-MS7X、PJR-N5J8、PJR-4VD6、PJR-1JF6、PJR-FBP0、PJR-77FH、PJR-F6MC、PJR-7EZR、PJR-GA72、PJR-B6M3、PJR-9170、PJR-G6NT、PJR-2Q86、PJR-5N1Q、PJR-40EE、PJR-EF4Z、PJR-9XEG、PJR-09HA、PJR-7KQT、PJR-YS9M、PJR-K8F1、PJR-50RQ、PJR-9X52、PJR-XA6Y、PJR-E73Z、PJR-BNAV、PJR-98HS、PJR-WNQJ、PJR-82H2、PJR-F4TG                                                                       |
| 利用者から見て動きが変わる点 | PJR-BBTW、PJR-WNQJ、PJR-N0P1、PJR-ESE7、PJR-KZZM、PJR-7C9X、PJR-EZ4Z、PJR-2RHB、PJR-F636                                                                                                                                                                                                                                                                                         |
| 性能                         | PJR-BEQ8、PJR-BNAV、PJR-XHS8                                                                                                                                                                                                                                                                                                                                                     |
| セキュリティ                 | PJR-PXNQ                                                                                                                                                                                                                                                                                                                                                                         |
| 型と文書（要約）             | PJR-0VPB、PJR-QWG7、PJR-8S4T、PJR-7M9J、PJR-SV9G、PJR-30PT、PJR-325Y、PJR-AEKE、PJR-PHY7、PJR-C7WD、PJR-RPNF、PJR-QHES、PJR-CJMN、PJR-SJC7、PJR-E4MW                                                                                                                                                                                                                             |
| 不具合修正                   | PJR-XSRF、PJR-YQ32、PJR-B6NS、PJR-C11R、PJR-TAHV、PJR-0JVB、PJR-2X6K、PJR-DF5Z、PJR-FGKB、PJR-7TVA、PJR-EKGQ、PJR-77JB、PJR-R8DM、PJR-YCMR、PJR-6690、PJR-A54F、PJR-NRWJ、PJR-TF6F、PJR-1S74、PJR-TN64、PJR-5T0Q、PJR-EEWP、PJR-EF7M、PJR-N4D0、PJR-VQK2、PJR-TJZM、PJR-YY0P、PJR-Q723、PJR-WB78、PJR-G3TT、PJR-1RJP、PJR-22N9、PJR-N5D2、PJR-PP4X、PJR-1HJH、PJR-KYG4、PJR-QTZ7 |

- review の項目: PJR-F4TG・PJR-F636・PJR-N0P1・PJR-PXNQ は review のまま載せ、CHANGELOG の行に「review 中」と書いた。PJR-VM2S も review だが、文案が「なし」のため載せていない。公開の前に、これらが close されたかを確かめ、差し戻されたら行を外すか直す。
- PJR-F636 の文案は「ワークフロー反映後に掲載」としている。公開の前に、CI のワークフローが反映されたかを確かめる。
- PJR-8S4T は 4 回分の文案を 1 行にまとめた。PJR-5N1Q は 2 つの文案を「追加」の 2 行に分けた。kata の rulebook・sample の手直しは「型と文書」に要約した。

### 5.2. 載せなかった項目と理由

| 項目                                                                 | 理由                                                                         |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| PJR-2MR5、PJR-86BN、PJR-EX0D、PJR-K32V、PJR-R05D、PJR-TN50、PJR-Z8MQ | 文案が「なし」（文書の型の手直しのため）                                     |
| PJR-JA3M、PJR-Z17T                                                   | 文案が「なし」（テストだけの変更）                                           |
| PJR-39AB、PJR-SZCR、PJR-HRW6                                         | 文案が「なし」                                                               |
| PJR-6Y05、PJR-BHFG、PJR-VCER                                         | 文案が「なし」（prj-0001 の運用・内部の計画）                                |
| PJR-BM07                                                             | 文案が「なし」（PJR-AEKE の行に含まれる）                                    |
| PJR-HCHH、PJR-RS2P                                                   | 文案が「なし」（利用者に影響のない内部の整理）                               |
| PJR-XZ9B                                                             | 文案が「なし」（skill を配っていない）                                       |
| PJR-VM2S                                                             | review。文案が「なし」（手順と判断の条件を書く項目で、製品の動きを変えない） |

### 5.3. 文案が見つからなかった項目

| 項目     | 状態        | 扱い                                                                       |
| -------- | ----------- | -------------------------------------------------------------------------- |
| PJR-2P7C | decided     | 決定の項目で文案の節がない。決定の実装は PJR-9170・PJR-G6NT の行に含まれる |
| PJR-TQZA | decided     | 決定の項目で文案の節がない。決定の実装は PJR-F4TG の行に含まれる           |
| PJR-36QG | open        | 競合状況の note で、文案の節がない。製品の変更ではないため載せない         |
| PJR-8PXJ | rejected    | 取り下げて PJR-7EZR にまとめた。文案の節がなく、PJR-7EZR の行に含まれる    |
| PJR-1FMG | done        | 0.9.2 のリリースの項目で、内容は公開済みの 0.9.2 の節にある                |
| PJR-DMSM | in-progress | この項目。CHANGELOG のまとめそのもの                                       |

- PJR-7EZR・PJR-7TVA・PJR-B6M3・PJR-GA72・PJR-98HS は、番号付きの小節ではなく対応結果の本文に「CHANGELOG に書く事項」があり、それを使った。
- PJR-X141 は 2 組に入っていないが、完了条件が移行の注意に含めることを求めるため、PJR-SJR7 とあわせて載せた。

## 6. 関連ドキュメント

- [[prj-0001:pjr-xc5p-coderdojo-handoff-v0-4-6|PJR-XC5P]]
- [[prj-0001:pjr-x141-deprecate-pm-log-kata|PJR-X141]]
- [[prj-0001:pjr-ms7x-specdojo-update-command|PJR-MS7X]]
