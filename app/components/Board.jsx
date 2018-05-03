import React, { Component } from 'react'
import { Table, Segment, Item } from 'semantic-ui-react'
import { db } from '../firebase'

import Question from './Question'

const completeGame = JSON.parse(`{
  "name": "Stackpardy",
  "description": "Fullstack Academy's Jeopardy game",
  "isPublic": true,
  "multiplier": 200,
  "height": 5,
  "width": 6,
  "categories": {
    "0": {
      "name": "HTML",
      "questions": {
        "0": {
          "prompt": "A tag that was popular in the early internet but now considered by it's creator to be the worst thing he's ever done for the Internet, it alternates text from being visible to invisible.",
          "response": "What is the blink tag?"
        },
        "1": {
          "prompt": "Invented by this person in 1995, the web immediately captured the imaginations of developers worldwide.",
          "response": "Who is Tim Berners Lee?"
        },
        "2": {
          "prompt": "This property of HTML elements allows to have other elements next to them, otherwise it's only above or below.",
          "response": "What is display (block vs inline)"
        },
        "3": {
          "prompt": "A weird looking type of tag, it's long form is bang, dash, dash",
          "response": "What are HTML comments?"
        },
        "4": {
          "prompt": "The tag sounds like someone advanced in years, but it's real purpose is to create a list in your document.",
          "response": "What is the ol (ol') tag?"
        }
      }
    },
    "1": {
      "name": "CSS",
      "questions": {
        "0": {
          "prompt": "Defines the space between the element border and element content.",
          "response": "What is CSS padding?"
        },
        "1": {
          "prompt": "Defines the space around elements?",
          "response": "What is CSS margin?"
        },
        "2": {
          "prompt": "Released by Twitter, this is the most popular HTML/CSS/JS framework for developing responsive websites.",
          "response": "What is Bootstrap?"
        },
        "3": {
          "prompt": "The current version of CSS with many additional features for animation and grid layout.",
          "response": "What is 3?"
        },
        "4": {
          "prompt": "The way to have an HTML file include a CSS stylesheet, similar to the script tag.",
          "response": "What is \\"link\\""
        }
      }
    },
    "2": {
      "name": "JavaScript",
      "questions": {
        "0": {
          "prompt": "This command pops up a window in your browser with whatever message you pass to it.",
          "response": "What is \\"alert\\"?"
        },
        "1": {
          "prompt": "The most helpful word to help JavaScript-learners, this stops all execution of JavaScript and lets you inspect the current state.",
          "response": "What is \\"debugger\\""
        },
        "2": {
          "prompt": "The name of a function given to another function, so that the second function knows what to do when it's done with it's current work",
          "response": "What is a callback function, continuations, futures"
        },
        "3": {
          "prompt": "The five basic primitive types in JavaScript.",
          "response": "What are null, undefined, Number, String, Boolean?"
        },
        "4": {
          "prompt": "Considered a design flaw in the JS language, this problem manifests itself when you compare objects of two different types in JavaScript.",
          "response": "What is double equal versus triple equal? (Type conversion.)"
        }
      }
    },
    "3": {
      "name": "JavaScript History",
      "questions": {
        "0": {
          "prompt": "This man wrote JavaScript over 10 days at Netscape and was recently ousted as the CEO of Mozilla.",
          "response": "Who is Brandon Eich?"
        },
        "1": {
          "prompt": "The current and future versions of JavaScript.",
          "response": "What is ES5 and ES6?"
        },
        "2": {
          "prompt": "The underlying technology beneath both Node and the Chrome browser, considered the fastest JavaScript engine.",
          "response": "Chrome's V8 Engine"
        },
        "3": {
          "prompt": "This technology was considered by many to launch JavaScript from browser decoration to a real application language.",
          "response": "What is AJAX? (Gmail)"
        },
        "4": {
          "prompt": "JavaScript is based on this language, not to be confused with a skin disorder.",
          "response": "What is ECMAScript?"
        }
      }
    },
    "4": {
      "name": "Fullstack Academy",
      "questions": {
        "0": {
          "prompt": "The Instructor who runs Foundations and sends you your daily Foundations reminders.",
          "response": "Who is Scott D'alessandro"
        },
        "1": {
          "prompt": "The Fullstack Logo represents both upward ascenscion, and one other less metaphorical symbol.",
          "response": "What is an F?"
        },
        "2": {
          "prompt": "The startup accelerator that Fullstack Academy went through - it's name means a company to create new companies.",
          "response": "What is Y Combinator?"
        },
        "3": {
          "prompt": "The number of hackathons won by previous Fullstack Academy students.",
          "response": "What is 15."
        },
        "4": {
          "prompt": "The three major sections of the entire 21-week Fullstack Course.",
          "response": "What are Foundations, Academy, and Flight?"
        }
      }
    },
    "5": {
      "name": "Test First",
      "questions": {
        "0": {
          "prompt": "Two ways to set properties of an object in JavaScript.",
          "response": "What is dot and array notation?"
        },
        "1": {
          "prompt": "Both iterating over an entire collection with a function, one returns the original collection, one returns a new collection based on the results of the function.",
          "response": "What is the difference between map and forEach?"
        },
        "2": {
          "prompt": "That feeling in relationships when even after leaving, you can still remember all the things you defined together.",
          "response": "Closure"
        },
        "3": {
          "prompt": "When a function calls itself, it's often just trying to solve the same problem, but smaller.",
          "response": "What is recursion?"
        },
        "4": {
          "prompt": "When in Poland 7 28 + 5 / 1 +",
          "response": "What is 8?"
        }
      }
    }
  }
}`)

