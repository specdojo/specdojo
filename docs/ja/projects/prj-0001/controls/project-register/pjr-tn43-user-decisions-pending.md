---
specdojo:
  id: prj-0001:pjr-tn43-user-decisions-pending
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: note
  item_status: open
  priority: medium
  owner: PO
  registered_at: "2026-11-15T07:32:46Z"
---

# PJR-TN43 利用者の判断待ちの一覧と推奨（2026-11-15）

## 1. メモ

利用者（PO）の判断を待っている項目を、急ぐ順に並べる。判断が出たら、該当する行の結果を「フォローアップ」に書き、すべて片付いたら close する。

| 順  | 待っているもの                                                                                                                  | 件数 | 決めてほしいこと                                                                                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------- | ---- | ------------------------------------------------------------------------------------------------ |
| 1   | kata-wave-1 の残り 7 件の確定の推奨（bes-index・ifx-index・cxd・cnd・cpd・ifd・sf-index）                                       | 7    | 「kata-wave-1 の残り 7 件の推奨」の判断・留保と、「起票の候補（確定に伴うもの）」の 2 件でよいか |
| 2   | kata-wave-1 の確定の実行（sysd-index・sysd-critical-flows・sysd-cross-cutting-policy・dct-index は準備済み。1 の 7 件も加わる） | 11   | `status: ready` にして 140 を閉じてよいか                                                        |
| 3   | 道具の欠けの起票                                                                                                                | 4    | 「起票の候補（道具の欠け）」を起票してよいか                                                     |
| 4   | review 待ちのうち人の担当の項目（PJR-B0B8・GQ14・V5AZ・Q8KP・SZGZ）                                                             | 5    | 中身の確認と close。0.8.0（PJR-PMK6）に含めるかの判断にもかかわる                                |
| 5   | 残りの 140（project-kata 7、data-flow-pdca 8、business-specs-kata-2 5、stsd-pilot 1）                                           | 21   | 確定するか。判断材料は orchestrator が作る                                                       |
| 6   | 問い・決定と PO の todo（PJR-SJ3Q・BRCG・PMK6・3R8F・11EX・FQZ5・6JE3・MXQB）                                                   | 9    | 各項目の判断                                                                                     |
| 7   | kata-wave-2 の 140（bac-task-completion・bds-progress-report・sld-specdojo・ifx-file-agent-evidence）                           | 4    | agent の段が終わった後に確定するか                                                               |
| 8   | 成果のない worktree（`prj-0001-T-KATA-WAVE-2-bac-task-execution-005`）の削除                                                    | 1    | 消してよいか（戻せない）                                                                         |

### 1.1. kata-wave-1 の残り 7 件の推奨

承認した判断と留保は、sysd の 3 件と同じく本文の表に「人間の PO が承認した（日付）」「留保を承認（追跡先）」と書いてから確定する。

| 成果物    | 本文の未決事項                                                               | 推奨                                                         |
| --------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------ |
| bes-index | `bes-project-launched`（P-01）と `bes-project-started`（P-14）は同じ出来事か | 別の出来事とする。立ち上げと PDCA の開始は CDFD でも別の領域 |
| bes-index | 一覧の範囲は「14 領域の起点イベントだけ」でよいか                            | 承認する                                                     |
| bes-index | 主体の推定と、事実データとデータモデルの照合                                 | 留保する（起票 A で追う）                                    |
| ifx-index | 対象を AI provider CLI と Git・GitHub にするか                               | 承認する                                                     |
| ifx-index | 社外に公開するか                                                             | 当面は公開しない                                             |
| ifx-index | Git・GitHub 連携の詳細仕様が未着手                                           | 留保する（起票 B で追う）                                    |
| cxd       | 利用者の作業環境で CLI を動かし、Git で共有する構成か                        | 承認する（今の実態どおり）                                   |
| cnd       | 文書サイトには選んだ公開対象だけを渡すか                                     | 承認する（docs-site の今の動きどおり）                       |
| cnd       | 文書サイトの閲覧の認証と配信の仕方                                           | 留保する（運用設計の整備に回す）                             |
| cpd       | CLI の内部の分け方は、今の src の構成どおりの論理分割か                      | 承認する                                                     |
| ifd       | devcontainer で動かす配置と、Tailscale 経由の Ollama 利用                    | 今の構成として承認し、検証していない範囲は留保する           |
| ifd       | クラウド AI に送る範囲、文書の構築と公開の境界                               | 留保する（運用設計・非機能要件の整備に回す）                 |
| ifd       | GitHub への接続の具体化（PATH-07）                                           | 留保する（起票 B で追う）                                    |
| sf-index  | Q-01: BPS・`clis-index` の多くが未作成で対応が暫定                           | 留保する（起票 A で追う）                                    |
| sf-index  | Q-02: カタログの depends_on に参照先の BPS が入っていない                    | 「領域ごとの代表の BPS だけを依存にする」方針を本文に書く    |
| sf-index  | Q-03: 非推奨化の反映をシステムが担う範囲                                     | 留保する（起票 A で追う）                                    |

### 1.2. 起票の候補（確定に伴うもの）

| 記号 | 種類  | 内容                                                                                                                                           | owner |
| ---- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| A    | issue | BPS を作った後に、sf-index（Q-01・Q-03）と bes-index（主体の推定・事実データの照合）の対応を照合し、差があれば本文を直す                       | BA    |
| B    | todo  | Git・GitHub の外部コマンド連携仕様（`ifx-cmd-git-cli`・`ifx-cmd-github-cli`）を作る。ifx-index の未着手の 2 件と ifd の PATH-07 をまとめて扱う | ARC   |

### 1.3. 起票の候補（道具の欠け）

2026-11-15 の kata-wave-2 の立て直しで、orchestrator が手で補ったもの。

| 記号 | 内容                                                                                                                                                      |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C    | `schedule strategy generate --force` が、先頭の `# yaml-language-server: $schema=` の行を落とす。develop の validate-schema が落ち、005 の 3 件が止まった |
| D    | 統合の段で止まった schedule のタスクを、executor の段からやり直す手段がない（`cannot resume the executor from the integrate stage`）                      |
| E    | 人が `exec unblock` すると claim の持ち主が人に替わり、agent の run が完了の確認（completion preflight）で止まる                                          |
| F    | sample だけの変更でも test-integration が流れ、pipeline-e2e のテストが負荷で時間切れになる（同日 3 回）                                                   |

## 2. 背景・文脈

2026-11-15 に orchestrator が会話の中で示した推奨を、会話の外でも見返せるように残す。kata-wave-1 の型の grade は 22 件中 21 件が pass（sysd-index の rulebook だけ major 1 件。template の id の書き方）。代表の成果物は blocker 0 件で、major の多くは判断者・時期・承認の記録の欠けで、確定の判断で片付く。sysd の 3 件は PJR-Y2X4・39AB を追跡先とする留保として、本文の書き換えを済ませた（a46d2710b）。

## 3. フォローアップ

- 利用者の判断が出たら、項目ごとに結果と日付をここに書く。
- 2026-11-15: 1 は推奨のとおり承認。起票の A を PJR-AK5V、B を PJR-CJMN として起票し、7 件の本文に判断と留保を書いた。2 の確定の実行は未承認。

## 4. 関連ドキュメント

- [[prj-0001:pjr-y2x4-sysd-critical-flows-conformance]]
- [[prj-0001:pjr-39ab-sysd-cross-cutting-policy-conformance]]
- [[prj-0001:pjr-dd33-kata-wave-2]]
- [[prj-0001:pjr-pmk6-release-v0-8-0]]
