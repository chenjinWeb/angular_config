import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndexRoutingModule } from './index-routing.module';
import {Module} from "../module";

import { IndexpageComponent } from './indexpage/indexpage.component';


@NgModule({
  imports: [
    CommonModule,
    IndexRoutingModule,
    Module
  ],
  declarations: [IndexpageComponent]
})
export class IndexModule { }
