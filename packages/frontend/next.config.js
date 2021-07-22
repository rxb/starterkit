const path = require('path');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
})

const withTM = require('next-transpile-modules')(['cinderblock', 'react-native-media-query', 'react-native-web']);

module.exports = withBundleAnalyzer(withTM({
	webpack5: true,
	webpack: (config, options) => {

		const webpack = require('webpack')

		// Transform all direct `react-native` imports to `react-native-web`
		config.resolve.alias = {
			...(config.resolve.alias || {}),
			'react-native$': 'react-native-web'
		}

		// for peer dependencies in transpiling 
		// TODO: this doesn't seem sustainable
		const peerDependencies = ['react', 'react-dom', 'prop-types', 'react-native-web', 'uuid', 'react-feather', 'body-scroll-lock', 'react-dnd', 'validator', 'dayjs', 'react-native-media-query', 'css-mediaquery'];
		peerDependencies.forEach( item => {
			config.resolve.alias[item] = path.resolve(__dirname, '.', 'node_modules', item);
		});
		
		config.plugins = config.plugins || []
		config.plugins.push(new webpack.IgnorePlugin(/\/iconv-loader$/)); // something about rn-markdown needs this

		config.resolve.extensions = [
			'.web.js',
			'.js',
			...config.resolve.extensions,
		]

		return config
	},
}));