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

<!DOCTYPE html>
  <head>
    <title>Sign up</title>

  </head>
  <body>


     <form id="registration" onsubmit="return validate()" action="<?php echo $_SERVER["PHP_SELF"]; ?>" method="post">
      <table>
        <tr>
          <td>Firstname:</td>
          <td>
            <input name="fname" type="text"  /></td>
          </tr>
        <tr>
          <td>Lastname:</td>
          <td>
            <input name="lname" type="text"  /></td>
        </tr>


        <tr>
          <td>Email:</td>
          <td><input name="email" type="email"  /></td>

          </tr>
         <tr>

        <tr>
          <td>Mobile no.:</td>
          <td><input name="mob" type="text"  maxlength="10" /></td>
        </tr>

        <tr>
          <td>Institution/Colleage:</td>
          <td><input name="insti" type="text" /></td>
        </tr>

        <tr>
          <td></td>
          <td><input name="Sign up"  type="submit" value="Sign up" /></td>
        </tr>
      </table>

      <?php
    $publickey = "6Ld3idYSAAAAAIty2HJrjzH1Yl5IrXJ1UVJ686al"; // you got this from the signup page
    echo recaptcha_get_html($publickey);
       ?>
       
       <?php
	   		echo $emailError;
			echo $mobileError;
			echo $success;
			echo $captchaError;
	   ?>


    </form>
  </body>
</html>
