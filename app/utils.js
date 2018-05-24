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
        formatted.rows[j][i].points = (j + 1) * formatted.multiplier
      }
    }
  }
  return formatted
}

export const stripData = game => {
  const stripped = { ...game }
  stripped.categories = {}
  Object.entries(game.categories).forEach(([categoryKey, category]) => {
    stripped.categories[categoryKey] = { name: category.name || `Category ${+categoryKey + 1}`, questions: {} }
    Object.keys(category.questions).forEach(questionKey => {
      // initializing to false instead of null because you can't store null values in firebase
      stripped.categories[categoryKey].questions[questionKey] = { answerer: false }
    })
  })
  return stripped
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

export const loginFields = [
  {
    name: 'email',
    label: 'Email',
    type: 'text',
    placeholder: 'email@example.com',
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
  }
]

export const signupFields = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'John Doe',
  },
  {
    name: 'email',
    label: 'Email',
    type: 'text',
    placeholder: 'email@example.com',
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
  }
]
