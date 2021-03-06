﻿window.onblur = function () { window.blurred = true; };
window.onfocus = function () { window.blurred = false; };


(function ($) {

    // Adding COR ot jQuery
    $.CPAEB = {
        events: [],
        pages: {}
    };

})(jQuery);


var siteOptions = {
    defaultPromotion: null, //"CPA75OFF",
    loginCallback: function () {

        $.CPAEB.hideLoginUI();
        location.hash = "account";
    }
};





$.CPAEB.init = function () {

    var self = this;

    var singlePages = ["product-pricing", "about", "contact"];
    var accountPages = ["study", "my-review", "my-info","accountfaqs","contact"];
    var singlePopups = ["privacy-policy", "terms-of-service","reset-password", "set-password"];

    var pageHashCallback = function (hash) {

        $.COR.Utilities.FullScreenOverlay.hide();

        var loc = hash[0];
        var result = false;

        if (hash.length == 1 && $.inArray(loc, singlePages) != -1) {

            //Auto Header Nav - Page Nav
            if (!$("#header-navigation_" + loc).hasClass('current')) {
                $("#header-navigation li").removeClass('current');
                $("#header-navigation_" + loc).addClass('current');
            }

            // We're going to handle subpages and 'default's by using a loc_default subpage and showing it
            // We also assume that the rest of the subpages are loc_content (showing these would be used by doing two parts,
            // i.e. part1/part and used in the else

            // hide anything sub pages that might be open
            $("." + loc + "-content").addClass('hidden');

            // Show the default

            $("#" + loc + "-default").removeClass('hidden');

            $.COR.pageSwap($.COR.getCurrentDisplayedId(), 'js-content-wrapper-' + loc);

            result = true;
        }
        return result;
    };
    
    var popupHashCallback = function (hash) {

        var loc = hash[0];
        var result = false;

        if (hash.length == 1 && $.inArray(loc, singlePopups) != -1) {

            var fileName = loc.replace(/-/g, '');

            // No idea how to handle actions of externally loaded popups, or any kind of hash driven popups at all...
            $.COR.Utilities.FullScreenOverlay.loadExternal("/HTMLPartials/Home/" + fileName + ".html", "medium", true, function () {


                switch (loc) {

                    case "reset-password":

                        $("#reset-account-update-password").off("click").on("click", function (e) {
                            e.preventDefault();
                            $('#reset-account-reason').html('');
                            $('#reset-account-update-password').attr('disabled', true).hide();
                            $('#reset-account-swirly').removeAttr('style');

                            if ($.COR.validateForm($(this).parents("form"))) {

                                $.COR.services.sendResetEmail({email:$("#reset-account-username").val()}, function () {
                                    $("#reset-password-holder").hide();
                                    $("#reset-password-complete-holder").fadeIn();
                                },
                                function () {
                                    $('#reset-account-swirly').css('display', 'none');
                                    $('#reset-account-update-password').removeAttr('disabled').show();
                                    alert("Error: Please Try Again Or Contact Us");
                                });

                            }
                            else {
                                $('#reset-account-swirly').css('display', 'none');
                                $('#reset-account-update-password').removeAttr('disabled').show();
                            }
                        });

                        break;

                    case "set-password":

                        var email = $.COR.Utilities.getURLParameter("User");
                        var hash = $.COR.Utilities.getURLParameter("Hash")

                        var tempUser = null;


                        if (email == null || hash == null) {
                            $("#set-password-check-hash-holder").hide();
                            $("#reset-password-error-holder").fadeIn();
                        }
                        else {

                            // First we validate link
                            $.COR.services.validatePasswordResetLink({
                                email: email,
                                hash: hash
                            },
                            function (data) {

                                if (data.Hash !== undefined) {
                                    $("#set-password-check-hash-holder").hide();
                                    $("#set-password-holder").fadeIn();
                                    tempUser = data;
                                }
                                else {
                                    $("#set-password-check-hash-holder").hide();
                                    $("#reset-password-error-holder").fadeIn();
                                }
                            });

                        }




                        $("#reset-account-update-new-password").off("click").on("click", function () {
                            
                            var self = this;

                            // Now that we're logged on we'll update password

                            // Then we'll display completed

                            $('#reset-account-reason').html('');
                            $(self).attr('disabled', true).hide();
                            $('#reset-account-swirly').removeAttr('style');

                            if ($.COR.validateForm($(this).parents("form"))) {

                                var password = $.COR.MD5($("#reset-account-new-password").val());

                                // set new password
                                $.COR.services.resetPassword(
                                    { password: password, hash: tempUser.Hash },
                                    function (data) {
                                        
                                        $("#set-password-holder").hide();
                                        $("#reset-password-complete-holder").fadeIn();
                                    });


                            }
                            else {
                                $('#reset-account-swirly').css('display', 'none');
                                $(self).removeAttr('disabled').show();
                            }

                        });

                        break;

                }


            });

            result = true;
        }

        return result;
    };

    var subPageHashCallback = function (hash) {

        $.COR.Utilities.FullScreenOverlay.hide();

        // It's a subpage!
        //console.log("show: " + parts[0] + " @ " + parts[1]);

        /*
            Subpages work by using the #part1/part2 to build the content id that is shown : id='part1_part2'
            In order to have multiple sub pages that show and hide, we assume that they are all on the same branch, 
            so we can go to the parent hide everyone at that level, then show the one that we want to see...

            Should work ... and scale to even deeper levels if needed!
        */

        var parts = hash;
        var loc = hash[0] + "/" + hash[1];

        var element = $("#" + parts[0] + "_" + parts[1]);
        var result = false;


        if (element.length > 0) {

            //Auto Header Nav - Page Nav
            //if (!$("#header-navigation_" + parts[0]).hasClass('current')) {
            //    $("#header-navigation li").removeClass('current');
            //    $("#header-navigation_" + parts[0]).addClass('current');
            //}

            $("#header-navigation li").removeClass('current');
            $("#header-navigation_" + parts[0]).addClass('current');


            $(element).parent().children().addClass("hidden");
            $(element).removeClass("hidden");

            $.COR.pageSwap($.COR.getCurrentDisplayedId(), 'js-content-wrapper-' + parts[0]);

            $(".nav a[href='#" + loc + "']").parents(".js-content-wrapper").find("ul.nav a").removeClass("active");

            $(".nav a[href='#" + loc + "']").addClass('active');

            result = true;
        }

        return result;
    };

    /* Account Callbacks */

    var accountPagesCallback = function (hash) {

        var result = false;
        var loc = hash[0] + "/" + hash[1];

        if (hash.length >= 2 && $.inArray(hash[1], accountPages) != -1) {


            if ($.COR.account.user != null) {

                result = true;

                $.COR.log("Account Page: " + loc);

                if (hash.length == 1) {
                    $("#header-navigation-account_study").addClass('current');
                }
                else if (hash.length == 2) {

                    //Auto Header Nav - Page Nav
                    if (!$("#header-navigation-account_" + hash[1]).hasClass('current')) {
                        $("#header-navigation-account li").removeClass('current');
                        $("#header-navigation-account_" + hash[1]).addClass('current');
                    }

                    // We're going to handle subpages and 'default's by using a loc_default subpage and showing it
                    // We also assume that the rest of the subpages are loc_content (showing these would be used by doing two parts,
                    // i.e. part1/part and used in the else

                    // hide anything sub pages that might be open
                    $("." + hash[1] + "-content").addClass('hidden');

                    // Show the default

                    $("#" + hash[1] + "-default").removeClass('hidden');

                    $.COR.pageSwap($.COR.getCurrentDisplayedId(), 'js-content-wrapper-' + hash[1]);
                }
                else if (hash.length == 3) {
                    // It's a subpage!
                    $.COR.log("show: " + hash[0] + " @ " + hash[1] + " @ " + hash[2]);

                    var loc = hash[0] + "/" + hash[1] + "/" + hash[2];

                    // Make sure header is visible
                    if (!$("#header-navigation-account_" + hash[1]).hasClass('current')) {
                        $("#header-navigation-account li").removeClass('current');
                        $("#header-navigation-account_" + hash[1]).addClass('current');
                    }

                    // hide anything sub pages that might be open
                    $("." + hash[1] + "-content").addClass('hidden');

                    // Show the default

                    $("#" + hash[1] + "_" + hash[2]).removeClass('hidden');


                    /*
                        Subpages work by using the #part1/part2 to build the content id that is shown : id='part1_part2'
                        In order to have multiple sub pages that show and hide, we assume that they are all on the same branch, 
                        so we can go to the parent hide everyone at that level, then show the one that we want to see...
        
                        Should work ... and scale to even deeper levels if needed!
                    */

                    //var element = $("#" + hash[0] + "_" + hash[1]);
                    //$(element).parent().children().addClass("hidden");
                    //$(element).removeClass("hidden");

                    $.COR.pageSwap($.COR.getCurrentDisplayedId(), 'js-content-wrapper-' + hash[1]);

                    $(".nav a").removeClass('active');

                    $(".nav a[href='#" + loc + "']").addClass('active');

                }


            }
            else { // I don't think this will ever get called...

                self.hideLoginUI();

                $.COR.Utilities.refreshLogin(function () {
                    //$.CPAEB.setupAccountHashHandling(accountPagesCallback, accountStartPracticeCallback);
                    $(window).hashchange();
                    
                });
                result = true;

            }








            result = true;

        }

        return result;

    };

    var accountStartPracticeCallback = function (hash) {

        var loc = hash[1];
        var result = false;

        if (hash.length == 2 && loc == "start-practice") {
            $.COR.account.startStudy();
            result = true;
        }

        return result;

    };

    var accountCallback = function (hash) {

        var result = false;
        var loc = hash[0];

        if (hash.length == 1 && loc == "account") {

            if ($.COR.account.user != null) {

                $.CPAEB.setupAccountHashHandling(accountPagesCallback, accountStartPracticeCallback);
                $("#header-navigation-account_study").addClass('current');
                result = true;

            }
            else {

                self.hideLoginUI();

                $.COR.Utilities.refreshLogin(function () {
                    $.CPAEB.setupAccountHashHandling(accountPagesCallback, accountStartPracticeCallback);
                    $("#header-navigation-account_study").addClass('current');
                });
                result = true;
            }
        }

        // We need to refresh login and try again
        else if (loc == "account" && hash.length > 1 && $.COR.account.user == null) {

            self.hideLoginUI();

            $.COR.Utilities.refreshLogin(function () {
                $.CPAEB.setupAccountHashHandling(accountPagesCallback, accountStartPracticeCallback);
                $(window).hashchange();
            });
            result = true;
        }

        return result;
    };



    // Setup any hash handling
    $.COR.Utilities.HashHandler.init({
        hashRequests: [
            $.COR.Utilities.HashHandler.buildHashRequest({
                callback: pageHashCallback
            }),
            $.COR.Utilities.HashHandler.buildHashRequest({
                callback: popupHashCallback
            }),
            $.COR.Utilities.HashHandler.buildHashRequest({
                callback: subPageHashCallback
            }),
            $.COR.Utilities.HashHandler.buildHashRequest({
                callback: accountCallback
            })
        ],
        defaultHashRequest: $.COR.Utilities.HashHandler.buildHashRequest({
            callback: function () {
                
                // Show Home Page If No User
                if ($.COR.account == undefined || $.COR.account.user == null) {
                    $.COR.Utilities.FullScreenOverlay.hide();
                    $.COR.toggleHomeNavigation();
                    $.COR.pageSwap(null, "home");
                }

                // Show Default Account Page Otherwise
                else{
                    $.COR.account.showDefaultPage();
                }

                return true;
            }
        })

    });


    for (var i = 0; i < this.events.length; i++) {
        this.events[i]();
    }

}

