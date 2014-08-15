<?php
date_default_timezone_set("PRC");
$work_path = dirname ( __FILE__ );
$log_path = realpath ( $work_path);
require_once ($work_path . '/third_party/phpmailer/class.phpmailer.php');

$date = date ( 'Y-m-d H:i:s', time () - 24 * 60 * 60 );
$log_file = $log_path . '/data/monitor_data.txt';

$subject = 'sinaads monitor(' . $date . ')';
$body = '';
$mail_address = array ('xiaobin8@staff.sina.com.cn');
if (file_exists ( $log_file ) && filesize ( $log_file )) {
    $body = 'monitor found error!!<br/>';
    $mail = new PHPMailer ();
    $mail->CharSet = 'GB2312';
    $mail->SetFrom ( 'xiaobin8@staff.sina.com.cn' );
    foreach ( $mail_address as $address ) {
            $mail->AddAddress ( $address );
    }
    $mail->Subject = $subject;
    $mail->MsgHTML ( $body );
    $mail->AddAttachment($log_file, 'error_detail'.$date.'.txt'); 
    if (! $mail->Send ()) {
            echo "Mailer Error: " . $mail->ErrorInfo;
    } else {
            echo "Message sent!";
    }
}