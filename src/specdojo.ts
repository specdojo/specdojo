#!/usr/bin/env node
import { Command } from 'commander'
import { registerConfigCommands, registerProjectCommands } from './specdojo-config.js'
import { registerExecCommands } from './exec.js'
import { registerCatalogCommands } from './catalog.js'
import { registerScheduleCommands } from './schedule.js'
import { registerIndexCommands } from './index-command.js'
import { registerReviewCommands } from './review.js'
import { registerRegisterCommands } from './register.js'
import { registerWatchCommand } from './watch.js'

function main(): void {
  const program = new Command()

  program.name('specdojo').description('SpecDojo helper CLI').version('0.4.0')

  registerConfigCommands(program)
  registerProjectCommands(program)
  registerExecCommands(program)
  registerCatalogCommands(program)
  registerScheduleCommands(program)
  registerIndexCommands(program)
  registerReviewCommands(program)
  registerRegisterCommands(program)
  registerWatchCommand(program)

  program.parse(process.argv)
}

main()
