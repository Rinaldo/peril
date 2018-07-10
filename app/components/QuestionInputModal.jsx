import React, { Component } from 'react'
import { Modal, Button } from 'semantic-ui-react'

import NewQuestionFields from './NewQuestionFields'

/*
 * Very similar to BoardCellModal
*/
class QuestionInputModal extends Component {

  constructor(props) {
    super(props)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = this.props.initialState ? { modalOpen: false, ...this.props.initialState } : { modalOpen: false }
  }

  handleChange(_, { name, value, checked, type }) {
    if (value === undefined) value = checked
    else if (value && type === 'number') value = +value
    this.setState({ [name]: value })
  }

  handleSubmit(event) {
    if (event) event.preventDefault()
    const { modalOpen, ...state } = this.state   // eslint-disable-line no-unused-vars
    this.props.writeQuestion(state)
    this.setState(prevState =>
      Object.assign({},
        Object.keys(prevState).reduce((obj, key) => {
          obj[key] = null
          return obj
        }, {}),
        this.props.initialState,
        { modalOpen: false }
      )
    )
  }

  handleOpen() {
    this.setState({ modalOpen: true })
  }

  handleClose() {
    this.setState({ modalOpen: false })
  }

  render() {
    return (
      <Modal
        closeIcon
        trigger={<Button onClick={this.handleOpen}>Create New Question</Button>}
        open={this.state.modalOpen}
        onClose={this.handleClose}
      >
        <Modal.Header>Create Question</Modal.Header>
        <Modal.Content>
          <NewQuestionFields
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            formState={this.state}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button negative icon="close" labelPosition="right" content="Cancel" onClick={this.handleClose} />
          <Button positive icon="checkmark" labelPosition="right" content="Create Question" onClick={this.handleSubmit} />
        </Modal.Actions>
      </Modal>
    )
  }
}

export default QuestionInputModal


// import FormWrapper from './FormWrapper'

// const ModalWrapper = Modal => class ControlledModal extends Component {

//   constructor(props) {
//     super(props)
//     this.handleOpen = this.handleOpen.bind(this)
//     this.handleClose = this.handleClose.bind(this)
//     this.state = { modalOpen: false }
//   }

//   handleOpen() {
//     this.setState({ modalOpen: true })
//   }

//   handleClose() {
//     this.setState({ modalOpen: false })
//   }

//   render() {
//     return (
//       <Modal
//         handleOpen={this.handleOpen}
//         handleClose={this.handleClose}
//         modalState={this.state}
//         {...this.props}
//       />
//     )
//   }
// }


// const NewQuestionModal = props => {
//   return (
//   <Modal
//     closeIcon
//     trigger={<Button onClick={props.handleOpen}>Create New Question</Button>}
//     open={props.modalState.modalOpen}
//     onClose={props.handleClose}
//   >
//     <Modal.Header>Create Question</Modal.Header>
//     <Modal.Content>
//       <NewQuestionForm
//         handleChange={props.handleChange}
//         formState={props.formState}
//       />
//     </Modal.Content>
//     <Modal.Actions>
//       <Button negative icon="close" labelPosition="right" content="Cancel" onClick={props.handleClose} />
//       <Button positive icon="checkmark" labelPosition="right" content="Create Question" onClick={props.handleSubmit} />
//     </Modal.Actions>
//   </Modal>
// )}

// export default ModalWrapper(FormWrapper(NewQuestionModal))
