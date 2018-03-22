import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {IndexpageComponent} from "./indexpage/indexpage.component";


const routes: Routes = [
  {
    path:"",
    children:[
      {
        path:"indexpage",
        component:IndexpageComponent,
        //resolve:{jurisdiction:RoleResolve},
        //canActivate:[AuthGuard]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndexRoutingModule { }
