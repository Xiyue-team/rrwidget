import { OperationStep } from '../entity/step'
const steps: OperationStep[] = []

function generateMockStep(
  mockData1: number,
  mockData2: number,
  mockTimer: number
): OperationStep {
  const step1: OperationStep = {
    event: 'alert',
    args: [mockData1, mockData2],
    duration: 0,
    timer: mockTimer,
    eventScopeObject: null,
  }

  return step1
}

// tslint:disable-next-line: no-magic-numbers
for (let i = 0; i < 9; i++) {
  const mockArg1 = i
  // tslint:disable-next-line: no-magic-numbers
  const mockArg2 = i + 10
  // tslint:disable-next-line: no-magic-numbers
  const mockTimer = (i + 1) * 1000
  const step = generateMockStep(mockArg1, mockArg2, mockTimer)
  steps.push(step)
}

export default steps
