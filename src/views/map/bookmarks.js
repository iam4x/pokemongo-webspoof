import React from 'react'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import cx from 'classnames'

import userLocation from '../../models/user-location.js'

import { Button, FormGroup, InputGroup, MenuItem } from 'react-bootstrap'
import { Combobox } from '../../components/Combobox.js'


const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || {})


@observer class Bookmarks extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.onChange = (e) => {
      this.updateAction(e.target.value)
    }

    this.save = action(() => {
      const name = this.refs.bookmarks.state.value
      const bookmark = {
        lat: userLocation[0],
        lng: userLocation[1]
      }

      bookmarks[name] = bookmark
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks))

      this.updateAction(name)
    })

    this.delete = action(() => {
      const name = this.refs.bookmarks.state.value

      delete bookmarks[name]
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks))

      this.updateAction(name)
    })

    this.select = (name) => action(() => {
      this.refs.bookmarks.setValue(name, false)
      this.updateAction(name)

      if (bookmarks.hasOwnProperty(name)) {
        const bookmark = bookmarks[name]
        userLocation[0] = bookmark.lat
        userLocation[1] = bookmark.lng
      }
    })

    this.updateAction = (name) => {
      if (bookmarks.hasOwnProperty(name) && this.state.btnAction !== 'Update') {
        this.setState({ btnAction: 'Update' })
      }

      if (!bookmarks.hasOwnProperty(name) && this.state.btnAction !== 'Save') {
        this.setState({ btnAction: 'Save' })
      }
    }

    this.state = { btnAction: 'Save' }
  }

  render() {
    const { btnAction } = this.state

    return (
      <div className='bookmarks'>
        <FormGroup>
          <InputGroup>
            <Combobox id='bookmarks' ref='bookmarks' onChange={ this.onChange }>
            { Object.keys(bookmarks).map((name) => (
              <MenuItem key={ name } value={ name } onSelect={ this.select(name) }>
                { name }
              </MenuItem>
            )) }
            </Combobox>

            <Button className='btn-success' onClick={ this.save }>{ btnAction }</Button>
            <Button
              className={ cx({ hide: btnAction !== 'Update', 'btn-danger': true }) }
              onClick={ this.delete }>
              <span className='octicon octicon-x'></span>
            </Button>
          </InputGroup>
        </FormGroup>
      </div>
    )
  }
}

export default Bookmarks
