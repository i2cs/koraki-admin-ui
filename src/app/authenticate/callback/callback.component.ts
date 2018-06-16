import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})

// callback component is not a part of authentication module
export class CallbackComponent implements OnInit {

  constructor(auth: AuthService) {
    auth.handleAuthentication();
   }

  ngOnInit() {
  }

}
