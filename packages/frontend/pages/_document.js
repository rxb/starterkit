import { Children } from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { AppRegistry } from 'react-native'
import { flush } from 'react-native-media-query';
import { ThemeContext, styleConfig, designConstants, initMediaProvider } from 'cinderblock';
const { BREAKPOINT_SIZES } = designConstants;

class MyDocument extends Document {

	/*
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx)
		return { ...initialProps }
	}
	*/

	static async getInitialProps({ renderPage }) {
		AppRegistry.registerComponent('Main', () => Main)
		const { getStyleElement } = AppRegistry.getApplication('Main')
		const page = await renderPage()
		const styles = [
		  getStyleElement(),
		  flush()
		]
		return { ...page, styles: Children.toArray(styles) }
	 }

	render() {
		return (
			<ThemeContext.Consumer>
				{ ({ styles, SWATCHES, METRICS }) => (
					<Html>
						<Head>
							<style
								dangerouslySetInnerHTML={{
									__html: `
										/*
										WEB-ONLY CSS HACKS
										All the weird stuff that React Native will never care about
										*/

										html, body, #__next{
											width: 100%;
											height: 'auto';
											min-height: 100%;
											padding: 0;
											margin: 0;
											display: flex;
											flex-direction: column;
											flex: 1;
										}

										/* form nonstandard styles */
										/*
										.input{
											-webkit-appearance: none;
											-moz-appearance: none;
											appearance: none;
										}
										*/

										/* form focus */
										*:focus{
											outline-offset: 0;
										}
										input:focus, textarea:focus, select:focus, .focus{
											outline: none;
											border-width: 1px;
											border-color: ${SWATCHES.tint};
											background-color: ${SWATCHES.backgroundWhite};
											//box-shadow: 0 0 0 3px ${SWATCHES.focus};
											zIndex: 2;
										}

										/* many browsers have broken search inputs */
										input[type="search"]::-webkit-search-cancel-button {
											/* Remove default */
											-webkit-appearance: none;
										
											/* Now your own custom styles */
											height: 24px;
											width: 16px;
											display: block;
											background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAn0lEQVR42u3UMQrDMBBEUZ9WfQqDmm22EaTyjRMHAlM5K+Y7lb0wnUZPIKHlnutOa+25Z4D++MRBX98MD1V/trSppLKHqj9TTBWKcoUqffbUcbBBEhTjBOV4ja4l4OIAZThEOV6jHO8ARXD+gPPvKMABinGOrnu6gTNUawrcQKNCAQ7QeTxORzle3+sDfjJpPCqhJh7GixZq4rHcc9l5A9qZ+WeBhgEuAAAAAElFTkSuQmCC);
											/* setup all the background tweaks for our custom icon */
											background-repeat: no-repeat;
											background-position: center center;
											cursor: pointer;
										
											/* icon size */
											background-size: 16px;
										
										}

										/* weird autofill font sizes */
										input:-webkit-autofill::first-line{
											font-size: ${METRICS.bodySize}px;
											font-family: ${METRICS.fontFamily};
										}

										/* remove autofill styles (might be evil, but let's try it) 
										@-webkit-keyframes autofill {
												to {
														background: ${SWATCHES.notwhite};
												}
										}
										@-webkit-keyframes autofillfocus {
												to {
														background: transparent;
												}
										}
										input:-webkit-autofill {
												-webkit-animation-name: autofill;
												-webkit-animation-fill-mode: both;
										}
										input:-webkit-autofill:focus {
												-webkit-animation-name: autofillfocus;
										}
										*/

									`}}
							/>

							<link rel='stylesheet' type='text/css' href='/static/nprogress.css' />

						</Head>

						<body>
							<Main />
							<NextScript />
						</body>

					</Html>
				)}
			</ThemeContext.Consumer>
		)
	}
}

export default MyDocument