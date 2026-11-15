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
| 4   | review 待ちのうち人の担当の項目（PJR-B0B8。GQ14・V5AZ・Q8KP・SZGZ は close 済み）                                               | 1    | 中身の確認と close。0.8.0（PJR-PMK6）に含めるかの判断にもかかわる                                |
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

### 1.4. 残りの 140（5）の確認項目

2026-11-15 時点の grade と本文から、21 件を確かめることの中身で 6 つに分けた。重複が 2 組あるため、成果物は 19 件。

| 区分 | 対象（track）                                                                                                                                                   | 状況                                                                                                                                          | 確認してほしいこと               | 推奨                                                                                                                                                               |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A    | cdfd-plan・cdfd-do・cdfd-check・cdfd-action・cdfd-onboarding・cdfd-orchestrator・cdfd-uc-deliverable（data-flow-pdca、7 件）                                    | 文書は廃止済みで `archive/ja/product/trash/` へ移してある                                                                                     | 廃止のまま確定しないことでよいか | 140 を `exec cancel` で取り下げる                                                                                                                                  |
| B    | cdfd-uc-register（data-flow-pdca と business-specs-kata-2）、stsd-task-execution（business-specs-kata-2 と stsd-pilot）                                         | 同じ成果物の 140 が 2 つの track にある                                                                                                       | 1 回の確定で両方を閉じてよいか   | 片方で確定し、もう片方は同じ判断で完了にする                                                                                                                       |
| C    | cdfd-uc-register（pass 100、4/4）、clis-exec-commands（pass 84、5/5）、pm-roles（pass 99、3/3）、pm-plan（pass 98、3/3）、pm-organization（needs-work 92、3/3） | 完了条件をすべて満たす。project-kata の 3 件は本文がすでに `status: ready`                                                                    | 確定してよいか                   | 確定する（型の grade を確かめてから）                                                                                                                              |
| D    | pm-quality-management-plan（2/3）、pm-raci（2/4）、prj-assumptions-constraints-dependencies（1/4）、prj-comparison-of-alternatives（2/4）                       | 本文はすでに `status: ready` だが、grade が 2026-10 のもので完了条件を満たしていない                                                          | 今の本文で grade し直してよいか  | grade し直し、満たせば確定、満たさなければ差し戻して手直しの todo を起票する                                                                                       |
| E    | ifx-cmd-ai-provider-cli（needs-work 96、5/5）                                                                                                                   | 完了条件は満たすが、本文に未決の目印が 7 か所ある（`timeout_seconds`・`max_parallel`・`max_attempts` の値、起動時間の上限、未決事項の判断者） | 値を決めるか、留保にするか       | 値は exec-defaults.yaml の設定を正本として参照する形にし、決められない上限は留保（追跡先は PJR-H90H）として確定する                                                |
| F    | stsd-task-execution（needs-work 79、0/5）、cdsd-execution（needs-work 65、0/3）                                                                                 | 完了条件を満たしていない                                                                                                                      | 差し戻してよいか                 | 差し戻し、手直しの todo を起票する。stsd-task-execution の指摘（担当者の権限と引き継ぎ、claim の持ち主）は PJR-M495・T4G3 と同じ論点なので、それらの結果を取り込む |

### 1.5. kata-wave-2 の 140（7）の確認項目

2026-11-15 に成果物と型を grade し直した結果。4 件とも、このままでは確定できない。

| 成果物                  | 成果物の grade     | 未充足の完了条件                                                                                                                        | 型の grade                                                   | 推奨                                                                 |
| ----------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------- |
| bac-task-completion     | needs-work 95、3/4 | DC-003（ARC）: 受入の条件を実装で満たせることを確かめる設計の参照がない                                                                 | rulebook 100・sample 98                                      | 設計の参照を足す小さな手直しの todo を起票し、直したら確定する       |
| bds-progress-report     | needs-work 85、2/3 | DC-002（PO）: 報告の期間の終わりの境界が決まっていない                                                                                  | rulebook 95・sample 64（major 17）                           | 差し戻し。sample と成果物を最新の grade の指摘で直す todo を起票する |
| sld-specdojo            | needs-work 79、0/3 | `.specdojo` の設定の保管、grade の lock と実行状態の置き場所、片付けてよい範囲（動いている grade のファイルを消してよいとしている誤り） | rulebook 97・sample 69（major 13）                           | 差し戻し。同上                                                       |
| ifx-file-agent-evidence | needs-work 85、2/3 | DC-003（QE）: 欠けた・壊れたファイルの扱いを確かめるテストの設計がない                                                                  | rulebook 91・sample 75（major 9、YAML の書き方の誤りを含む） | 差し戻し。同上                                                       |

- 4 件とも本文に未決の目印が 2〜4 か所残る。手直しの todo で、判断できるものは決め、決められないものは留保として追跡先をつなぐ。
- 型の rulebook はどれも pass のため、手直しは sample と成果物に絞る。4 件の 140 は手直しが終わるまで blocked にする。

## 2. 背景・文脈

2026-11-15 に orchestrator が会話の中で示した推奨を、会話の外でも見返せるように残す。kata-wave-1 の型の grade は 22 件中 21 件が pass（sysd-index の rulebook だけ major 1 件。template の id の書き方）。代表の成果物は blocker 0 件で、major の多くは判断者・時期・承認の記録の欠けで、確定の判断で片付く。sysd の 3 件は PJR-Y2X4・39AB を追跡先とする留保として、本文の書き換えを済ませた（a46d2710b）。

