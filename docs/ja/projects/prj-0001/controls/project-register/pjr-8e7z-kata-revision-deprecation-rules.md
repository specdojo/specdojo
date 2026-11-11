---
specdojo:
  id: prj-0001:pjr-8e7z-kata-revision-deprecation-rules
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: low
  difficulty: medium
  owner: sol-executor
  registered_at: "2026-11-10T12:26:29Z"
  derived_from:
    - PJR-T88P
  autopilot: approved
---

# PJR-8E7Z 業務仕様の型に、文書の改訂と廃止のときに関係する文書を追って直す決まりを足す

## 1. 概要

bes・br・bdd の型の grade（2026-11-10）が、supersedes の使い方、deprecated への移行、参照元の bps・bel・実装・テストへの影響の追い方、担当の Role がないと指摘した。型ごとではなく共通の決まりとして決め、各型に反映する

## 2. 入力

- grade の run id kata-bsk-20261110 の minor の指摘（bes-rulebook・br-rulebook・bdd-rulebook）から。軽い指摘は型を確定したうえで後で直す（indie が決定）。

## 3. 完了条件

本タスクの完了条件の仮説を次のとおり設定し、作業基準とした。

1. `document-metadata-standard.md` に、成果物ドキュメントの改訂（`supersedes`）・廃止（`deprecated`）、ダウンストリーム（一覧・プロセス・データ・実装・テスト）への影響追跡、担当 Role code、および未決事項の PJR 引き継ぎに関する共通原則が規定されていること。
2. `rulebook-authoring-standard.md` に、各 rulebook が成果物の改訂・廃止時の手順や影響追跡を定義する際の共通基準への準拠要件が明記されていること。
3. `bes-rulebook.md` に、BES 改訂時の `supersedes` 運用と `deprecated` 移行、BEL・BPS・実装・テストへの影響追跡手順、および担当 Role code が明記されていること。
4. `br-rulebook.md` に、BR 改訂時の `supersedes` 運用と `deprecated` 移行、ライフサイクル操作（更新・廃止・問い合わせ対応）、BPS・実装・テストへの波及影響追跡、担当 Role code、およびレポート引き継ぎ（PJR への登録手順）が明記されていること。
5. `bdd-rulebook.md` に、アップストリーム（正本スキーマ/型）でのフィールド削除に対する運用パス（レガシーアノテーション退避または互換バージョン固定）、担当 Role code、および手動照合条件との整合が明記されていること。
6. 親 runner による allowlisted 検証および必要な静的検査に適合していること。

## 4. 作業内容

| No  | 作業                                                                                                      | 担当           | 状態 | メモ                                                                    |
| --- | --------------------------------------------------------------------------------------------------------- | -------------- | ---- | ----------------------------------------------------------------------- |
| 1   | grade 結果と既存 rulebook・標準文書の現状調査                                                             | `sol-executor` | done | 指摘内容（F001〜F003）および関連文書の構造を確認                        |
| 2   | `document-metadata-standard.md` に文書改訂・廃止とライフサイクル変更管理の共通規約を追加                  | `sol-executor` | done | `supersedes`, `deprecated`, 波及影響追跡, Role code, PJR 引き継ぎを定義 |
| 3   | `rulebook-authoring-standard.md` に共通規約への準拠要件を追記                                             | `sol-executor` | done | 各 rulebook が共通規約に従って追従対象と役割分担を定義する原則を明記    |
| 4   | `bes-rulebook.md` に改訂・廃止手順、BEL・BPS 等への波及影響追跡、Role code を反映                         | `sol-executor` | done | F001, F003 を解消                                                       |
| 5   | `br-rulebook.md` にライフサイクル操作、BPS 等への波及影響追跡、Role code、PJR 引き継ぎを反映              | `sol-executor` | done | F001, F002, F003 を解消                                                 |
| 6   | `bdd-rulebook.md` にアップストリーム削除時の運用パス（アノテーション退避/互換版固定）と手動照合条件を反映 | `sol-executor` | done | F001, F002 を解消                                                       |
| 7   | 個票の対応結果の記録と静的検査・検証の実施                                                                | `sol-executor` | done | 規約適合確認                                                            |

## 5. 対応結果

### 5.1. 実施概要

業務仕様の型（BES, BR, BDD）の継続品質評価（grade）で指摘された、`supersedes` の運用、`deprecated` への移行、参照元（BEL, BPS, データ, 実装, テスト）への波及影響追跡、および担当 Role code の欠落に対応した。個別型へ個別対応するのではなく、まず `docs/ja/specdojo/standards/document-metadata-standard.md` に共通のライフサイクル変更管理規約を策定した上で、各 rulebook へ反映した。

- `document-metadata-standard.md`: `6.3. 文書の改訂・廃止とライフサイクル変更管理（supersedes と deprecated）` を新設し、改訂・置き換え時の `supersedes` 運用、廃止・非推奨化時の `deprecated` 移行、ダウンストリーム（一覧・プロセス・データ・実装・テスト）への影響追跡、担当 Role code（BA, PO, ARC, DEV, QE, PM）の責務分担、および未決事項の PJR 引き継ぎ共通手順を規定。
- `rulebook-authoring-standard.md`: 成果物の改訂・廃止・ライフサイクル操作を定義する際の共通基準への準拠要件を追記。
- `bes-rulebook.md`: BES 改訂・廃止時の `supersedes` / `deprecated` 運用、BEL・BPS・実装・テストへの波及影響追跡手順、および担当 Role code を明記（F001, F003 解消）。
- `br-rulebook.md`: BR のライフサイクル操作（更新・廃止・問い合わせ対応）、BPS・実装・テストへの波及影響追跡規則、担当 Role code、およびメモ/将来課題から PJR レコードへの引き継ぎ手順を明記（F001, F002, F003 解消）。
- `bdd-rulebook.md`: アップストリーム（正本スキーマまたは TypeScript 型）でのフィールド削除に対する運用パス（レガシーアノテーション退避または互換バージョン固定）を明記し、手動照合条件との競合を解消（F001, F002 解消）。

### 5.2. CHANGELOG に書く事項

- 区分: 変更
- 文案: 業務仕様の型（BES・BR・BDD）およびドキュメントメタ情報標準に、文書の改訂・置き換え（`supersedes`）と廃止（`deprecated`）時の波及影響追跡手順（一覧・BPS・実装・テストへの追従）、担当 Role code、およびアップストリーム削除時の運用パスを追加

## 6. 関連ドキュメント

- [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]]
- [[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]
- [[specdojo:bes-rulebook|業務イベント仕様 作成ルール]]
- [[specdojo:br-rulebook|ビジネスルール 作成ルール]]
- [[specdojo:bdd-rulebook|業務データ辞書 作成ルール]]
- [[prj-0001:pjr-t88p-business-specs-kata|PJR-T88P]]
