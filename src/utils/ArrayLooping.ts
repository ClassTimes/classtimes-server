export const loopIndexForward = (
  arr: Array<number>,
  startIndex: number,
  count: number,
): number => {
  /* startIndex is expected to be:
   *  - An integer
   *  - Greater or equal than 0
   *  - Lower than array length
   */
  if (
    !Number.isInteger(startIndex) ||
    startIndex < 0 ||
    startIndex >= arr.length
  ) {
    return -1
  }

  /* count is expected to be:
   *  - An integer
   *  - Greater or equal than 0
   */

  if (!Number.isInteger(count) || count < 0) {
    return -1
  }

  const endIndex: number = arr.length - 1
  if (count <= endIndex - startIndex) {
    return startIndex + count
  } else {
    /* adjust count to array start */
    const countFromStart = count - (endIndex - startIndex + 1)
    return countFromStart % arr.length
  }
}

// An alternative (tested):

// export const loopIndexForward = (
//   arr: Array<any>,
//   startIndex: number,
//   count: number,
// ): number => {
//   /* Count is expected to be greater than 0 */
//   const endIndex: number = arr.length - 1
//   let loopingIndex: number = startIndex
//   while (count > 0) {
//     if (loopingIndex === endIndex) {
//       loopingIndex = 0
//     } else {
//       loopingIndex++
//     }
//     count--
//   }
//   return loopingIndex
// }

export const arrayCompletePasses = (
  arr: Array<any>,
  startIndex: number,
  count: number,
): number => {
  /*
   * This method counts how many times an array is traversed from start to finish
   * when counting from a [startIndex], a [count] number of times, with a "looping" count
   *
   *
   * For example:
   * [1, 2, 3] [1, 2, 3] [1, 2, 3] [1, 2, 3] [1, 2, 3]
   *     ^  ^   ^  ^  ^   ^  ^  ^   ^  ^  ^   ^  ^
   *     0  1   2  3  4   5  6  7   8  9  10  11 12
   *
   * In this case, count = 12 and startIndex = 1
   * Then the count finished on endIndex = 1, having fully looped through the array 3 times
   *
   * In other words, it counts the number of arrays "in the middle"
   */
  const endIndex = loopIndexForward(arr, startIndex, count)
  if (endIndex === -1) {
    // Invalid arguments
    return -1
  }
  if (count === endIndex - startIndex) {
    // Avoid OBOB-type error
    return 0
  }
  return (count - (arr.length - startIndex - 1) - (endIndex + 1)) / arr.length
}

export const loopRestarts = (
  arr: Array<any>,
  startIndex: number,
  count: number,
): number => {
  /*
   * This method counts how many times an array is restarted on the "looping" count,
   * when counting from a [startIndex], a [count] number of times
   *
   *
   * For example:
   * [1, 2, 3] [1, 2, 3] [1, 2, 3] [1, 2, 3] [1, 2, 3]
   *     ^  ^   ^  ^  ^   ^  ^  ^   ^  ^  ^   ^  ^
   *     0  1   2  3  4   5  6  7   8  9  10  11 12
   *
   * In this case, count = 12 and startIndex = 1
   * Then the restarts are exactly 4
   */
  const endIndex = loopIndexForward(arr, startIndex, count)
  if (endIndex === -1) {
    // Invalid arguments
    return -1
  }
  if (count === endIndex - startIndex) {
    // Avoid OBOB-type error
    return 0
  }
  return (
    (count - (arr.length - startIndex - 1) - (endIndex + 1)) / arr.length + 1
  )
}
