<?php
require_once(realpath(__DIR__)."/config.php");
include_once(ciborium_configuration::$ciborium_librarypath."/ciborium_enums.php");
include_once(ciborium_configuration::$environment_librarypath."/utilities/util_datetime.php");
include_once(ciborium_configuration::$environment_librarypath."/utilities/util_errorlogging.php");
include_once(ciborium_configuration::$environment_librarypath."/validate.php");
include_once(ciborium_configuration::$environment_librarypath."/database.php");
include_once(ciborium_configuration::$environment_librarypath."/question.php");

class enum_SectionType{

    //See SectionType table
    //Current as of 6/23/2013
    const FAR = 1;
    const AUD = 2;
    const BEC = 3;
    const REG = 4;
    const All = 5;
}

class enum_QuestionType{

    //See QuestionType table
    //Current as of 5/22/2013
    const MultipleChoice = 1;
    const TaskBased = 2; //not in use yet
    const All = 3;

}

class enum_LicenseTransactionType{

    //See LicenseTransactionType table
    //Current as of 6/4/2014
    const Assigned = 1;
    const Subscribed = 2;
    const Cancelled = 3;
    const Suspended = 4;
    const Expired = 5;
    const Deactivated = 6;
    const Renewed = 7;
    const Reinstated = 8;
    const Changed = 9;
    const OneTimeCharge = 10;
    const OneTimeRefund = 11;
}

class enum_SubscriptionType{

    //See LicenseTransactionType table
    //Current as of 11/2/2013
    const Free = 1;
    const FAR = 2;
    const AUD = 3;
    const BEC = 4;
    const REG = 5;
    const FAR_AUD = 6;
    const FAR_BEC = 7;
    const FAR_REG= 8;
    const AUD_BEC = 9;
    const AUD_REG = 10;
    const BEC_REG = 11;
    const FAR_AUD_BEC = 12;
    const FAR_AUD_REG = 13;
    const FAR_AUD_BEC_REG = 14;
    const Perpetual = 15; //not public
    const AUD_BEC_REG = 16;
    const FAR_BEC_REG = 17;
    const FAR_AUD_BEC_REG_Perpetual = 18;
}

class enum_TestModeType{

    //See TestModeType table
    //Current as of 7/1/2013
    const Practice = 1;
    const TestSimulation = 2;

}

class enum_LogType{
    const Blocker = 1;
    const Critical = 2;
    const Normal = 3;
    const Warning = 4;
    const Ignore = 5;
}

class enum_PracticeNumberOfQuestions{
    const FreeLimit = 25;
    const Ten = 10;
    const Twenty = 20;
    const Thirty = 30;
    const Forty = 40;
    const Fifty = 50;
    const Sixty = 60;
    const Seventy = 70;
    const TestLength = 72;
    const Eighty = 80;
    const Ninety = 90;
}

class enum_SubscriptionTerm{
    const Monthly = 1;
    //const Annually = 2;
}

class enum_QuestionHistoryResult{
    const Correct = 1;
    const Incorrect = 2;
    //const Skipped = 3;
    const All = 4;
}

class enum_QuestionHistoryOrderBy{
    const Correct = 1;
    const Incorrect = 2;
    const Section = 3;
    const QuestionId = 4;
    const AverageTimeSpent = 5;
}

class enum_EmailTemplates{
    const Test_NonHTML = "_Test-NonHTMLEmail.html";
    const Test_HTML = "_Test-HTMLEmail.html";
    const NewUserRegistered = "RegistrationCompleted.html";
    const PasswordReset = "PasswordReset.html";
    const ContactUs_Company = "ContactUs_Company.html";
}

class enum_StripeUnitTests{
    const test_CreateToken = 1;
    const test_RetrieveToken = 2;
    const test_CreateNewCustomer = 3;
    const test_OneTimeCharge = 4;
    const test_NewSubscriptionCharge = 5;
    const test_CardDeclined = 6;
    const test_RemoveCreditCard = 7;
    const test_AddCreditCard = 8;
}

class enum_ResponseCodes{
    const Successful = 1;
    const InvalidInput = 2;
    const LoginExpired = 3;
    const ErrorThrown = 4;
    const Incomplete = 5;
    const InProgress = 6;
}


class enum_QuestionCategory{
    //See QuestionCategory table
    //last updated 11/20/2013
    const None = 1;
    const DisplayName2 = 2;
}

class enum_PromotionType{
    //See PromotionType table
    //last updated 12/12/2013
    const PercentOff_OneTime = 1;
    const PercentOff_Monthly = 2;
    const AmountOff_OneTime = 3;
    const AmountOff_Monthly = 4;
}

class enum_PromotionToUserStatus{
    const Applied = 1; //used up already
    const Redeemed = 2; //code is applied for user, but unused by user
    const Unredeemed = 3; //code is valid, but not given to user yet
    const Unknown = 4;
    const Invalid = 5; //covers expired and all other cases
}

class enum_PromotionStatus{
    const Active = 1; //valid and activated for public use
    const Expired = 2;
    const Redeemed = 3; //maximum redemption values have been met
    const Inactive = 4; //covers all other cases
}
?>