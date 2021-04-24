import {
  arrayCompletePasses,
  loopRestarts,
  loopIndexForward,
} from './ArrayLooping'

describe('loopIndexForward', () => {
  const testArray = [1, 2, 3, 4, 5, 6]

  it(`Array [${testArray}] should return 2 if startIndex=0 and count=2`, () => {
    expect(loopIndexForward(testArray, 0, 2)).toBe(2)
  })

  it(`Array [${testArray}] should return 3 if startIndex=4 and count=5`, () => {
    expect(loopIndexForward(testArray, 4, 5)).toBe(3)
  })

  it(`Array [${testArray}] should return -1 if startIndex is not an integer`, () => {
    expect(loopIndexForward(testArray, 0.5, 5)).toBe(-1)
  })

  it(`Array [${testArray}] should return -1 if startIndex is negative`, () => {
    expect(loopIndexForward(testArray, -2, 5)).toBe(-1)
  })

  it(`Array [${testArray}] should return -1 if startIndex is greater than length - 1`, () => {
    expect(loopIndexForward(testArray, -2, 5)).toBe(-1)
  })

  it(`Array [${testArray}] should return -1 if count not an integer`, () => {
    expect(loopIndexForward(testArray, 0.5, 5)).toBe(-1)
  })

  it(`Array [${testArray}] should return -1 if count is negative`, () => {
    expect(loopIndexForward(testArray, -2, 5)).toBe(-1)
  })
})

// ------------------------------

describe('arrayCompletePasses', () => {
  const testArray = [1, 2, 3, 4]

  it(`Array [${testArray}] should return 1 with count=10 and startIndex=0`, () => {
    expect(arrayCompletePasses(testArray, 0, 10)).toBe(1)
  })

  it(`Array [${testArray}] should return 0 with count=3 and startIndex=3`, () => {
    expect(arrayCompletePasses(testArray, 3, 3)).toBe(0)
  })

  it(`Array [${testArray}] should return 0 with count=2 and startIndex=0`, () => {
    expect(arrayCompletePasses(testArray, 0, 2)).toBe(0)
  })

  it(`Array [${testArray}] should return -1 if startIndex is not an integer`, () => {
    expect(arrayCompletePasses(testArray, 0.5, 5)).toBe(-1)
  })

  it(`Array [${testArray}] should return -1 if startIndex is negative`, () => {
    expect(arrayCompletePasses(testArray, -2, 5)).toBe(-1)
  })

  it(`Array [${testArray}] should return -1 if startIndex is greater than length - 1`, () => {
    expect(arrayCompletePasses(testArray, -2, 5)).toBe(-1)
  })

  it(`Array [${testArray}] should return -1 if count not an integer`, () => {
    expect(arrayCompletePasses(testArray, 0.5, 5)).toBe(-1)
  })

  it(`Array [${testArray}] should return -1 if count is negative`, () => {
    expect(arrayCompletePasses(testArray, -2, 5)).toBe(-1)
  })
})

// ------------------------------

describe('loopRestarts', () => {
  const testArray = [1, 2, 3, 4]

  it(`Array [${testArray}] should return 2 with count=10 and startIndex=0`, () => {
    expect(loopRestarts(testArray, 0, 10)).toBe(2)
  })

  it(`Array [${testArray}] should return 1 with count=3 and startIndex=3`, () => {
    expect(loopRestarts(testArray, 3, 3)).toBe(1)
  })

  it(`Array [${testArray}] should return 0 with count=2 and startIndex=0`, () => {
    expect(loopRestarts(testArray, 0, 2)).toBe(0)
  })

  it(`Array [${testArray}] should return -1 if startIndex is not an integer`, () => {
    expect(loopRestarts(testArray, 0.5, 5)).toBe(-1)
  })

  it(`Array [${testArray}] should return -1 if startIndex is negative`, () => {
    expect(loopRestarts(testArray, -2, 5)).toBe(-1)
  })

  it(`Array [${testArray}] should return -1 if startIndex is greater than length - 1`, () => {
    expect(loopRestarts(testArray, -2, 5)).toBe(-1)
  })

  it(`Array [${testArray}] should return -1 if count not an integer`, () => {
    expect(loopRestarts(testArray, 0.5, 5)).toBe(-1)
  })

  it(`Array [${testArray}] should return -1 if count is negative`, () => {
    expect(loopRestarts(testArray, -2, 5)).toBe(-1)
  })
})
