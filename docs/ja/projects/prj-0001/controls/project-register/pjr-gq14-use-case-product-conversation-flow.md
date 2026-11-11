---
specdojo:
  id: prj-0001:pjr-gq14-use-case-product-conversation-flow
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  owner: BA
  registered_at: "2026-11-02T12:13:16Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-V5AZ
---

# PJR-GQ14 ユースケース別ガイドを具体的なプロダクト作成の対話フローに改訂する

## 1. 概要

use-case-guide.md を LP・Next.js の Web サービス・Unity のゲームという作りたいもの別に再構成し、相談から成果物作成・検証・運用までの対話フローを示す。PJR-RTD5 の用途別ひな型は提供後に使い方を追記する。

対象は `docs/ja/specdojo/guides/use-case-guide.md`。Quick Start は共通操作を一巡する体験、本ガイドは作りたいものに応じた適用手順を担う。担当は BA、期限は 2026-11-30 と合意した。

### 1.1. 入力とひな型との関係

- LP、Next.js の Web サービス、Unity のゲームという具体的なプロダクトを入口とする構成を利用者と合意した。
- PJR-RTD5 は、`project/prj-0001/develop` 上の個票で `decided` を確認した。ひな型は生成・追加の設定・SpecDojo の 3 層とし、GitHub の template repository を主な入口にする。最初は LP、次に Next.js と Cloudflare を作る方針である。
- ガイドの構成変更はひな型の完成を待たずに進める。決定済みであることと、ひな型が利用可能であることを区別する。
- ひな型が提供された後に、実物を確認して複製・初期化・オーケストレーターとの対話開始・動作確認の使い方を追記する。未提供のひな型や CLI オプションの存在を仮定しない。
- 本項目はガイドの改訂を扱い、ひな型の実装や提供順序の変更は扱わない。

## 2. 入力

- 初回改訂の実物確認で現行仕様との不整合を確認した（2026-11-02、specdojo-orchestrator）。repos は名前をキーにした辞書ではなく name/path を持つ要素の配列。schedule build は --track、exec run --worktree は --register または --task 等の実行対象を明示する。ガイド内の引数不足の例を現行 --help と設定リファレンスに照合して修正する。register add 例には日本語タイトルに対応する --topic と具体的な --description、必要な --input、記帳用 --by specdojo-orchestrator と --commit を入れ、初期 commit と SpecDojo 側の develop ブランチ・設定 commit の前提を Quick Start へ適切につなぐ。
- 同じ完了条件の範囲で、仕様書が ready になれば Hero 等の実装タスクが自動生成されるという説明を修正する。文書カタログを schedule に展開する経路と、宣言済みプロダクトの実装 todo を register から実行する経路を区別し、生成されていない TSK-LP-01 等を実在する task ID として扱わない。コミット・統合は executor ではなく runner が実施し、統合先は承認済み設定に従う。検証はプロダクト側に設定・準備されたものだけを実行可能とし、main への自動統合や typecheck 等の自動実施を無条件に約束しない。人の判断と agent による finalize 操作を混同せず、ready 昇格を AI が一律に禁止されるという記述は現行ガイドに照合する。`dct-*` カタログと成果物文書 ID を混同しない。Next.js 例の同じ todo の重複を除き、例の担当・期限・技術採択は架空の合意例と明示する。
- LP・Next.js・Unity のケース別対話と共通運用への導線は維持する。PJR-RTD5 は LP、次に Next.js + Cloudflare の方針決定であり、スターター提供済みや Unity スターターの採用確定を仮定しない。公開ガイドは prj-0001 の内部個票がない利用者にも読めるようにし、内部の追跡は対応結果へ記録する。実際のプロダクト・保護設定は変更しない。Quick Start の同種の誤記は PJR-V5AZ で修正するため、共通手順はそこへリンクし、use-case-guide.md では同じ誤りを繰り返さない。

## 3. 完了条件

