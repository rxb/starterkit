// Initializes the `uploads` service on path `/uploads`
const hooks = require('./uploads.hooks');

// multipart
const multer = require('multer');
const multipartMiddleware = multer();

// feathers-blob service
const blobService = require('feathers-blob');
const fs = require('fs-blob-store'); // could be any blob storage system
const blobStorage = fs('./public/photos');

module.exports = function (app) {

	// Upload Service with multipart support
	app.use('/uploads',

	    // multer parses the file named 'dataUri'.
	    // Without extra params the data is
	    // temporarely kept in memory
	    multipartMiddleware.single('dataUri'),

	    // another middleware, this time to
	    // transfer the received file to feathers
	    function(req,res,next){
	        req.feathers.file = req.file;
	        next();
	    },
	    blobService({Model: blobStorage})
	);

	// Get our initialized service so that we can register hooks
	const service = app.service('uploads');
	service.hooks(hooks);
};
