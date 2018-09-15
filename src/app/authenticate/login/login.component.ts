import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  test: Date = new Date();

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.login();
  }

  ngOnDestroy() {
  }

  redirectToLogin() {
    //this.authService.login();
  }
}
