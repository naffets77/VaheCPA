﻿
$.CPAEB.pages.home = {

	slider: {
		currentIndex: 2,
		maxIndex: 3,
		lastAction: null,
		animating : false
	}
}

$.CPAEB.pages.home.events = function () {

	var self = $.CPAEB.pages.home;

	$("#home-login-username").on('click', function () {

	    if ($(this).val() == 'Email') {
	        $(this).val("");
	    }

	});

	$("#home-login-username").on('blur', function () {

	    if ($(this).val() == "") {
	        $(this).val("Email");
	    }

	});


	$("#home-login-password").on('click focus', function () {

	    if ($(this).val() == 'Password') {
	        $(this).val("");
	        $(this).attr("type","password");
	    }

	})

	$("#home-login-password").on('blur', function () {

	    if ($(this).val() == "") {
	        $(this).attr("type", "text");
	        $(this).val("Password");
	    }

	});


	$("#contact-us-submit-form").on('click', function () {

	    var email = $("#contact-us-email").val();

	    if (email.length != 0) {
	        var data = {
	            contactEmail: email,
	            reason: $("#contact-us-reason").val(),
	            message: $("#contact-us-message").val()
	        };

	        var ph = new $.COR.Utilities.PostHandler({
	            service: "general", call: "submitContactUsRequest",
	            params: data,
	            success: function (data) {

	                $("#contact-us-message").val("");
	                alert("Email Received");
	            }
	        });

	        ph.submitPost();
	    }
	    else {
	        alert("Email Required");
	    }

	});

    // Slider  Events
	$("#slides .prev").on('click', function () {

		if (self.slider.animating == true) { return }

		self.slider.lastAction = new Date();

		self.slider.currentIndex = self.slider.currentIndex == 1 ? self.slider.maxIndex : self.slider.currentIndex - 1;
		self.slider.updatePagination();
		self.slider.updateSlides('right');

	});

	$("#slides .next").on('click', function () {

		if (self.slider.animating == true) { return }

		self.slider.lastAction = new Date();

		self.slider.currentIndex = self.slider.currentIndex + 1 > self.slider.maxIndex ? 1 : self.slider.currentIndex + 1;
		self.slider.updatePagination();
		self.slider.updateSlides('left');

	});

	$("#slides .pagination li").on('click', function () {

		if (self.slider.animating == true) { return }

		self.slider.lastAction = new Date();

		if ($(this).hasClass('current')) { return; }
		$("#slides .pagination li").removeClass('current');
		$(this).addClass('current');

		self.slider.currentIndex = $(this).index() + 1;


		self.slider.updateSlides('fade');

	});

    // Start Auto slide
	setInterval(function () {
		self.slider.autoSlide();
	}, 8000);




    // Promotion Code Handling

    // Check if there's a promotion, else check if there's a default promotion
	if ($.COR.defaultPromotion) {
	    setTimeout(function () {
	        $("#promotion-coupon").show();
	        $("#promotion-holder").slideDown();

	    },500);
	}



}

$.CPAEB.pages.home.slider.updatePagination = function () {

	$("#slides .pagination li").removeClass('current');
	var liArray = $("#slides .pagination li");

	// array is 0 index, slider is 1 index
	$(liArray[this.currentIndex - 1]).addClass('current');

}

$.CPAEB.pages.home.slider.updateSlides = function (animation) {

	var self = this;

	this.animating = true;

	var currentSlideIndex = this.currentIndex - 1;

	var slideArray = $("#slides .slides_control .slide");

	if (animation == 'fade') {
		$("#slides .slides_control .slide:visible").fadeOut(function () {
			$(slideArray[currentSlideIndex]).fadeIn(function () {
				self.animating = false;
			});
		});
	}
	else {

		var showAnimation = animation == 'left' ? 'right' : 'left';

		$("#slides .slides_control .slide:visible").hide('slide',{direction:animation},600,function () {
			$(slideArray[currentSlideIndex]).show('slide', { direction: showAnimation }, 1000, function () {
				self.animating = false;
			});
		});
	}
	

	

}

$.CPAEB.pages.home.slider.autoSlide = function () {

	var self = $.CPAEB.pages.home;

	// Ignore autoSlide if there's been an action in the last 10 seconds
	if (self.slider.lastAction != null && new Date() - self.slider.lastAction < 10000) { return }

	self.slider.currentIndex = self.slider.currentIndex + 1 > self.slider.maxIndex ? 1 : self.slider.currentIndex + 1;
	self.slider.updatePagination();
	self.slider.updateSlides('left');
}










$.CPAEB.registerEvents($.CPAEB.pages.home.events);


