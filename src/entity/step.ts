/**
 * 微件操作步骤
 */
export interface OperationStep {
  // 事件的作用域对象
  // tslint:disable-next-line: no-any
  eventScopeObject: any
  // 索引
  index?: number
  // 触发事件
  // tslint:disable-next-line: no-any
  event: (...args: any[]) => void

  // 参数,传入参数
  // tslint:disable-next-line: no-any
  args: any[]

  // 持续时长
  duration: number

  // 当前时间节点
  timer?: number

  // 如果涉及得方法内会有随机生成得数据，则需要把生成得数据保存下来，回放时使用该数据
  // tslint:disable-next-line: no-any
  mockData?: any
}
