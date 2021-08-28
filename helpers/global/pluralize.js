module.exports = (number, words, concat) => {
  const result =
    words[
      number % 100 > 4 && number % 100 < 20
        ? 2
        : [2, 0, 1, 1, 1, 2][Math.min(number % 10, 5)]
    ]

  return concat ? number + ' ' + result : result
}
