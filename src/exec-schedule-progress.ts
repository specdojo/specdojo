import { type CpmResult, type ScheduleCalendar, type ScheduleIndex } from './exec-types.js'
import { formatDateOnlyUtc } from './exec-shared.js'
import { isWorkingDateUtc } from './exec-schedule-calendar.js'

export type ProgressSummaryInput = {
  cpm: CpmResult
  schedule: ScheduleIndex
  stateCounts: Record<'todo' | 'doing' | 'blocked' | 'done' | 'cancelled', number>
  totalTaskCount: number
  readyCount: number
  nextTaskId: string | null
  criticalDoingCount: number
}

function parseDateOnlyUtc(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
}

function addUtcDays(base: Date, days: number): Date {
  return new Date(base.getTime() + days * 86400000)
}

function elapsedWorkingDaysUntil(
  today: Date,
  startDate: string,
  calendar: ScheduleCalendar
): number {
  const start = parseDateOnlyUtc(startDate)
  const current = parseDateOnlyUtc(formatDateOnlyUtc(today))
  if (current <= start) return 0

  let elapsed = 0
  for (let cursor = new Date(start.getTime()); cursor < current; cursor = addUtcDays(cursor, 1)) {
    if (isWorkingDateUtc(cursor, calendar)) elapsed += 1
  }
  return elapsed
}

export function buildProgressSummaryLines(input: ProgressSummaryInput): string[] {
  const lines: string[] = []
  const today = new Date()
  const todayLabel = formatDateOnlyUtc(today)
  const doneEquivalent = input.stateCounts.done + input.stateCounts.doing * 0.5
  const actualPercent = input.totalTaskCount > 0 ? (doneEquivalent / input.totalTaskCount) * 100 : 0

  let status = '要確認'
  let overview = '開始日または進捗比較に必要な情報が不足しています。'
  let cause = '開始日未設定のため、計画との差分を自動判定できません。'
  let actions = ['プロジェクト開始日を設定し、進捗判定条件を確定してください。']

  if (input.cpm.project_start_date) {
    const start = parseDateOnlyUtc(input.cpm.project_start_date)
    const todayDate = parseDateOnlyUtc(todayLabel)

    if (todayDate < start) {
      if (input.stateCounts.doing > 0 || input.stateCounts.done > 0) {
        status = '前倒しで進行中'
        overview = `${todayLabel} 時点では計画開始日 ${input.cpm.project_start_date} 前ですが、先行着手が進んでいます。`
        cause = `開始日前のため本来の進捗遅れはなく、doing ${input.stateCounts.doing} 件で先行準備が進んでいます。`
        actions = [
          '進行中タスクを完了させ、開始日までにクリティカルパスの先頭を空けてください。',
          input.nextTaskId
            ? `次の着手候補 ${input.nextTaskId} の前提条件を開始日までに確認してください。`
            : '開始日までに次の着手候補と担当を確定してください。',
        ]
      } else {
        status = '開始前'
        overview = `${todayLabel} 時点では計画開始日 ${input.cpm.project_start_date} 前です。`
        cause = '未着手でも計画上の遅れではなく、まだ実行開始タイミングに入っていません。'
        actions = [
          '開始日に着手できるように担当者と実行順序を最終確認してください。',
          input.nextTaskId
            ? `最初の着手候補 ${input.nextTaskId} に必要な入力・レビュー観点を事前に揃えてください。`
            : '開始時点の最初の着手候補を確定してください。',
        ]
      }
    } else {
      const expectedPercent = Math.min(
        100,
        (elapsedWorkingDaysUntil(today, input.cpm.project_start_date, input.schedule.calendar) /
          Math.max(1, input.cpm.project_duration_days)) *
          100
      )

      if (input.stateCounts.blocked > 0 || actualPercent + 10 < expectedPercent) {
        status = '遅れ気味'
        overview = `${todayLabel} 時点の実績進捗は ${actualPercent.toFixed(1)}% 相当で、計画進捗 ${expectedPercent.toFixed(1)}% を下回っています。`
        cause =
          input.stateCounts.blocked > 0
            ? `blocked が ${input.stateCounts.blocked} 件あり、滞留が進捗を押し下げています。`
            : `完了・進行中件数が計画消化ペースに対して不足しています。`
        actions = [
          input.stateCounts.blocked > 0
            ? 'blocked タスクの解消担当と期限を直ちに決めてください。'
            : 'クリティカルパス上の進行中タスクを優先完了させてください。',
          input.nextTaskId
            ? `次の着手候補 ${input.nextTaskId} を前倒しで着手できるか確認してください。`
            : 'Ready タスクが不足していないか依存関係と完了登録を確認してください。',
        ]
      } else {
        status = '順調'
        overview = `${todayLabel} 時点の実績進捗は ${actualPercent.toFixed(1)}% 相当で、計画進捗 ${expectedPercent.toFixed(1)}% に対して大きな遅れはありません。`
        cause =
          input.criticalDoingCount > 0
            ? `クリティカルパス上のタスクが ${input.criticalDoingCount} 件進行中で、主要経路の作業が継続しています。`
            : `blocked がなく、Ready タスク ${input.readyCount} 件を維持できています。`
        actions = [
          '進行中タスクの完了登録を遅らせず、実績状態を最新化してください。',
          input.nextTaskId
            ? `次の着手候補 ${input.nextTaskId} を待たせないよう、依存完了の確認を継続してください。`
            : 'Ready タスクを切らさないよう、後続依存の完了条件を継続確認してください。',
        ]
      }
    }
  }

  lines.push(`## 進捗サマリー`)
  lines.push('')
  lines.push(`- 判定: ${status}`)
  lines.push(`- 概況: ${overview}`)
  lines.push(`- 主な要因: ${cause}`)
  lines.push('')
  lines.push(`## 今後のアクション案`)
  lines.push('')
  actions.forEach((action, index) => lines.push(`${index + 1}. ${action}`))
  lines.push('')
  return lines
}
