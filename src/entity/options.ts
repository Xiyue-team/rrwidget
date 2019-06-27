import { ReplayModel } from './status'

/**
 * 微件配置选项
 */
export interface Options {
  // 微件业务id
  id: string
  // 微件名称
  name: string

  // 限制操作时间
  limitTime?: number
}

export interface ReplayOptions extends Options {
  // 自动还是手动模式
  mode: ReplayModel

  // 间隔, 仅仅在自动模式下生效
  interval: number

  done: () => void
}
