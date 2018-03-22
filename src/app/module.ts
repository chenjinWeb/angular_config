import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {SearchComponent} from "./components/search/search.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,

  ],
  declarations: [
    SearchComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    HttpClientModule,

    SearchComponent

  ],
  providers: [

  ]
})
export class Module {

}
