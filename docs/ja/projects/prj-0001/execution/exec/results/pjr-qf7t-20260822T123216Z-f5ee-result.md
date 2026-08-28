---
specdojo:
  id: prj-0001:xer-pjr-qf7t-20260822t123216z-f5ee
  type: exec-result
  task_id: PJR-QF7T
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-qf7t-20260822T123216Z-f5ee-plan.md
  started_at: "2026-08-22T12:32:16.739Z"
  completed_at: "2026-08-22T12:58:06.709Z"
  agent: codex-expert-executor
---

# Edit Result

## 1. 実施内容

- PJR-QF7T「planning ドメインとトラックを新設し、計画成果物をカタログとScheduleへ載せる」に対応し、planning ドメイン（dct-planning.yaml）と planning トラックを新設した。
- project-management ドメインから tml-index、dct-index、sch-defaults 関連の登録を planning へ移設した（dct-project-management.yaml で109行削除、dct-index.yaml を7行更新、tml-index.yaml を46行更新）。
- 着手済みトラック分の sch-assessment-planning / sch-assessment-launch / sch-assessment-data-flow、sch-strategy-planning、sch-track-planning を新規（未追跡）ファイルとして追加した。
- node --import tsx src/specdojo.ts schedule build --project prj-0001 --track planning と exec refresh --project prj-0001 はいずれも成功し、planning の8タスクとマイルストーンが生成された。
- npm run validate:schema と npm run validate:catalog は tsx CLI の sandbox IPC 制約（listen EPERM）で直接失敗したが、同一 schema 群を node --import tsx で実行した代替コマンド（catalog validate --project prj-0001）は成功した。
- npm run test:unit は sandbox 上で Vitest worker が終了せず中断したが、関連する11ファイル・116テストを対象限定で実行した結果はすべて成功した。
- 親 runner（source=runner）による npm run test:integration は exit 0 で成功しており、authoritative な検証として failed / not_run のものはない。
- 関連ガイド（docs-structure-guide.md、schedule-design-guide.md、timeline-design-guide.md）、dct-rulebook.md、VitePress サイドバー設定（.vitepress/sidebar-config.ts）を更新した。
- 個票 pjr-qf7t-planning-domain-and-track.md の作業内容・対応結果セクションを更新した。
- npm run typecheck、npm run lint:md、git diff --check はいずれも成功した。

## 2. 変更ファイル

- `.vitepress/sidebar-config.ts`: 1行追加。差分要約より、サイドバー設定への反映と判断される（詳細は evidence の diff summary のみ）。
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-index.yaml`: 7行変更。planning ドメインをカタログ索引へ追加したことに対応する変更。
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-project-management.yaml`: 109行削除。planning 関連の登録を project-management から除去した変更。
- `docs/ja/projects/prj-0001/controls/project-register/pjr-qf7t-planning-domain-and-track.md`: 26行変更。個票の作業内容・対応結果セクションの更新。
- `docs/ja/projects/prj-0001/schedule/sch-milestones.yaml`: 10行変更。generated としての planning マイルストーン反映に対応する変更。
- `docs/ja/projects/prj-0001/timeline/tml-index.yaml`: 46行変更。planning トラックの追加に対応する変更。
- `docs/ja/specdojo/guides/docs-structure-guide.md`: 7行変更。planning ドメインに関するガイド更新。
- `docs/ja/specdojo/guides/schedule-design-guide.md`: 2行追加。
- `docs/ja/specdojo/guides/timeline-design-guide.md`: 2行追加。
- `docs/ja/specdojo/rulebooks/dct-rulebook.md`: 8行追加。
- `src/exec-schedule-index.ts`: 6行変更。
- `tests/src/schedule-build.test.ts`: 23行変更。
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-planning.yaml`: 新規（未追跡）ファイル。planning ドメインのカタログとして新設された。
- `docs/ja/projects/prj-0001/schedule/assessments/sch-assessment-data-flow.yaml`: 新規（未追跡）ファイル。着手済みトラック data-flow の assessment として新設された。
- `docs/ja/projects/prj-0001/schedule/assessments/sch-assessment-launch.yaml`: 新規（未追跡）ファイル。着手済みトラック launch の assessment として新設された。
- `docs/ja/projects/prj-0001/schedule/assessments/sch-assessment-planning.yaml`: 新規（未追跡）ファイル。着手済みトラック planning の assessment として新設された。
- `docs/ja/projects/prj-0001/schedule/sch-strategy-planning.yaml`: 新規（未追跡）ファイル。planning トラックの strategy として新設された。
- `docs/ja/projects/prj-0001/schedule/sch-track-planning.yaml`: 新規（未追跡）ファイル。generated としての planning トラック定義として新設された。

## 3. 申し送り

- npm run validate:schema と npm run validate:catalog はこの実行環境の tsx CLI sandbox IPC 制約（listen EPERM）により直接失敗しているため、非 sandbox 環境（CI 等）で同コマンドを再実行し最終確認することを推奨する。
- npm run test:unit は sandbox 上の Vitest worker 残留により完走しなかったため、非 sandbox 環境でフルスイートを再実行し回帰がないことを確認することを推奨する。

## 4. 進め方と実践の型の適用

登録簿 PJR-QF7T の内容と個票の完了条件を前提に、project-management ドメインに存在していた計画関連成果物（tml-index、dct-index 分類、sch-defaults 系）を新設した planning ドメイン（dct-planning.yaml）へ移設した。着手済みトラック分の sch-assessment-\* と sch-strategy-planning を work/control として登録し、sch-track-planning と sch-milestones は generated として登録することで、`dct-&lt;domain&gt;.yaml` 自身と表示用生成物を登録対象から除外する完了条件に整合させた。schedule build --track planning と exec refresh の成功を実行して Ready タスクの生成を確認し、関連ガイド・rulebook・サイドバー設定を更新した。静的検査は npm run typecheck と npm run lint:md が成功し、npm run validate:schema / npm run validate:catalog は sandbox の tsx CLI IPC 制約で直接失敗したため node --import tsx による同等コマンドで代替検証し成功を確認した。npm run test:unit は sandbox 上の Vitest worker 残留により完走しなかったが、変更に関連する11ファイル・116テストを対象限定で実行し全件成功を確認した。親 runner が実行した npm run test:integration（source=runner）は passed であり、failed / not_run の runner 検証はない。
