import React from 'react'

import { Dropdown, FormControl } from 'react-bootstrap'
import { Passthrough } from './Passthrough.js'


export class Combobox extends React.Component {
  propTypes = {
    id: React.PropTypes.string,
    children: React.PropTypes.any,
    onChange: React.PropTypes.func
  }

  constructor(props, context) {
    super(props, context)

    this.onChange = (e) => {
      this.setValue(e.target.value)

      if (this.props.onChange) {
        this.props.onChange(e)
      }
    }

    this.onToggle = () => {
      // Need this to stop react from complaining
      // TODO: find a way to get rid of this
    }

    this.setValue = (value, menuState) => {
      menuState = (menuState === undefined) ? value !== '' : menuState
      this.setState({ value, open: menuState })
    }

    this.toggleMenu = (openState) => {
      openState = (openState === undefined) ? !this.state.open : openState
      this.setState({ open: openState })
    }

    this.state = { value: '', open: false }
  }

  render() {
    const { id, children } = this.props
    const { value, open } = this.state

    return (
      <Dropdown className='combobox' id={ id } open={ open } onToggle={ this.onToggle }>
        <Passthrough bsRole='toggle'>
          <FormControl
            type='text'
            placeholder='Bookmarks'
            onChange={ this.onChange }
            value={ value } />
        </Passthrough>

        <Dropdown.Menu>
        { React.Children.toArray(children).filter(child => (
          !value.trim() ||
          (
            child.props.value &&
            child.props.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
          ) ||
          (
            child.props.children.toLowerCase &&
            child.props.children.toLowerCase().indexOf(value.toLowerCase()) !== -1
          )
        )) }
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

export default Combobox
