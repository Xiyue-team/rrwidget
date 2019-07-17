jest.mock('../environment.ts', () => ({
  IS_DEV: true,
  IS_PROD: false,
}))

import { ReplayOptions } from '../entity/options'
import { ReplayModel } from '../entity/status'
import steps from '../mock/mock.data'
import { Replay } from '../replay'

describe(`Replay`, () => {
  let replay: Replay

  beforeEach(() => {
    // tslint:disable-next-line: no-magic-numbers
    jest.setTimeout(1000 * 10)
  })

  it(`自动回放测试`, (done) => {
    const option: ReplayOptions = {
      id: 'jestId',
      name: 'PBL回放微件',
      limitTime: 100000,
      mode: ReplayModel.Auto,
      interval: 500,
      done: () => {
        /*  const actual = replay.index
        const expected = steps.length - 1 */

        // expect(actual).toBe(expected)
        done()
      },
    }
    replay = new Replay(option, steps)
    done()
    // tslint:disable-next-line: no-floating-promises
    // replay.start()
  })
})
