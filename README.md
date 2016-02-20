# simple-rqjs-gallery

This is a simple gallery module for requireJs.


## Usage

###Insert CSS:

		<link href="css/gallery-cb.css" rel="stylesheet">

###Insert dependency in requireJs module:

		define([
			'lib/gallery-cb',
			'lib/jquery'
		], function (
			gallery,
			jQuery
		) {

###Call it on the container for initialization:

		"your_container".galleryInit();

-Every image is now converted to the gallery

		<img id="sk8-img" src="img/some_image.png" alt="">

-You can even call it with the ref tag to define more than one image in the gallery

		<img src="img/some_image.png" rel="designs" alt="">
