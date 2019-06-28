jest.mock('../environment.ts', () => ({
  IS_DEV: true,
  IS_PROD: false,
}))

import { Options } from '../entity/options'
import { Status } from '../entity/status'
import { OperationStep } from '../entity/step'
import { Record } from '../record'

describe(`Record`, () => {
  let record: Record

  beforeEach(() => {
    const option: Options = {
      id: 'jestId',
      name: 'PBL录制微件',
      limitTime: 100000,
    }
    record = new Record(option)
  })

  it(`启动函数测试`, () => {
    record.start()
    const actual = record.status
    const expected = Status.Processing

    expect(actual).toBe(expected)
  })

  it(`暂停函数测试`, (done) => {
    expect(record.duration).toBe(0)
    record.start()
    record.pause()
    const druation = record.duration
    const time = 500
    setTimeout(() => {
      const actual = record.status
      const expected = Status.Pause

      expect(actual).toEqual(expected)
      expect(druation).toBe(record.duration)
      done()
    }, time)
  })

  it(`停止函数测试`, (done) => {
    record.start()
    const time = 1100
    const targetDuration = 1000
    setTimeout(() => {
      let duration = record.duration
      expect(duration).toBeGreaterThan(targetDuration)

      record.stop()
      const actual = record.status
      const expected = Status.Stop
      duration = record.duration

      expect(actual).toEqual(expected)
      expect(duration).toBe(0)
      done()
    }, time)
  })

  it(`计时器测试`, (done) => {
    record.start()
    const seconds = 2100
    setTimeout(() => {
      const expected = 2000
      const actual = record.duration
      expect(actual).toBeGreaterThan(expected)
      done()
    }, seconds)
  })

  it(`微件记录测试`, (done) => {
    record.start()
    const time = 500
    setTimeout(() => {
      const duration = record.duration
      const recordStep: OperationStep = {
        event: (a: number, b: number) => {
          return
        },
        args: [1, 1],
        duration: 0,
        eventScopeObject: null,
      }
      record.recordOperation(recordStep)
      const lastStep = record.steps[record.steps.length - 1]
      expect(recordStep.timer).toBe(duration)
      expect(recordStep.event).toEqual(lastStep.event)
      expect(recordStep.args).toEqual(lastStep.args)
      done()
    }, time)
  })
})
