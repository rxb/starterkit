import React, {Fragment} from 'react';
import { View, Image } from 'react-native-web';
import Icon from './Icon';
import Text from './Text';
import styles from '../styles/styles';
import swatches from '../styles/swatches';


class FileInput extends React.Component {
	static defaultProps = {
		placeholder: 'Pick a file',
            onChange: ()=>{},
            onChangeFile: ()=>{},
	}

	constructor(props){
		super(props);
            this.state ={}
            this.handleChange = this.handleChange.bind(this);
	}

      componentDidUpdate(prevProps){
            if(prevProps.inputKey != this.props.inputKey){
                  this.setState({
                        file: undefined,
                        preview: undefined,
                        filename: undefined
                  });
            }
      }

      handleChange(e){
            const file = e.target.files[0];
            const reader = new FileReader()
            if(file){
                  const self = this;
                  reader.addEventListener("load", function () {
                        const fileState = {
                              file: file,
                              preview: reader.result,
                              filename: e.target.value.split(/(\\|\/)/g).pop(),
                        };
                        self.setState(fileState)
                        self.props.onChangeFile(fileState);
                  }, false);
                  reader.readAsDataURL(file);
            }
            else{
                  this.setState({
                        file: undefined,
                        preview: undefined,
                        filename: undefined
                  })
            }
            this.props.onChange(e);
      }

	render() {
            const {
                  placeholder,
                  shape = "ChevronDown",
                  style,
                  inputKey,
                  ...other
            } = this.props;

            return (
            	<View style={[
                              styles.input,
                              (this.state.hasFocus) ? styles['input--focus'] : {},
                              style,
                        ]}
                        >
                        {!this.state.filename &&
                              <Fragment>
                                    <Text color="hint">{placeholder}</Text>
                                    <View style={styles['input-icon']}>
                                          <Icon shape={shape} color={swatches.textHint} />
                                    </View>
                              </Fragment>
                        }
                        {this.state.filename &&
                              <Fragment>
                                    <Text color="primary">{this.state.filename}</Text>
                                    <View style={styles['input-icon']}>
                                          <Icon shape={shape} color={swatches.textHint} />
                                    </View>
                              </Fragment>
                        }


                        <input
                              key={inputKey}
                              type="file"
                              onFocus={()=>{
                                    this.setState({hasFocus: true})
                              }}
                              onBlur={()=>{
                                    this.setState({hasFocus: false})
                              }}
                              onChange={this.handleChange}
                              style={{
                                    position: 'absolute',
                                    opacity: 0,
                                    top: 0, left: 0,
                                    width: '100%',
                                    height: '100%'
                              }}
                              />
                  </View>
            );
      }
}

export default FileInput;