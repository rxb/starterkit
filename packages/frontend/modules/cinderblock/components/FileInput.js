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
	}


	render() {
            const {
                  onChange,
                  onChangeFile,
                  placeholder,
                  style,
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
                                          <Icon shape="ChevronDown" color={swatches.textHint} />
                                    </View>
                              </Fragment>
                        }
                        {this.state.filename &&
                              <Fragment>
                                    <Text color="primary">{this.state.filename}</Text>
                                    <View style={styles['input-icon']}>
                                          <Icon shape="ChevronDown" color={swatches.textHint} />
                                    </View>
                              </Fragment>
                        }


                        <input
                              type="file"
                              onFocus={()=>{
                                    this.setState({hasFocus: true})
                              }}
                              onBlur={()=>{
                                    this.setState({hasFocus: false})
                              }}
                              onChange={(e)=>{
                                    const file = e.target.files[0];
                                    if(file){
                                          this.setState({
                                                file: file,
                                                filepreview: URL.createObjectURL(file),
                                                filename: e.target.value.split(/(\\|\/)/g).pop(),
                                          })
                                          onChangeFile(file);
                                    }
                                    else{
                                          this.setState({
                                                file: undefined,
                                                filepreview: undefined,
                                                filename: undefined
                                          })
                                    }
                                    onChange(e);

                              }}
                              style={{
                                    position: 'absolute',
                                    opacity: 0,
                                    top: 0, left: 0,
                                    width: '100%',
                                    height: '100%'
                              }}
                              {...other}
                              />
                  </View>
            );
      }
}

export default FileInput;