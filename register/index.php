<?php


    // get MySQL login data
    require "include1.php";
    include('recaptcha-php-1.11/recaptchalib.php');

    // enable sessions
    session_start();

	$emailError = "";
	$success = "";
	$mobileError = "";
	$captchaError = "";



        // connect to database
        if (($connection = mysql_connect(HOST, USER, PASS)) === FALSE)
            die("Could not connect to database".mysql_error());

        // select database
        if (mysql_select_db(DB, $connection) === FALSE)
            die("Could not select database".mysql_error());


        //if all fields are not void
        if(isset($_POST["fname"]) && isset($_POST["lname"])  && isset($_POST["email"])
        && isset($_POST["mob"]) && isset($_POST["insti"])){
        $privatekey = "6Ld3idYSAAAAABV9TiSr1WWjQn5XVCsp6p-GGcwa";
        if(isset($_POST["recaptcha_challenge_field"])&&isset($_POST["recaptcha_response_field"]))$resp = recaptcha_check_answer ($privatekey,
                                $_SERVER["REMOTE_ADDR"],
                                $_POST["recaptcha_challenge_field"],
                                $_POST["recaptcha_response_field"]);

        if (!$resp->is_valid) {
        // What happens when the CAPTCHA was entered incorrectly
        	$captchaError = $resp->error;
          } else {

          // prepare SQL
        $sql = sprintf("SELECT 1 FROM user WHERE mob='%s'",mysql_real_escape_string($_POST["mob"]));


        // execute query
        $result = mysql_query($sql);
        if ($result === FALSE)
            die("Could not query database");

        // check whether we found a row
        if (mysql_num_rows($result) == 0){


       // prepare SQL
        $sql1 = sprintf("SELECT 1 FROM user WHERE email='%s'",mysql_real_escape_string($_POST["email"]));


        // execute query
        $result1 = mysql_query($sql1);
        if ($result1 === FALSE)
            die("Could not query database");

        // check whether we found a row
        if (mysql_num_rows($result1) == 0){


             //prepare SQL

             $sql2 = sprintf("INSERT INTO user (fname,lname,email,mob,insti) VALUES('%s','%s','%s','%s','%s')",
                          mysql_real_escape_string($_POST["fname"]),
                          mysql_real_escape_string($_POST["lname"]),
                          mysql_real_escape_string($_POST["email"]),
                          mysql_real_escape_string($_POST["mob"]),
                          mysql_real_escape_string($_POST["insti"]));

                         if (!mysql_query($sql2))
                            die('Error: ' . mysql_error());
                                    $success = "Successfully registered.";
									unset($_POST);

                                         
                                         }
        else{
          $emailError = "Email already registered";
        }
        }
        else{
          $mobileError = "Mobile number already registered";
        }

        }
    }
 ?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Concetto | Registrations</title>

<link rel="stylesheet" type="text/css" href="../css/bootstrap.css" />
<link rel="stylesheet" type="text/css" href="../css/bootstrap-responsive.css" />

    <script type="text/javascript" src="../js/jquery-1.7.2.min.js"> </script>

	<script type="text/javascript">
		$(document).ready(function() {			
			$("#registerForm").submit(function() {
				var mobNo = document.forms.registerForm.mob.value;
				var fname = document.forms.registerForm.fname.value;
				var lname = document.forms.registerForm.lname.value;
				var toRet = true;
				if(isNaN(mobNo) || mobNo.length != 10)
				{
					$('#mobControl').addClass('error');	
					toRet = false;
				}
				if(!fname.match(/^[a-zA-Z]+$/))
				{
					$('#fnameControl').addClass('error');	
					toRet = false;
				}
				if(!lname.match(/^[a-zA-Z]+$/))
				{
					$('#lnameControl').addClass('error');	
					toRet = false;
				}
				alert(lname.trim());
				
				return toRet;
			});
		});
	</script>

</head>

<body>


   <div class="row-fluid">
  <div class="page-header">
    <h1> <img src="../img/logo.png" /> Registrations</h1>
  </div>

</div>

<div class="container">

   <section id="forms">
  <div class="row-fluid">
    
        <div class="span8 offset2">


<?php
	if($success != "")
	{
		?>
		<div class="alert alert-block alert-success">
        	<p>
            	You have successfully registered to Concetto 2012.
            </p>
        </div>
        <?
	}
		
?>
      <form action="." method="post" name="registerForm" id="registerForm" class="form-horizontal well">
      	<legend>Register to create your account.</legend>
        <div class="alert alert-block alert-info">
        	<p>
            	Please fill in the details carefully. These cannot be changed again.
            </p>
        </div>
        <fieldset>
        <div class="control-group" id="fnameControl">
            <label class="control-label" for="fname">First Name</label>
            <div class="controls">
              <input type="text" id="fname" name="fname" value="<?php if(isset($_POST['fname'])) echo $_POST['fname']; ?>">
              <span class="help-inline"></span>
            </div>
          </div>
        <div class="control-group" id="lnameControl">
            <label class="control-label" for="lname">Last Name</label>
            <div class="controls">
              <input type="text" id="lname" name="lname" value="<?php if(isset($_POST['lname'])) echo $_POST['lname']; ?>">
              <span class="help-inline"></span>
            </div>
          </div>

        <div id="mobControl" class="control-group <?php if($mobileError != "") echo "error" ?>">
            <label class="control-label" for="mob">Mobile</label>
            <div class="controls">
              <input type="text" id="mob" name="mob" maxlength="10" autocomplete="off" value="<?php if(isset($_POST['mob'])) echo $_POST['mob']; ?>">
              <span class="help-inline"><?php if($mobileError != "") echo "The mobile number is invalid, or has already been registered." ?></span>
            </div>
          </div>

        <div class="control-group <?php if($emailError != "") echo "error" ?>">
            <label class="control-label" for="email">Email</label>
            <div class="controls">
              <input type="email" id="email" name="email" autocomplete="off" value="<?php if(isset($_POST['email'])) echo $_POST['email']; ?>">
              <span class="help-inline" id="emailMessage"><?php if($emailError != "") echo "The email ID is invalid, or has already been registered." ?></span>
            </div>
          </div>

        <div class="control-group">
            <label class="control-label" for="email">College/Institution</label>
            <div class="controls">
              <input type="text" id="insti" name="insti" value="<?php if(isset($_POST['insti'])) echo $_POST['insti']; ?>">
              <span class="help-inline" id="emailMessage"></span>
            </div>
          </div>

        <div class="control-group <?php if($captchaError != "") echo "error" ?>">
            <div class="controls">

					  <?php

                    $publickey = "6Ld3idYSAAAAAIty2HJrjzH1Yl5IrXJ1UVJ686al"; // you got this from the signup page
                    echo recaptcha_get_html($publickey);
					if($captchaError != "")
					{
						echo "<br />Words did not match";
					}

                       ?>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" id="registerButton" name="registerSubmit" value="Register">Register</button>
          </div>
        </fieldset>
      </form>
    </div>
  </div>

</section>

</div>
</body>
</html>