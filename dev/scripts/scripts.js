// document.addEventListener('DOMContentLoaded', function() {
jQuery(document).ready(function($) {


	// Global Variables: Variables requiring a global scope
	// ----------------------------------------------------------------------------
	var elHTML          = document.documentElement,
		elBody          = document.body,
		animationEvent  = whichAnimationEvent(),
		transitionEvent = whichTransitionEvent();


	// Helper: Check when a CSS transition or animation has ended
	// ----------------------------------------------------------------------------
	function whichTransitionEvent() {

		var trans,
			element     = document.createElement('fakeelement'),
			transitions = {
				'transition'       : 'transitionend',
				'OTransition'      : 'oTransitionEnd',
				'MozTransition'    : 'transitionend',
				'WebkitTransition' : 'webkitTransitionEnd'
			}

		for (trans in transitions) {
			if (element.style[trans] !== undefined) {
				return transitions[trans];
			}
		}

	}

	function whichAnimationEvent() {

		var anim,
			element    = document.createElement('fakeelement'),
			animations = {
				'animation'       : 'animationend',
				'OAnimation'      : 'oAnimationEnd',
				'MozAnimation'    : 'animationend',
				'WebkitAnimation' : 'webkitAnimationEnd'
			}

		for (anim in animations) {
			if (element.style[anim] !== undefined) {
				return animations[anim];
			}
		}

	}


	// waitForImages: Wait until images are loaded
	// ----------------------------------------------------------------------------
	function waitForImages() {

		// the rest of the code does not apply to IE9, so exit
		if ( classie.has(elHTML, 'ie9') ) {
			return;
		}

		var 	elLoader       = document.getElementById('loader_overlay'),
			elPreloadImage = document.getElementById('bg-image');

		// listen for the end of <header> fadeIn animation
		elLoader.addEventListener(transitionEvent, removeLoader);

		function removeLoader() {

			// remove the event listener from the loader
			elLoader.removeEventListener(transitionEvent, removeLoader);

			// remove any unneeded elements
			elBody.removeChild(elLoader);
			elBody.removeChild(elPreloadImage);

			// page is now fully ready to go
			// elHTML.setAttribute('data-page', 'ready');
			elHTML.setAttribute('data-overlay', 'hidden');

		}

		// layout Packery after all images have loaded
		imagesLoaded(elBody, function(instance) {
			elHTML.setAttribute('data-images', 'loaded');
		});

	}


	// Mailchimp Form Functions
	// ----------------------------------------------------------------------------
	function formMailchimp() {

		var emailFilter     = /^\w+[\+\.\w-]*@([\w-]+\.)*\w+[\w-]*\.([a-z]{2,4}|\d+)$/i,
			$elForm         = $('#mc-embedded-subscribe-form'),
			$elInputEmail   = $('#mce-EMAIL'),
			$elResponse     = $('#mce-response-text'),
			$elOverlay      = $('#overlay'),
			$elCloseButton  = $('#close'),
			isValid         = true;

		function validateEmail() {

			// email input validation
			if ( emailFilter.test( $elInputEmail.val() ) == false ) {
				$elInputEmail.addClass('error');
				isValid = false;
			} else {
				isValid = true;
			}

		}

		$elForm.submit(function(e) {

			console.log('submit');

			if ($elInputEmail.val().length > 0) {

				// we may have added an error class... so let's go ahead and remove it
				$elInputEmail.removeClass('error');

				validateEmail();

				if (isValid) {

					$.ajax({

						type: 'GET',
						url:  $(this).attr('action'),
						data: $(this).serialize(),
						dataType: 'json',
						contentType: 'application/json; charset=utf-8',
						error: function(jqXHR, textStatus, errorThrown) {

							$elResponse.html(data.msg);
							elHTML.setAttribute('data-overlay', 'visible');

						},

						success: function(data) {

							$elResponse.html(data.msg);
							elHTML.setAttribute('data-overlay', 'visible');
							// $(this)[0].reset();

						}

					});

				}

			} else {

				$elInputEmail.addClass('error');

			}

			return false;

		});

		// hide signup modal on click outside of signup article
		$elCloseButton.on('click', function(e) {

			elHTML.setAttribute('data-overlay', 'hidden');

			e.preventDefault();

		});

	}


	// Initialize Primary Functions
	// ----------------------------------------------------------------------------
	waitForImages();
	formMailchimp();


});