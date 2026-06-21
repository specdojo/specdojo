import { describe, expect, it } from 'vitest'
import { extractBlockReason } from '../../src/exec-run.js'

describe('extractBlockReason', () => {
  it('prefers the tagged `blocked:` line from edit agents', () => {
    const stderr = [
      'some warning from the toolchain',
      'blocked: depends_on dct-foo unresolved; need=resolve dependency; ref=docs/foo.md',
    ].join('\n')

    const actual = extractBlockReason(stderr)

    expect(actual).toBe(
      'agent exited with non-zero code: blocked: depends_on dct-foo unresolved; need=resolve dependency; ref=docs/foo.md'
    )
  })

  it('prefers the tagged `review-blocked:` line from review agents', () => {
    const stderr = 'review-blocked: target file missing; criterion=RVP-001; ref=docs/bar.md\n'

    const actual = extractBlockReason(stderr)

    expect(actual).toBe(
      'agent exited with non-zero code: review-blocked: target file missing; criterion=RVP-001; ref=docs/bar.md'
    )
  })

  it('falls back to the last non-empty line when no tagged line is present', () => {
    const stderr = 'line one\nfatal: something went wrong\n\n'

    const actual = extractBlockReason(stderr)

    expect(actual).toBe('agent exited with non-zero code: fatal: something went wrong')
  })

  it('returns the generic message when stderr is empty', () => {
    expect(extractBlockReason('')).toBe('agent exited with non-zero code')
    expect(extractBlockReason('   \n  \n')).toBe('agent exited with non-zero code')
  })

  it('truncates an overly long reason to keep the block event log readable', () => {
    const longReason = `blocked: ${'x'.repeat(600)}`
    const actual = extractBlockReason(longReason)

    expect(actual.startsWith('agent exited with non-zero code: blocked: ')).toBe(true)
    expect(actual.endsWith('…')).toBe(true)
    // prefix + first 500 chars of the reason + ellipsis
    expect(actual.length).toBe('agent exited with non-zero code: '.length + 500 + 1)
  })
})
