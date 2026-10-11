---
specdojo:
  id: prj-0001:pjr-a0ne-not-applicable-check-blocks
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-10-08T14:40:34Z"
  due_on: null
  completed_at: "2026-10-09T03:48:19Z"
  conclusion: 検証の状態 not_applicable（理由必須）を加え、package.json に script や依存がある検査の申告と理由のない申告は機械的に block するようにした。適用外の検査は result の申し送りへ出る。共通規約も not_applicable と理由を書く形に改めた。
---

# PJR-A0NE 適用されない検査を executor が not_run と記録すると、作業が済んでいても止まる

## 1. 課題内容

公開物での実地の確認（2026-10-08、claude）で、executor が共通規約の「適用条件を満たさない検査は記録しない」に従わず、prettier を「package.json にないので適用外」として not_run と記録し、runner の判定で waiting になった。agent が規約に従わないと止まるため、適用外を表す検証の状態（例: not_applicable）を加えて block しないようにするか、規約の伝え方を強めるかを決める。利用者の判断を待つ。

## 2. 影響範囲

| 観点         | 影響                                                                                                               |
| ------------ | ------------------------------------------------------------------------------------------------------------------ |
| スコープ     | executor evidence の schema、`src/exec-reporter.ts` の機械の判定、exec plan の共通規約、exec の案内文書、CHANGELOG |
| スケジュール | v0.3.0 の公開の判定基準 1・3・4 に関わる                                                                           |
| コスト       | 作業が済んでいても waiting になり、利用者の手で再開が要る                                                          |
| 品質         | 適用されない検査を正直に記録した agent が止まる                                                                    |
| 関係者       | exec を使う利用者（provider を問わない）                                                                           |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                      |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 適用外の検査を表す状態がなく、規約は「記録しない」ことを求めるが、agent はやらなかった検査を `not_run` と書きがちで、規約の文面では防げない                               |
| 対応策   | 2026-10-09 に利用者が案 1 を採用した。検証の状態 `not_applicable` を加えて block しないようにし、理由の必須化と機械の反証で抜け道を塞ぐ。下記の「完了条件の詳細」のとおり |
| 依存事項 | PJR-BK4K（`requires_human` の前例）、PJR-44J9（共通規約の適用条件）                                                                                                       |
| 完了条件 | 下記の「完了条件の詳細」を満たす                                                                                                                                          |

### 3.1. 完了条件の詳細

- executor evidence の validations の状態に `not_applicable` を加える。`not_applicable` には適用外とした理由（例: `reason`）を必須にし、schema で検証する。
- `deriveReporterFacts` は、`not_applicable` の検証を block の理由にしない。ただし、次の場合は適用外の申告を認めず、block の理由にする。
  - `npm run <name>`（`npm test` などの短縮形を含む）で、`<name>` がリポジトリの `package.json` の scripts にある。
  - `npx <package>` で、`<package>` が `package.json` の `dependencies` / `devDependencies` にある。
  - 理由がない、または空である。
- `not_applicable` の検証は、コマンドと理由を result の申し送りへ機械的に出す（`requires_human` と同じく、人が後から見て気付けるようにする）。
- 親検証は runner が実行するため、executor の申告に左右されないことを保つ。
- exec plan の共通規約で、適用条件を満たさない検査は「記録しない」から「`not_applicable` と理由を記録する」に改め、規約と機械の判定を一致させる。
- unit test で次を確かめる。
  - 理由付きの `not_applicable` は block しない。
  - script や依存が存在する検査の `not_applicable` と、理由のない `not_applicable` は block する。
  - 申し送りに出る。
- exec-config-guide・exec-operation-guide の検証の状態の説明と、CHANGELOG の v0.3.0 に追記する。
- `npm run check` が通る。

## 4. 対応結果

- executor evidence と公開 schema に、理由必須の `not_applicable` を追加した。
- runner の機械判定は、理由付きの `not_applicable` を block せず、理由欠落、存在する npm script、`dependencies` / `devDependencies` にある package の `npx` 実行を適用外とした申告を block するようにした。
- `not_applicable` のコマンドと理由を edit result の申し送りへ機械的に追記するようにした。親 runner の検証判定は既存どおり executor の申告から独立している。
- exec plan の共通規約、executor prompt、exec 設定・運用ガイド、CHANGELOG を新しい状態と判定に合わせ、evidence の解析・schema、機械判定、result 生成の unit test を追加した。

## 5. 関連ドキュメント

- [[specdojo:exec-config-guide]]（exec の設定）
- [[prj-0001:pjr-p8tk-release-stabilization-criteria]]（公開の判定基準）