const incompleteGame = JSON.parse(`{
  "name": "Stackpardy",
  "description": "Fullstack Academy's Jeopardy game",
  "isPublic": true,
  "multiplier": 200,
  "height": 5,
  "width": 6,
  "categories": {
    "1": {
      "name": "CSS",
      "questions": {
        "2": {
          "prompt": "Released by Twitter, this is the most popular HTML/CSS/JS framework for developing responsive websites.",
          "response": "What is Bootstrap?"
        }
      }
    },
    "2": {
      "name": "JavaScript",
      "questions": {
        "3": {
          "prompt": "The five basic primitive types in JavaScript.",
          "response": "What are null, undefined, Number, String, Boolean?"
        }
      }
    },
    "4": {
      "name": "Fullstack Academy",
      "questions": {
        "0": {
          "prompt": "The Instructor who runs Foundations and sends you your daily Foundations reminders.",
          "response": "Who is Scott D'alessandro"
        },
        "1": {
          "prompt": "The Fullstack Logo represents both upward ascenscion, and one other less metaphorical symbol.",
          "response": "What is an F?"
        }
      }
    }
  }
}`)


const formatGame = game => {
  const formatted = {...game}
  delete formatted.categories
  formatted.rows = Array(game.height).fill(null).map(_ => Array(game.width).fill(null))
  formatted.headers = Array(game.width).fill(null)
  for (let i = 0; i < game.width; i++) {
    if (game.categories[i]) {
      formatted.headers[i] = game.categories[i].name
    }
    for (let j = 0; j < game.height; j++) {
      if (game.categories[i] && game.categories[i].questions[j]) {
        formatted.rows[j][i] = game.categories[i].questions[j]
      }
    }
  }
  return formatted
}

class Board extends Component {

  constructor(props) {
    super(props)
    this.state = {
      game: formatGame(completeGame),
      init: false,
      selectedRow: null,
      selectedCol: null,
      selectedIsLocked: false,
    }
    this.getCell = this.getCell.bind(this)
    this.selectQuestion = this.selectQuestion.bind(this)
    this.toggleLock = this.toggleLock.bind(this)
    this.clearQuestion = this.clearQuestion.bind(this)
  }

  componentDidMount() {
    // db.collection('questions').where('isPublic', '==', true)
    //   .onSnapshot(querySnapshot => {
    //       const docsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
    //       console.log(docsData)
    //       this.setState({ questions: docsData, init: false })
    //   })
    //this.setState({ game: formatGame(completeGame), init: false })
  }

  getCell(event) {
    return [+event.target.getAttribute('row'), +event.target.getAttribute('col')]
  }
  selectQuestion(event, force) {
    const [selectedRow, selectedCol] = this.getCell(event)
    if (!this.state.selectedIsLocked || force) this.setState({ selectedRow, selectedCol })
  }
  toggleLock(event) {
    const [currRow, currCol] = this.getCell(event)
    if (currRow === this.state.selectedRow && currCol === this.state.selectedCol && this.state.selectedIsLocked) {
      this.setState({ selectedIsLocked: false })
    } else {
      this.selectQuestion(event, true)
      this.setState({ selectedIsLocked: true })
    }
  }
  clearQuestion() {
    if (!this.state.selectedIsLocked) this.setState({ selectedRow: null, selectedCol: null })
  }

  render() {
    const game = this.state.game
    const row = this.state.selectedRow
    const col = this.state.selectedCol
    const selected = row !== null && col !== null ? this.state.game.rows[row][col] : null
    return (
      <div className="board">
      <Table fixed unstackable padded size="large" attached="top">
        <Table.Header>
          <Table.Row textAlign="center">
            {game.headers.map((header, headerIndex) => (
              <Table.HeaderCell key={`row-${headerIndex}`}>{header}</Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body onMouseLeave={this.clearQuestion}>
          {game.rows.map((row, rowIndex) => (
            <Table.Row key={`row-${rowIndex}`} textAlign="center">
              {row.map((cell, colIndex) => (
                <Table.Cell
                  key={`cell-${rowIndex}:${colIndex}`}
                  row={rowIndex}
                  col={colIndex}
                  className={
                    (rowIndex === this.state.selectedRow &&
                      colIndex === this.state.selectedCol &&
                      this.state.selectedIsLocked) ? 'selectable-cell locked-selectable-cell'
                      : !cell ? 'selectable-cell empty-cell'
                      : 'selectable-cell'}
                  onMouseEnter={this.selectQuestion}
                  onClick={this.toggleLock}>
                  {(rowIndex + 1) * game.multiplier}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Segment attached="bottom">
      {selected ? <Item.Group><Question question={selected} /></Item.Group> : 'Hover over the board to view questions. Click a question to lock the selection.'}
      </Segment>
      </div>
    )
  }
}

export default Board