$.CPAEB.hookupGoogleAnalyticsEventWatcher = function () {

    $(document).on('click', 'a', function () {
        console.log("Link clicked: " + $(this).html());
    });

    $(document).on('click', 'button', function () {
        console.log("Button clicked: " + $(this).html());
    });
}

$.CPAEB.hideLoginUI = function () {
    $("#header-login-container").hide();
    $("#header-logout-container").show();
    $("#home-login-password").val("");
    $("#home-login-username").val("");
}

$.CPAEB.setupAccountHashHandling = function (accountPagesCallback, accountStartPracticeCallback) {

    $.COR.Utilities.HashHandler.addHashRequest(
        $.COR.Utilities.HashHandler.buildHashRequest({
            callback: accountPagesCallback
        })
    );

    $.COR.Utilities.HashHandler.addHashRequest(
        $.COR.Utilities.HashHandler.buildHashRequest({
            callback: accountStartPracticeCallback
        })
    );
}

$.CPAEB.registerEvents = function (eventsFunction) {
    $.CPAEB.events.push(eventsFunction);
}

/* TODO: Clean up all this stuff... */


$.COR.TPrep = {};


// TODO Get rid of all of this and replace with Utilities Popup code
$.COR.TPrep.showFullScreenOverlay = function (content, contentClassSize, events) {


    if ($("#full-screen-container").is(":visible")) {

        $("#full-screen-container .content").fadeOut(function () {
            $(this).html("");

            $("#full-screen-container .content").html(content).attr("class","").addClass(contentClassSize + " content").fadeIn();

            if (typeof events == 'function') {
                events();
            }

            $("#full-screen-overlay").fadeIn();
        });


    }
    else {
        $("#full-screen-container .content").html(content);

        $("#full-screen-container").attr("class", "").addClass(contentClassSize);

        $("#full-screen-holder").show();
        $("#full-screen-container").show();


        if (typeof events == 'function') {
            events();
        }

        $("#full-screen-overlay").fadeIn();
    }
}

