import { ReplayOptions } from './entity/options'
import { ReplayModel, Status } from './entity/status'
import { OperationStep } from './entity/step'

/**
 * 回放组件
 */
export class Replay {
  // 当前步骤
  private _index = 0

  private _status: Status = Status.Stop

  /**
   * @param options 微件参数
   * @param steps 复原步骤
   */
  constructor(
    readonly options: ReplayOptions,
    readonly steps: OperationStep[]
  ) {
    this.options = options
    this.steps = steps
  }

  async start() {
    this._status = Status.Processing
    switch (this.options.mode) {
      case ReplayModel.Auto:
        await this.autoReplay()
        break
      case ReplayModel.Manual:
        // TODO next()
        await this.next()
        break
      default:
    }
  }

  pause() {
    // TODO 手动状态下没有暂停和恢复一说，因为是手动控制
    this._status = Status.Pause
  }

  resume() {
    // TODO 手动状态下没有暂停和恢复一说，因为是手动控制,要做check
    if (this.options.mode === ReplayModel.Manual) {
      return
    }

    this._status = Status.Processing
    this._index++
    // tslint:disable-next-line: no-floating-promises
    this.autoReplay()
  }

  async next(index?: number) {
    if (this._index === this.steps.length - 1) {
      return
    }
    if (index) {
      this._index = index
    } else {
      this._index++
    }
    const step = this.steps[this._index]
    // tslint:disable-next-line: no-unused-declaration
    const result = await this.replay(step)
    if (this._index === this.steps.length - 1) {
      this.options.done()
    }
  }

  get index() {
    return this._index
  }

  get status(): Status {
    return this._status
  }

  private replay(step: OperationStep): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        const args = step.mockData
          ? step.args.concat([step.mockData])
          : step.args

        let scope = null
        if (typeof step.eventScopeObject === 'string') {
          // tslint:disable-next-line: no-any
          scope = (window as any)[step.eventScopeObject]
        } else {
          scope = step.eventScopeObject
        }

        // tslint:disable-next-line: no-unsafe-any
        scope[step.event].apply(scope, args)
        // step.event(...args)

        setTimeout(() => {
          resolve(true)
        }, step.duration)
      } catch (error) {
        // tslint:disable-next-line: no-console
        console.error(`replay error on step ${step.index}`, step, error)
        reject(error)
      }
    })
  }

  private async autoReplay() {
    if (this._index >= this.steps.length) {
      this._index--
      this.options.done()

      return
    }
    await this.replay(this.steps[this._index])

    if (this._status !== Status.Processing) {
      return
    }

    this._index++
    setTimeout(async () => {
      await this.autoReplay()
    }, this.options.interval)
  }
}
