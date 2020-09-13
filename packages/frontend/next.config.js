const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
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

		return config
	},
});