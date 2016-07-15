import React from 'react'
import { render } from 'react-dom'

import App from './app.js'

// css
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/stackslide.css'
import './styles/index.css'

render(<App />, document.getElementById('app'))