## 3. フォローアップ

- 利用者の判断が出たら、項目ごとに結果と日付をここに書く。
- 2026-11-15: 1 は推奨のとおり承認。起票の A を PJR-AK5V、B を PJR-CJMN として起票し、7 件の本文に判断と留保を書いた。2 の確定の実行は 2026-11-15 に承認。完了条件を満たした cxd・cpd・sysd-index・sysd-critical-flows・sysd-cross-cutting-policy を確定し、残る 6 件は今の本文で grade し直してから確定か差し戻しを決める。
- 2026-11-15: 3 は起票を承認。C を PJR-V2GH、D を PJR-ED0K、E を PJR-M495、F を PJR-BJ7E として起票した。
- 2026-11-15: 6 件を grade し直した結果で、dct-index を確定、ifd-specdojo と ifx-index を留保付きで確定した。sf-index・bes-index・cnd-specdojo は差し戻し、手直しの todo を PJR-VEHX・X1RW・Q9DF として起票した（kata-wave-1 の確定は 11 件中 8 件）。
- 2026-11-15: 4 は、PJR-GQ14・V5AZ・Q8KP・SZGZ を close した。GQ14 は、ケースの選び方の早見図から共通の運用・品質管理の枝を外し、章の番号での参照を題名に直してから close した。残りは PJR-B0B8 の 1 件。
- 2026-11-15: ifx-index の扱いを決めた。YAML を正本のまま残し、用語集と同じく yaml-pages build で表形式のページを生成する（PJR-QJ41）。schema のファイル名を古い略号 `esil` から改める（PJR-SBNB、QJ41 とは独立）。
- 2026-11-15: review の穴 2 件を起票した。grade が失敗しても review が完了する件を PJR-M18B、型を整備する schedule の review で型の grade が流れない件を PJR-X05N とした。
- 2026-11-15: 7（kata-wave-2 の 140）は、bac-task-completion と sld-specdojo の成果物の grade と、4 つの型の grade を流し直し中。揃ってから判断材料を示す。
- 2026-11-15: 1.4 と 1.5 は推奨のとおり承認。A の 7 件を取り下げた。B・C の cdfd-uc-register（2 track）・clis-exec-commands・pm-roles・pm-plan・pm-organization を確定した。E の ifx-cmd-ai-provider-cli を留保付きで確定した（値は schema の都合で目印のまま置き、追跡先は close 済みの H90H から PJR-39AB・Y2X4 に付け替えた）。F と 1.5 の 7 件を差し戻し、手直しの todo を PJR-2C9W・PEJQ・W63Q・D948・JFRX・C6BA・3HXQ・KV37・6XWP として起票した。D の 4 件は grade し直し中。
- 2026-11-15: 未 commit の実行記録は、ログの配置の変更が原因ではなく、runner が統合の後のイベントを 8 月から commit しておらず orchestrator が手で補っていた作業が引き継がれなかったためと分かった（PJR-DVNV に追記）。develop に commit されていない実行記録が 465 件たまっていたため、まとめて commit し、runner が統合の後の記録を commit する件を PJR-DVNV として起票した。
- 2026-11-15: 6 のうち PJR-SJ3Q に回答した。実装の段の型は agent 向けのコーディング規約（言語別の instructions）の 1 種類だけにし、型の作成を PJR-981V として起票した。
- 2026-11-15: 6 のうち PJR-BRCG を決めた。日本語を正本とし、英語は更新をまとめて訳して追う。コードの多言語化（PJR-C0HH、0.8.0 の後）と文書・型の英語化（PJR-CYHR、設計までの型の確定の後）の 2 つの epic を起票した。
- 2026-11-15: 6 のうち PJR-PMK6 は 0.8.0 で出すことに決め、型は極力最新を取り込み、足元の不具合（SBNB を含む）を直してから出す方針とした。
- 2026-11-15: 6 のうち PJR-3R8F に暫定の比較とお勧めを書いた（D：Vitest を中心とする独自構成を土台にし、対話の出来の採点が要るときに Promptfoo を足す）。決めるのは最小検証の後とし、検証を PJR-FNB7 として起票した。
- 2026-11-15: 6 のうち PJR-11EX に回答候補とお勧めを書いた（C：GitHub Actions 上の GitHub App を統合専用 actor とし、runner は branch を push するだけにする）。複数人の運用に移る前に決める。
- 未決のまま: 6（問い・決定と PO の todo の残り。3R8F は FNB7 の結果待ち、11EX はお勧めの承認待ち）、8（成果のない worktree の削除）。D の 4 件は 2026-11-15 に grade し直したが完了条件を満たさず、差し戻して手直しの todo を PJR-Y5AC・Y5XH・TVWR・CPZH として起票した（本文は status: ready のまま）。

## 4. 関連ドキュメント

- [[prj-0001:pjr-y2x4-sysd-critical-flows-conformance]]
- [[prj-0001:pjr-39ab-sysd-cross-cutting-policy-conformance]]
- [[prj-0001:pjr-dd33-kata-wave-2]]
- [[prj-0001:pjr-pmk6-release-v0-8-0]]
