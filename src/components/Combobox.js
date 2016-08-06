import React from 'react';

import { Dropdown } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';


// Dumb passthrough component to return children. Need this to stop react from complaining
// TODO: find a way to get rid of this
class ComboboxToggle extends React.Component {
	render() {
		return this.props.children;
	}
}


export class Combobox extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.onChange = (e) => {
			this.setValue(e.target.value);

			if (this.props.onChange) {
				this.props.onChange(e);
			}
		};

		this.onToggle = (e) => {
			// Need this to stop react from complaining
			// TODO: find a way to get rid of this
		};

		this.setValue = (value, menuState) => {
			menuState = (menuState === undefined) ? value !== '' : menuState;
			this.setState({ value: value, open: menuState });
		};

		this.toggleMenu = (openState) => {
			openState = (openState === undefined) ? !this.state.open : openState;
			this.setState({ open: openState });
		};

		this.state = { value: '', open: false };
	}

	render() {
		const { id, children } = this.props;
		const { value, open } = this.state;

		return (
			<Dropdown className="combobox" id={ id } open={ open } onToggle={ this.onToggle }>
				<ComboboxToggle bsRole="toggle">
					<FormControl type="text" placeholder="Bookmarks" onChange={ this.onChange } value={ value } />
				</ComboboxToggle>

				<Dropdown.Menu>
				{React.Children.toArray(children).filter(child => (
					!value.trim() ||
					(child.props.value && child.props.value.toLowerCase().indexOf(value.toLowerCase()) !== -1) ||
					(child.props.children.toLowerCase && child.props.children.toLowerCase().indexOf(value.toLowerCase()) !== -1)
				))}
				</Dropdown.Menu>
			</Dropdown>
		);
	}
}

export default Combobox;