$.COR.TPrep.hideFullScreenOverlay = function () {

    $("#full-screen-container").fadeOut(function () {
        $("#full-screen-overlay").fadeOut(200);
    });
}


$.COR.ShowRegPopup = function (successCallback) {

    $.COR.Utilities.FullScreenOverlay.loadLocal("js-overlay-register", $("#js-overlay-register").attr("contentSize"), false, function () {

        $("#full-screen-container .registration-far").prop('checked', $("#pricing-row1-check").prop('checked'));
        $("#full-screen-container .registration-aud").prop('checked', $("#pricing-row2-check").prop('checked'));
        $("#full-screen-container .registration-bec").prop('checked', $("#pricing-row3-check").prop('checked'));
        $("#full-screen-container .registration-reg").prop('checked', $("#pricing-row4-check").prop('checked'));


        if ($.COR.defaultPromotion != null) {
            $("#full-screen-container .registration-promo-code-row").show();
            $("#full-screen-container .registration-promotion-code").val($.COR.defaultPromotion);
        }
        else {
            $("#full-screen-container .registration-promotion-code").val('none');
        }


        $("#full-screen-container .registration-finish-button").on("click", function (e) {

            e.preventDefault();

            if ($(this).hasClass("disabled")) { return; }

            var clickedElement = this;
            var originalHTML = $(this).html();


            $(this).addClass('disabled');

            if ($.COR.validateForm($("#full-screen-container .registration-popup-form"))) {

                var email = $("#full-screen-container .registration-email").val();
                var password = $("#full-screen-container .registration-password").val();
                var promoCode = $("#full-screen-container .registration-promotion-code").val();

                var far = $("#full-screen-container .registration-far").is(":checked") ? "1" : "0";
                var aud = $("#full-screen-container .registration-aud").is(":checked") ? "1" : "0";
                var bec = $("#full-screen-container .registration-bec").is(":checked") ? "1" : "0";
                var reg = $("#full-screen-container .registration-reg").is(":checked") ? "1" : "0";

                var sections = [
                    {
                        "FAR": far,
                        "AUD": aud,
                        "BEC": bec,
                        "REG": reg
                    }
                ];

                $(this).html("One Sec...");

                var refSource = $.COR.Utilities.getURLParameter("source") ? $.COR.Utilities.getURLParameter("source") : "none";

                $.COR.services.register(email, password, sections, refSource, promoCode, function (response) {

                    // this will need to be updated to check if promo code was expired
                    if (response.Result == "0") {
                        $("#full-screen-container .registration-email").parent().append("<span class='error-message'>" + response.Reason + "</span>");
                        $("#full-screen-container .registration-finish-button").removeClass("disabled").html(originalHTML);
                    }
                    else {

                        // We should be able to automatically log them in...
                        $.COR.services.login(email, password, function () {


                            $.COR.toggleAccountNavigation(); // TODO: This should be done on the account side of things
                            $.COR.TPrep.hideFullScreenOverlay();

                            // TODO: This should be handled better
                            $("#header-login-container").hide();
                            $("#header-logout-container").show();


                            location.hash = "account";


                        });
                    }
                });

            }
            else {
                $("#full-screen-container .registration-finish-button").removeClass("disabled").html(originalHTML);
            }


        });


        if (typeof successCallback == "function") {
            successCallback();
        }

    });
}



