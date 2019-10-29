module.exports = {
	webpack: (config) => {
		const webpack = require('webpack')
		config.plugins = config.plugins || []

		// get fetch ready for that very first SSR render
	 	const providePlugin = new webpack.ProvidePlugin({
	        'fetch': 'isomorphic-unfetch',
	    });
		config.plugins.push(providePlugin);


		return config
	}
}