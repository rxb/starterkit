import React from 'react';

/*

Fields.js
Ultra-lightweight (1k) form helper for React

*/

function debounce(callback, time = 60) {
	var timeout;
	return function() {
		var context = this;
		var args = arguments;
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(function() {
			timeout = null;
			callback.apply(context, args);
		}, time);
	}
}

const withFormState = ( WrappedComponent ) => {

	return class extends React.Component {

		static defaultProps = {
	    	initialFields: {},
	    	onSubmit: (fields) => { console.log(`withFormState: implement onSubmit prop to do something with your form\n${JSON.stringify(fields)}`) },
	    	onChange: () => {}
	  	}

		constructor(props){
			super(props);
			this.state={
				// why set initialFields and not just pass though props to values all the time?
				// an input can be populated with initial values, but shouldn't change after being presented to the user
				// the user should be the only active editor of the fields once they are presented
				// they shouldn't have to fight a "computer user" trying to edit the fields at the same time they are
				fields: props.initialFields
			}
			this.getFieldValue = this.getFieldValue.bind(this);
			this.setFieldValue = this.setFieldValue.bind(this);
			this.setFieldState = this.setFieldState.bind(this);
			this.handleSubmit = this.handleSubmit.bind(this);
			this.handleChange = this.handleChange.bind(this);
			this.resetFields = this.resetFields.bind(this);
		}

		componentDidMount(){
			this.handleChange();
		}

		setFieldState(payload){
			const fields = { ...this.state.fields, ...payload};
			this.setState({fields: fields}/*, this.handleChange*/);
			//debounce(this.handleChange, 10)();
		}

		setFieldValue(key, value){
			// in case i forget
			// it's because setstate isn't synchronous
			// and the 3 calls are all using original state value
			// set field

			const fields = { ...this.state.fields};
			fields[key] = value;
			this.setState({fields: fields}/*, this.handleChange*/);
			//debounce(this.handleChange, 10)();
		}

		getFieldValue(key){
			return this.state.fields[key] || '';
		}

		resetFields(){
			this.setState({fields: this.props.initialFields});
		}

		handleChange(){
			// if elements outside the form need to know what's happening in the form
			// as fields are being edited, before submit
			// passed in because setState won't be set yet
			//this.props.onChange(this.state.fields, this);
		}

		handleSubmit(){
			this.props.onSubmit(this.state.fields, this);
		}

		render(){
			return (
				<WrappedComponent
					{...this.props}
					handleSubmit={this.handleSubmit}
					resetFields={this.resetFields}
					setFieldValue={this.setFieldValue}
					setFieldState={this.setFieldState}
					getFieldValue={this.getFieldValue}
					fields={this.state.fields}
					/>
			);
		}
	}
}

export default withFormState;