$(document).ready(function () {

   

    if ($.COR.Utilities.getURLParameter("offline") != null) {
        $.COR.account.offline = true;
    }

    if ($.COR.Utilities.getURLParameter("debug") != null) {
        $.COR.debug = true;
    }

    if ($.COR.Utilities.getURLParameter("promo") != null) {
        // Set default promo code
        $.COR.defaultPromotion = $.COR.Utilities.getURLParameter("promo");
    }

    if ($.COR.Utilities.getURLParameter("register") != null) {

        var username = $.COR.Utilities.getURLParameter("u");
        var password = $.COR.Utilities.getURLParameter("p");

        $.COR.ShowRegPopup(function () {


            if (username.length > 0) {
                $("#full-screen-container .registration-email").val(username);
            }

            if (password.length > 0) {
                $("#full-screen-container .registration-password").val(password);
            }

            $(".registration-finish-button").trigger('click');

        });
    }





    $.COR.init(siteOptions);


    $.CPAEB.init();
    $.CPAEB.hookupGoogleAnalyticsEventWatcher();


    // Initialization
    $.COR.pageEvents();

    $("#pricing-holder .squaredTwo label").on('click', function () {
        var amount = 0;


        // This is necessary because the checkbox element doesn't change it's checked state till after this event occurs, so wait for that
        setTimeout(function () {

            $("#pricing-holder .squaredTwo input").each(function (index, element) {
                if ($(element).prop("checked")) {

                    var defaultAmount = 20;

                    // TODO GET THE 20 From Somewhere
                    if ($.COR.promotion != null) {


                        amount += (defaultAmount - ($.COR.promotion.Amount * defaultAmount / 100));
                    }
                    else {
                        amount += 20;
                    }
                }
            });

            $("#pricing-total .amount").html(amount);
        }, 50);

    });



    $(".register-sign-up").on('click', function () {

        // make sure to scroll to top of the page

        ga('send', 'event', 'button', 'click', 'show register popup', $(this).attr("id"));

        $.COR.ShowRegPopup();
        
        $('body,html').animate({
            scrollTop: 0
        }, 800);

    });



    $("#header-logo").on("click", function () {
        location.hash = "";
    });


    // This stuff should go in jquery.CPAEXAMBANK.Home.js ?
    $(".register-row input").on('click focus', function () {

        $(this).val("");

        if ($(this).attr("originalvalue") == "password") {
            $(this).attr("type", "password");
        }
    });

    $(".register-row input").on('blur', function () {

        if ($(this).val() == "") {
            $(this).val($(this).attr("originalvalue"));

            if ($(this).attr("originalvalue") == "password") {
                $(this).attr("type", "text");
            }
        }

    });

    $(".register-row .sign-up").on('click', function () {

        $.COR.ShowRegPopup(function () {
            if($(".register-row .registration-email").val() != $(".register-row .registration-email").attr("originalvalue")){
                $("#full-screen-container .registration-email").val($(".register-row .registration-email").val());
            }
            if ($(".register-row .registration-password").val() != $(".register-row .registration-password").attr("originalvalue")) {
                $("#full-screen-container .registration-password").val($(".register-row .registration-password").val());
            }

            $(".registration-finish-button").trigger('click');
        });

    })



    $(window).hashchange();


    //if ($.COR.Utilities.getURLParameter("register")) {
    //    $.COR.ShowRegPopup(function () {

    //    });

    //    //$('body,html').animate({
    //    //    scrollTop: 0
    //    //}, 800);
    //    $("#header-login-container").show();
    //}
    //else {
    //    $("#header-login-container").show();
    //}

    $("#header-login-container").show();

});

