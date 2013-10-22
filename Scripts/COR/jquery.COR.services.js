﻿



$.COR.services.getQuestionHistoryMetrics = function () {

    var ph = new $.COR.Utilities.PostHandler({
        service: "question", call: "getAccountUserQuestionHistory",
        params: {
            AccountUserId: $.COR.account.user.AccountUserId,
            QuestionAmount: 50,
            SectionTypeId: $("#my-review-section-type").val()
        },
        success: function (data) {
            $(thisElement).removeClass("disabled");
            self.BuildQuestionHistory(data.QuestionHistory);
        }
    });

}

$.COR.services.login = function (email, password, successCallback, failcallback) {

    var COR = $.COR;

    if (COR.account.offline == false) {
        var ph = new $.COR.Utilities.PostHandler({
            service: "account", call: "login",
            params: { email: email, password: $.COR.MD5(password) },
            success: function (data) {

                if (data.Account != null) {
                    // this isn't generic, the call to account should be in the success callback too much of passing the success callback around!
                    COR.account.setup(data, successCallback); 
                }
                else {
                    failcallback(data.LoginFailedReason);
                }

            }
        });

        ph.submitPost();
    }
    else {

        // 
        var data = {
            Account: {
                AccountUserId: "0",
                ContactEmail: "offlineuser@pubty.com",
                LoginName: "offlineuser@pubty.com"
            },
            Licenses: {
                Active: "1"
            },
            Subscriptions: {
                FAR: {
                    CancellationDate: null,
                    CurrentSubscriptionDate: "2013-09-08 22:24:14",
                    ExpirationDate: "2013-10-08 22:24:14",
                    FirstSubscribedDate: "2013-09-08 22:24:14",
                }
            },

            UserSettings: {
                ShowNewUserTour: "false"
            }
        };


        COR.account.setup(data, successCallback);
    }
}

$.COR.services.register = function (email, password, sections, callback) {

    if ($.COR.account.offline == false) {
        var ph = new $.COR.Utilities.PostHandler({
            service: "account", call: "registerNewUser",
            params: {
                email: email,
                password: $.COR.MD5(password),
                sections: JSON.stringify(sections)
            },
            success: function (data) {

                callback(data);

            }
        });

        ph.submitPost();
    }
    else {
        alert("Registration Not Available In Offline Mode");
    }


};

$.COR.services.createSubscription = function (token, successCallback) {

    if ($.COR.account.offline == false) {

        var ph = new $.COR.Utilities.PostHandler({
            service: "stripe", call: "createNewSubscriber",
            params: {
                stripeToken: token
            },
            success: function (data) {
                successCallback(data);
            }
        });

        ph.submitPost();


    }
    else {

    }

}

$.COR.services.chargeSubscription = function (subscription, successCallback) {

    if ($.COR.account.offline == false) {

        var ph = new $.COR.Utilities.PostHandler({
            service: "stripe", call: "chargeSubscription",
            params: {
                moduleSelection: subscription
            },
            success: function (data) {
                successCallback(data);
            }
        });

        ph.submitPost();


    }
    else {

    }

}

$.COR.services.sendResetEmail = function (options, successCallback, failedCallback) {
    //sendResetPasswordEmail


    var ph = new $.COR.Utilities.PostHandler({
        service: "account", call: "sendResetPasswordEmail",
        params: {
            email: options.email
        },
        success: function (data) {
            successCallback();
        },
        error: function () {
            failedCallback();
        }
    });

    ph.submitPost();
}

