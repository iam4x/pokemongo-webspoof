import React from 'react'


// Dumb passthrough component to return children.
// Use this to stop react from complaining about undefined
// properties on vanilla DOM elements e.g. div
export class Passthrough extends React.Component {
  propTypes = {
    children: React.PropTypes.any
  }

  render() {
    return this.props.children
  }
}

export default Passthrough
