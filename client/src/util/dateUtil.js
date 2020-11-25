export const getMonth = (monthnumber: number) => {
  const month = monthArray[monthnumber]
  return month ? month : { name: 'none', num: -1 }
}
export const getMonthName = (monthnumber: number) => {
  return getMonth(monthnumber).name
}

export const monthArray = [
  { name: 'jan', num: 0 },
  { name: 'fer', num: 1 },
  { name: 'mar', num: 2 },
  { name: 'abr', num: 3 },
  { name: 'mai', num: 4 },
  { name: 'jun', num: 5 },
  { name: 'jul', num: 6 },
  { name: 'ago', num: 7 },
  { name: 'set', num: 8 },
  { name: 'out', num: 9 },
  { name: 'nov', num: 10 },
  { name: 'dez', num: 11 }
]

export default {}
