export const ItemTypes = {
  QUESTION_FROM_LIST: 'questionFromList',
  QUESTION_FROM_BOARD: 'questionFromBoard'
}

export const formatGame = game => {
  const formatted = {...game}
  delete formatted.categories
  formatted.rows = Array(game.height).fill(null).map(_ => Array(game.width).fill(null))
  formatted.headers = Array(game.width).fill(null)
  for (let i = 0; i < game.width; i++) {
    if (game.categories && game.categories[i]) {
      formatted.headers[i] = game.categories[i].name
    }
    for (let j = 0; j < game.height; j++) {
      if (game.categories && game.categories[i] && game.categories[i].questions[j]) {
        formatted.rows[j][i] = game.categories[i].questions[j]
      }
    }
  }
  return formatted
}

export const equivalent = (left, right) => {
  if (left === right) return true
  if (!left || !right) return false
  if (left.length !== right.length) return false

  for (let i = 0; i < left.length; i++) {
    if (left[i] !== right[i]) return false
  }
  return true
}
