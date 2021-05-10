const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
})

const withTM = require('next-transpile-modules')(['cinderblock']);

module.exports = withBundleAnalyzer(withTM({
	future: {
		webpack5: true,
	},
	webpack: (config) => {

		const webpack = require('webpack')

	    // Transform all direct `react-native` imports to `react-native-web`
	 	config.resolve.alias = {
	      ...(config.resolve.alias || {}),
	      'react-native$': 'react-native-web'
	    }

		config.plugins = config.plugins || []
		config.plugins.push(new webpack.IgnorePlugin(/\/iconv-loader$/)); // something about rn-markdown needs this

		return config
	},
}));