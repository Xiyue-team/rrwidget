import { Options } from './entity/options'
import { Status } from './entity/status'
import { OperationStep } from './entity/step'

/**
 * 微件录制
 */
// tslint:disable-next-line: no-var-requires
const raf = require('raf')
export class Record {
  private _status: Status = Status.Stop
  // 微件操作时长 毫秒
  private _duration = 0

  // 当前时间,临时变量
  private currentTimestep = new Date().getTime()

  // 配置选项
  private options: Options

  // RAF动画句柄
  private timerHandle = 0

  // 操作步骤
  private _steps: OperationStep[] = []

  constructor(options: Options) {
    this.options = options
  }

  /**
   * 记录微件发来的操作,并附上当前时间节点
   * @param {OperationStep} operationStep
   */
  recordOperation(operationStep: OperationStep) {
    if (this._status !== Status.Processing) {
      throw Error(
        'the record program is not start,please call ’start()‘ or ‘resume()’ method'
      )
    }
    operationStep.timer = this._duration
    operationStep.index = this.steps.length
    this._steps.push(operationStep)
  }

  /**
   * 开始
   * 记录当前时间
   */
  start() {
    this._status = Status.Processing
    this.currentTimestep = new Date().getTime()
    // tslint:disable-next-line: no-unsafe-any
    this.timerHandle = raf(this.processing)
  }

  /**
   * 结束
   * 1.状态修改为结束
   * 2.取消动画句柄
   * 3.运行时间重置
   */
  stop() {
    this._status = Status.Stop
    cancelAnimationFrame(this.timerHandle)
    this._duration = 0
  }

  /**
   * 暂停
   */
  pause() {
    this._status = Status.Pause
  }

  /**
   * 恢复
   */
  resume() {
    this._status = Status.Processing
  }

  get duration(): number {
    return this._duration
  }

  get status(): Status {
    return this._status
  }

  get steps(): OperationStep[] {
    return this._steps
  }

  private processing = () => {
    if (this._status === Status.Processing) {
      this._duration = new Date().getTime() - this.currentTimestep
    }
    // tslint:disable-next-line: no-unsafe-any
    this.timerHandle = raf(this.processing)
  }
}
