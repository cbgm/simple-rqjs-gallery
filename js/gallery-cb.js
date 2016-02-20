define([
	'util/Configuration',
 	'lib/jquery'
 
], function (
	Configuration,
	jQuery
) {
	'use strict';
	var settings = null;

	jQuery.fn.galleryInit = function(options) {
		var _body = jQuery('body'),
			_affectedElement,
			_galleryOverlay,
			_originalPath = Configuration.get('API_URL') + "/images/",
			_closeButton,
			_nextButton,
			_preButton,
			_imageHolder,
			_galleryModal,
			_galleryImage,
			_imageLoader,
			_spinner,
			_images,
			_affectedGallery,
			_currentIndex = 0,
			_gallerySize = 0,
			_pictureInfo,
			_waterMark = (window.location.href).indexOf("creative--space.de") === -1 ? true: false; 
		
		var defaults = {
			originalPath : null
		}

		settings = jQuery.extend({}, defaults, options );

		jQuery(".gallery-overlay").remove();
		var result = "<div class='gallery-overlay'>" +
						"<div class='gallery-modal'>" +
							"<div class='gallery-image'>" +
								"<span class='helper'></span>" +
								"<img src= ''>" +
							"</div>" +
							"<div class='image-loader'>" +
								"<div id='spinner-holder'>" +
									"<div class='spinner-container'>" +
										"<div class='loading-spinner'></div>" +
									"</div>" +
								"</div>" +
							"</div>" +
							"<div class='gallery-button-close'></div>" +
							"<div class='gallery-button-left'></div>" +
							"<div class='gallery-button-right'></div>" +
							"<div class='gallery-info'>" +
								"<div class='picture-info'>16/12</div>";
		if (_waterMark) {
			result += 			"<div class='watermark-info'>powered by <a href='http://creative--space.de'>creative--space.de</a></div>";
		}
		result +=			"</div>" +
						"</div>" +
					"</div>";
		_body.append(result);

		_affectedElement = jQuery(this);
		_galleryOverlay =  _body.find(".gallery-overlay");
		_closeButton =  _body.find(".gallery-button-close");
		_nextButton =  _body.find(".gallery-button-right");
		_preButton =  _body.find(".gallery-button-left");
		_imageHolder =  _body.find(".gallery-image");
		_imageLoader =  _body.find(".image-loader");
		_spinner = _body.find(".spinner-container");
		_galleryModal =  _body.find(".gallery-modal");
		_galleryImage =  _body.find(".gallery-image img");
		_pictureInfo =  _body.find(".picture-info");

		_body.find(".watermark").show();

//		}

		_images = _affectedElement.find("img");

		_closeButton.bind("click", function () {
			_galleryOverlay.fadeToggle( "slow");
		});

		jQuery(window).on('resize', function(){
			doSizing();
		});

		_nextButton.bind("click", function () {

				if (_currentIndex < _gallerySize-1) {
					_currentIndex ++;
					doImageFade(_affectedGallery[_currentIndex].src);
					_pictureInfo.html((_currentIndex+1) + " / " + _gallerySize);
					return;
				} else {
					_currentIndex = 0;
					doImageFade(_affectedGallery[_currentIndex].src);
					_pictureInfo.html((_currentIndex+1) + " / " + _gallerySize);
					return;
				}
			
		});

		_preButton.bind("click", function () {

				if (_currentIndex > 0) {
					_currentIndex --;
					doImageFade(_affectedGallery[_currentIndex].src);

					_pictureInfo.html((_currentIndex+1) + " / " + _gallerySize);
					return;
				} else {
					_currentIndex = _gallerySize-1;
					doImageFade(_affectedGallery[_currentIndex].src);
					_pictureInfo.html((_currentIndex+1) + " / " + _gallerySize);
					return;
				}
		});

		_images.unbind("click");
		_images.bind("click", function () {
			doSizing();
			_galleryImage.attr("src", correctSrc(this.src));
			loadImages(this);
			findCurrentIndex(this);
			_pictureInfo.html((_currentIndex+1) + " / " + _gallerySize);
			_galleryOverlay.fadeToggle( "slow");
		});
		
		function loadImages (clickedImage) {
			var rel = jQuery(clickedImage).attr('rel');
			if (typeof rel !== "undefined") {
				_affectedGallery = _affectedElement.find("img[rel='" + rel + "']");
				_gallerySize = _affectedGallery.length;
				_preButton.show();
				_nextButton.show();
			} else {
				_affectedGallery = clickedImage;
				_gallerySize = 1;
				_preButton.hide();
				_nextButton.hide();
			}

		}

		function findCurrentIndex(clickedImage) {

			for (var i = 0; i < _affectedGallery.length; i++ ) {

				if (_affectedGallery[i].src === clickedImage.src) {
					_currentIndex = i;
					return;
				}
			}
			_currentIndex = 0;
		}

		function doSizing() {
			var browserwidth = jQuery(window).width();
			var browserheight = jQuery(window).height();
			var modalWidth = browserwidth * 0.8;
			var modalHeight = browserheight * 0.8;

			//modal
			_galleryModal.css('height', modalHeight)
			.css('width', modalWidth);

			if (modalWidth > 370) {
				//image holder
				var _imageHolderHeight = modalHeight * 0.8;
				var _imageHolderWidth = modalWidth * 0.8; 
				var imageLeft = (modalWidth -_imageHolderWidth) / 2;
				var imageTop = (modalHeight - _imageHolderHeight) / 2;
				_imageHolder.css('height', _imageHolderHeight)
					.css('width', _imageHolderWidth)
					.css('margin-left', imageLeft)
					.css('margin-top', imageTop);
				_imageLoader.css('height', _imageHolderHeight)
					.css('width', _imageHolderWidth)
					.css('margin-left', imageLeft)
					.css('margin-top', imageTop);
				//image
				_galleryImage.css('max-height', _imageHolderHeight);
				_galleryImage.css('max-width', _imageHolderWidth);
				_preButton.css('margin-left', imageLeft-10-30);
				_nextButton.css('margin-right', imageLeft-10-27-30);
				_preButton.css('position', 'relative');
				_nextButton.css('position', 'relative');
			} else {
				//image holder
				var _imageHolderHeight = modalHeight * 0.8;
				var _imageHolderWidth = modalWidth * 0.8; 
				var imageLeft = (modalWidth -_imageHolderWidth) / 2;
				var imageTop = (modalHeight - _imageHolderHeight) / 2;
				_imageHolder.css('height', _imageHolderHeight)
					.css('width', _imageHolderWidth)
					.css('margin-left', imageLeft)
					.css('margin-top', imageTop);
				_imageLoader.css('height', _imageHolderHeight)
					.css('width', _imageHolderWidth)
					.css('margin-left', imageLeft)
					.css('margin-top', imageTop);
				//image
				_galleryImage.css('max-height', _imageHolderHeight);
				_galleryImage.css('max-width', _imageHolderWidth);
				_preButton.css('left', 0);
				_nextButton.css('right', 0);
				_preButton.css('position', 'absolute');
				_nextButton.css('position', 'absolute');
			}
		}

		function doImageFade(src) {
			
			_galleryImage.fadeOut(function() {
				_spinner.show();
				jQuery(this).load(function() {
					_spinner.hide();
					jQuery(this).fadeIn(function () {
					});
				});
			_galleryImage.attr("src", correctSrc(src));
			});
		}

		function correctSrc(thumbSrc) {

			if (_originalPath !== null) {

				if (thumbSrc.indexOf(_originalPath) !== -1) {
					var splitThumb = thumbSrc.split("/");
					var originalSrc = _originalPath + splitThumb[splitThumb.length-1];
					return originalSrc;
				} else {
					return thumbSrc;
				}
			} else {
				return thumbSrc;
			}
		}
	}
	return this;
});