- LP、Next.js の Web サービス、Unity のゲームを作りたい読者が、自分のケースを選べる見出しと導線になっている。
- 各ケースに、完成イメージと前提、最初の相談、確認・判断する事項、必要な成果物と作成順序、register・schedule による進行、完成確認と変更・運用への流れを記載している。
- 対話例は不足事項の確認と提案・承認・実行を示し、担当・期限・判断などの未確定事項を勝手に確定しない。
- コマンドと設定差分は必要な箇所で折りたたむ。共通の導入・操作は Quick Start、詳細は専門ガイドへリンクし、説明の重複を抑える。
- 現行ガイドの共通運用情報を整理し、必要な情報へ各ケースから到達できる。既存の参照元、文書内リンクと早見図を構成変更に合わせて確認する。
- PJR-RTD5 の方針との整合を確認し、提供済みのひな型があれば実物に基づいて使い方を記載する。未提供なら、ひな型を前提としない手順を示し、提供後の追記対象と確認事項を対応結果に残す。この初回改訂の完了は、未提供のひな型の完成を条件にしない。
- Markdown lint と適用される親の文書検証を通し、実施内容・検証結果・ひな型提供後の後続作業を対応結果へ記録する。
- 2 回目の実行（2026-11-11 追加）: 利用者の review で、対話が `chat` のコードブロックで書かれていないと指摘された。次を直している。
  - ユースケース別ガイドの対話（`**オーケストレーター**:` などの太字の話者名で書いた箇所）を、すべて `chat` のコードブロックに書き換える。`.github/instructions/markdown.instructions.md` の「対話コードブロック（chat）」に従い、発言の間に 1 行空ける（PJR-WNQJ で足す書き方）。
  - 対話の中身・順序と、対話の外の本文は変えない。対話に付けたコマンドや設定差分の折りたたみは保つ。

## 4. 作業内容

| No  | 作業                                                             | 担当 | 状態 | メモ                                                                   |
| --- | ---------------------------------------------------------------- | ---- | ---- | ---------------------------------------------------------------------- |
| 1   | Quick Start、専門ガイド、PJR-RTD5 とひな型の提供根拠を確認する   | BA   | done | 決定済みの方針と利用可能な実物を区別した                               |
| 2   | LP・Next.js・Unity の対話と成果物作成・実装の経路を整える        | BA   | done | 文書の schedule とプロダクトの実装 todo を分離した                     |
| 3   | CLI・設定・共通運用情報とリンク・早見図を現行仕様に照合する      | BA   | done | CLI help、設定リファレンス、レビューと exec のガイドに照合した         |
| 4   | 文書検証を行い、ひな型提供後の追記対象と確認事項を対応結果へ残す | BA   | done | executor の検証と、後続 runner・ひな型提供後の作業を分けて記録         |
| 5   | 対話箇所を chat コードブロックへ書き換え、書式を検証する         | BA   | done | .github/instructions/markdown.instructions.md に従い発言間に空行を配置 |

## 5. 対応結果

### 5.1. 改訂内容と完了条件への対応

[[specdojo:use-case-guide|ユースケース別ガイド]] を確認・改訂した。前回の中断時に残っていた個票の完了記述を実物と照合し、初回改訂に残っていた仕様不整合を修正した。

- LP・Next.js Web サービス・Unity ゲームのケース見出しと相談対話を維持し、各ケースに完成イメージ、前提、確認事項、文書の作成順序、register / schedule の進行、受け入れ確認・変更・運用への導線を記載した。担当・期限・技術採択は架空の合意例と明示した。
- 文書カタログに文書の ID・パス・完了条件を宣言し、strategy から文書の schedule を生成する経路と、宣言済みプロダクトの実装 todo を register から実行する経路を区別した。仕様書の ready 化による実装タスクの自動生成と、未生成の `TSK-LP-01` を実在扱いする記述を除いた。`dct-*` を成果物文書 ID として示していた例も修正した。
- LP の Hero、Next.js の一覧 API、Unity の Player Controller について、対象・完了条件の提案、利用者の承認、採番された todo の worktree 実行を示した。Next.js の文書 todo は一度の起票とし、実装 todo を別の作業として記載した。
- `repos` を `name` / `path` を持つ要素の配列に修正し、設定差分を折りたたんだ。初期 commit、SpecDojo 側の develop、承認済み設定の commit、プロダクト側の統合先ブランチの前提は [[specdojo:quick-start-guide|Quick Start ガイド]] へつないだ。重複していた初期化コマンドを整理し、保護設定や実プロダクトは変更していない。
- CLI の現行 help と設定リファレンスを照合し、`schedule build --track`、`exec run --task` / `--register` の実行対象、各 `register add` の `--topic`・具体的な `--description`・`--input`・`--by specdojo-orchestrator`・`--commit` を整えた。個票の対象パス・受け入れ条件・実行する検証を確認してから実行する手順を追記した。
- commit・統合の実施者を runner とし、統合先・方法は承認済み設定に従うとした。検証は各プロダクト側の script・依存・実行環境と設定が準備済みのものに限ると明示した。grade・review・人の最終判断を分け、human タスクを agent に実行させる経路と、人の確定判断を混同しない説明へ修正した。
- 共通運用（register、レビュー、worktree、routine、並行ブランチ）を第 5 章に維持し、各ケースからリンクした。早見図の説明を更新し、文書内リンクには明示アンカーを設けた。参照元は `docs/ja/specdojo/index.md` と全体概要ガイド等を検索し、ガイドのファイル名・文書 ID を継続利用できることを確認した。

