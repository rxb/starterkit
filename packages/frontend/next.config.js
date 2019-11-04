// if node modules are written with advanced JS, you have to transpile (babelize) them
const withTM = require('next-transpile-modules');

module.exports = withTM({
	webpack: (config) => {

		const webpack = require('webpack')

	    // Transform all direct `react-native` imports to `react-native-web`
	 	config.resolve.alias = {
	      ...(config.resolve.alias || {}),
	      'react-native$': 'react-native-web'
	    }

		config.plugins = config.plugins || []
		config.plugins.push(new webpack.ProvidePlugin({'fetch': 'isomorphic-unfetch'})); // fetch for first SSR render
		config.plugins.push(new webpack.IgnorePlugin(/\/iconv-loader$/)); // something about rn-markdown needs this

		/*
		// transpile needs this?
		config.externals = {
	        react: {
	          root: 'React',
	          commonjs2: 'react',
	          commonjs: 'react',
	          amd: 'react'
	        }
	    };
	    */


		return config
	},

	//transpileModules: ['rn-markdown']
});