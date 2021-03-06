<?php




class ReportBuilder {
    




    public function build_report($report) {

		

		$this->connect_db();
		


		$this->$report();
    }


	public function rep_registered_users(){
		$this->output_title("Registered Users");

		$res = $this->dbq("SELECT AccountUser.AccountUserId, LoginName, StripeCustomerId, PromotionCode,  DATE_FORMAT(AccountUser.DateCreated,'%m/%d/%Y') FROM `AccountUser` Left Join License On AccountUser.AccountUserId = License.AccountUserId Left Join AccountUserToPromotion On AccountUser.AccountUserid = AccountUserToPromotion.AccountUserId Left Join Promotion On AccountUserToPromotion.PromotionId = Promotion.PromotionId WHERE AccountUser.AccountUserId NOT IN (1,2,3,4,5,6,7,13,28,113,114,116,117,118,119) Order By AccountUser.DateCreated Desc");
    
		$res_count = mysql_num_rows ( $res );

		echo "<h4>Registered Users: $res_count</h4>";

		$this->table_builder($res);
	}
  
    public function rep_question_history(){
  
        $this->output_title("Question History Usage By User");
        $res = $this->dbq("SELECT DISTINCT AccountUser.LoginName, COUNT( AccountUserQuestionHistory.QuestionId ) FROM AccountUser JOIN AccountUserQuestionHistory WHERE AccountUser.AccountUserId = AccountUserQuestionHistory.AccountUserId GROUP BY AccountUser.LoginName");
	    $this->table_builder($res); 
  
    }
  
    public function rep_raw_question_usage(){
        $this->output_title("Raw Question Usage Aggregate of Users");
        $res = $this->dbq("SELECT Count, Count(Count) as CountAmount From(SELECT Count(LoginName) As Count, AccountUser.AccountUserId,LoginName FROM `AccountUser` LEFT Join AccountUserQuestionHistory ON AccountUser.AccountUserId = AccountUserQuestionHistory.AccountUserId GROUP By LoginName) as Custom WHERE Count > 1  GROUP By Count");
        $this->table_builder($res);
    }

    public function rep_account_login(){
        $this->output_title("Number of Users Logged In In The Last Week");
        $res = $this->dbq("SELECT AccountUser.AccountUserId, LoginName, DateLastLogin
                           FROM  `AccountUserSettings` Join `AccountUser` On 
                           AccountUserSettings.AccountUserId = AccountUser.AccountUserId 
                           WHERE AccountUser.AccountUserId NOT IN (1,2,3,4,5,6,7,13,28,113,114,116,117,118,119) And
                           DateLastLogin between date_sub(now(),INTERVAL 1 WEEK) and now() 
                           ORDER BY  `AccountUserSettings`.`DateLastLogin` DESC");
                           
        $res_count = mysql_num_rows ( $res );

		echo "<h4>Registered Users: $res_count</h4>";
                           
        $this->table_builder($res);   
    }
    
	
	// HTML Helpers

	public function output_title($report_name){
		echo "<h3>Building Report: $report_name (PROD)</h3><hr />";
	}

	public function table_builder($res){


		if(mysql_num_rows($res)) {
			echo '<table cellpadding="0" cellspacing="0" class="db-table">';
			while($row2 = mysql_fetch_row($res)) {
				echo '<tr>';
				foreach($row2 as $key=>$value) {
					echo '<td>',$value,'</td>';
				}
				echo '</tr>';
			}
			echo '</table><br />';
		}
		else{
			echo "<br /> No Results";
		}


	}


	// DB Helper
	public function connect_db(){
		mysql_connect("198.211.105.160", "root", "!Naffets77") or die(mysql_error());
		mysql_select_db("ciborium_prod") or die(mysql_error());
	}

	public function dbq($query){
		return mysql_query($query);
	}

}


?>