### 5.2. 検証と確認範囲

- 現行ソースの CLI help（`register add`、`schedule build`、`exec run`、`exec refresh`、`exec status`、`routine run`）と、設定・Schedule 設計・register・exec・レビューの専門ガイドを照合した。
- Prettier、変更 Markdown の markdownlint、project の catalog 検証、register の生成検査、既存差分のイベント YAML の schema 検査を実施した。文書内アンカー・wikilink の参照先、シェル例の構文と CLI オプションの整合も確認した。VitePress の描画で文書内リンク 17 件と wikilink の参照先 16 ID を確認し、CLI 例 17 件を照合した。カタログ検証は終了コード 0 で、対象外の未作成プロダクト文書に関する警告が出たため、これを未確認範囲として引き継ぐ。コマンドと結果の詳細は executor evidence に記録する。
- 親 runner が担当する lint・schema・typecheck・単体／結合テストは executor では重複実行せず、後続の親検証に委ねる。親検証結果は runner が evidence / result に追記する。
- 実際の LP・Next.js・Unity の生成、agent の起動、デプロイ、DB・Unity の実行は本改訂では行っていない。ガイドの例と実装・設定の照合までを確認範囲とする。Quick Start の同種の修正は [[prj-0001:pjr-v5az-quick-start-conversation-flow|PJR-V5AZ]] に委ね、本項目では重複編集していない。

### 5.3. ひな型の確認結果と提供後の追記（handoff）

[[prj-0001:pjr-rtd5-starter-templates|PJR-RTD5]] の決定を確認した。構成は生成・追加設定・SpecDojo の 3 層、入口は GitHub template repository、提供順序は LP、次に Next.js + Cloudflare である。Unity スターターの採用・提供は確定していない。

参照した決定文書とリポジトリの配布テンプレート・初期化実装には、用途別スターターの利用可能な実物・公開先を確認できなかった。外部の公開状況までは検証していない。本ガイドはひな型の利用を前提にせず、通常のプロダクト作成と SpecDojo 接続の手順で完結させた。公開ガイドから内部個票への依存を除き、追跡を本節に集約した。

提供後に行う追記・確認は次のとおり。これは未提供のひな型の完成を待たないという本項目の完了条件に従う後続作業である。

1. LP ひな型の実物と公開先を確認し、複製、project ID・名前の初期化、追加設定、SpecDojo 接続、対話開始、プレビューと検証の手順を記載する。
2. Next.js + Cloudflare ひな型の実物で、公式生成・アダプタ等の追加設定・SpecDojo 設定の境界と、複製から build・動作確認までを検証して追記する。ガイド中の Vercel は架空の利用者の選択例であり、提供方針を変更するものではない。
3. 複製で引き継がれないブランチ保護・セキュリティ等の設定と初期化手順を確認し、実物で有効性を確かめる。未実装のコマンドや、検査の自動実行を先取りして記載しない。
4. Unity は採用・提供が決まった場合に限り、LFS、アセット・`.meta` 管理、エディタ・ライセンス・テスト環境、AI と人の作業境界を確認して追加の起票・追記範囲を決める。

result は reporter / runner が記入する。登録簿一覧と個票のステータスは executor では変更していない。開始時から存在する runner のイベント・実行 evidence の差分は保持し、イベント YAML は共通規約の Prettier 整形のみ行った。

### 5.4. 対話コードブロック（chat）への改訂（2回目の実行）

利用者の review 指摘に基づき、[[specdojo:use-case-guide|ユースケース別ガイド]] 内の対話箇所を改訂した。

- ガイド内のすべての対話（2.2、2.4、2.4.1、3.2、3.4、4.2、4.4 の 7 箇所）を、太字話者名（`**利用者**:` / `**オーケストレーター**:`）から `chat` コードブロック記法へ書き換えた。
- `.github/instructions/markdown.instructions.md` の「6.1. 対話コードブロック（chat）」に従い、発言の開始行を `話者名:` で記述し、発言と発言の間に 1 行の空行を設けた。また、複数行にわたる発言や箇条書きは 2 行目以降を字下げ（半角スペース 2 個）で記述した。
- 対話の中身・順序、および対話の外の本文、見出し、コマンド、折りたたみ設定（`<details>`）は変更せず完全に保持した。

## 6. 関連ドキュメント

- [[specdojo:use-case-guide]]
- [[specdojo:quick-start-guide]]
- [[specdojo:orchestrator-operation-guide]]
- [[prj-0001:pjr-v5az-quick-start-conversation-flow]]
- [[prj-0001:pjr-rtd5-starter-templates]]
