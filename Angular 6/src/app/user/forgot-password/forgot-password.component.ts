import { Component, OnInit } from '@angular/core';
import { UserService } from './../../shared/user.service';
import { ToastrNotificationService } from 'src/app/toastr-notification.model/toastr-notification.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  email: any;
  otp: boolean;
  otpNumber: string;
  showPasswordField: boolean;
  password: string;
  confirmPassword: string;
  isClicked = false;
  constructor(protected us: UserService, protected notificationService: ToastrNotificationService) { }

  sendEmailForVerification() {
    if (this.email) {
      this.isClicked = true;
      this.us.generateOtp(this.email).subscribe(res => {
        if (res.status === true) {
          this.otp = true;
          document.getElementById('email').setAttribute('readonly', 'readonly');
          this.notificationService.showNotification(0, 'Otp Sent to your entered email address');
        } else {
          this.notificationService.showNotification(1, 'Email Address not found');
        }
      });
    } else {
      this.notificationService.showNotification(1, 'Please enter email address');
    }
  }

  verifyOtp() {
    if (this.otpNumber) {
      this.us.verifyOtp({ 'otp': this.otpNumber }).subscribe(res => {
        if (res.status === true) {
          this.showPasswordField = true;

        } else {
          this.notificationService.showNotification(1, 'Otp doesn"t matched');
        }
      });
    }
  }

  resetpassword() {
    if (this.password && this.confirmPassword) {
      if (this.password === this.confirmPassword) {
        this.us.resetPassword({ 'id': this.email, 'password': this.password }).subscribe(res => {
          if (res.status === true) {
            this.notificationService.showNotification(0, 'Paasword Resseted Successfully');
          } else {
            this.notificationService.showNotification(1, 'Sorry for the inconvenience, Please try again later');
          }
        });
      } else {
        this.notificationService.showNotification(2, 'Password does not match');
      }
    } else {
      this.notificationService.showNotification(3, 'Please fill all the fields');
    }
  }
  ngOnInit() {
  }

}
