import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private router:Router
  ) { }

  ngOnInit() {

  }

  username:string='';
  password:string="";

  login(){
    if(this.username=="123"  && this.password=='123'){
      this.router.navigate(['/home/indexpage']);
    }
  }


}
