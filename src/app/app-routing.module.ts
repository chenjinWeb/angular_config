import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./home/home.component";
//import {AuthGuard} from "./guard/auth.guard";
import {LoginComponent} from "./login/login.component";

const routes: Routes = [
  {
    path:"",
    //canActivate: [AuthGuard],
    redirectTo:"/login",
    pathMatch:"full"
  },
  {
    path:"",
    //canActivate: [AuthGuard],
    component:HomeComponent,
    children:[
      {
        path:"",
        loadChildren:"app/index/index.module#IndexModule"
      },
      {
        path:"home",
        loadChildren:"app/index/index.module#IndexModule"
      },
    ]
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:"home",
    //canActivate: [AuthGuard],
    redirectTo:"/home/profiledata",
    pathMatch:"full"
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
