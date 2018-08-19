import { swap } from '../'

const { describe, it, expect } = global

describe('a mock test', () => {
  it('does something', () => {
    expect(true).toBeTruthy()
  })
})

describe('swap', () => {
  it('should not error out because of impurities', () => {
    const page = ['']
    const chunks = [
      { name: 'foo', start: 0, end: 1, turnedOn: false }
    ]

    const result = swap(page, chunks, '#')
  })
})

