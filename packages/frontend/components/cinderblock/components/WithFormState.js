/*

Fields.js
Ultra-lightweight (1k) form helper for React

*/

const withFormState = ( WrappedComponent ) => {

	return class extends React.Component {

		static defaultProps = {
	    	initialFields: {},
	    	onSubmit: (fields) => { console.log(`withFormState: implement onSubmit prop to do something with your form\n${JSON.stringify(fields)}`) }
	  	}

		constructor(props){
			super(props);
			this.state={
				fields: props.initialFields
			}
			this.getFieldValue = this.getFieldValue.bind(this);
			this.setFieldValue = this.setFieldValue.bind(this);
			this.handleSubmit = this.handleSubmit.bind(this);
			this.resetFields = this.resetFields.bind(this);
		}

		setFieldValue(key, value){
			const fields = {...this.state.fields};
			fields[key] = value;
			this.setState({fields: fields});
		}

		getFieldValue(key){
			return this.state.fields[key] || '';
		}

		resetFields(){
			this.setState({fields: {}});
		}

		handleSubmit(){
			this.props.onSubmit(this.state.fields, this);
		}

		render(){
			return (
				<WrappedComponent
					handleSubmit={this.handleSubmit}
					setFieldValue={this.setFieldValue}
					getFieldValue={this.getFieldValue}
					{...this.props}
					/>
			);
		}
	}
}

export default withFormState;