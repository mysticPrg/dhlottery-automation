const sortRandomly = () => (Math.random() > 0.5 ? 1 : -1)

const sortAsc = (a: number, b: number) => (a < b ? -1 : 1)

const shuffle = (numbers: number[]) => {
  return numbers.slice().sort(sortRandomly)
}

const shuffleNth = (numbers: number[], minCount: number, maxCount: number) => {
  const shuffleCount =
    minCount + Math.round(Math.random() * (maxCount - minCount))
  let result = numbers
  for (let i = 0; i < shuffleCount; i++) {
    result = shuffle(numbers)
  }

  return result
}

const createNumberArray = (max: number) =>
  Array.from({ length: max }).map((_, index) => index + 1)

const MAX_NUMBER = 45
const SELECT_COUNT = 6
export const getSelectedNumbers = () => {
  let numbers = createNumberArray(MAX_NUMBER)
  const result: number[] = []

  for (let i = 0; i < SELECT_COUNT; i++) {
    numbers = shuffleNth(numbers, 2, 10)
    result.push(numbers.shift()!)
  }

  return result.sort(sortAsc)
}
