import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from "@angular/common/http"

import * as qs from 'querystring';
import {Result} from "../model"
import {Observable} from "rxjs/Observable";

@Injectable()
export class ConfigService {

  /*线上*/
  //static baseUrl="https://adminpc.lcinc.cn/api";

  /*试运行*/
  //static baseUrl="http://vmmobile2.lcinc.cn/api";

  /*测试*/
  //static baseUrl="http://192.168.100.149/api";

  /*张座安*/
  //static baseUrl="http://192.168.100.122:9111/api";

  /*梁昌强*/
  static baseUrl="http://192.168.100.118:9111/api";

  /*上传路径*/
  static uploadPath = 'http://192.168.100.118:9111/api';

  constructor(private _http:HttpClient) { }

  configForm() {
    return new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
  }

  /**
   * @deprecated 直接通过FormData处理
   */
  configFormData() {
    return new HttpHeaders().set('Content-Type', 'multipart/form-data');//;charset=UTF-8
  }

  configJson() {
    return new HttpHeaders().set('Content-Type', 'application/json;charset=UTF-8');
  }

  /*application/x-www-form-urlencoded;charset=UTF-8*/
  postForm(url, body = {}, config = {withCredentials:true}): Observable<any> {
    return this._http.post<Result>(ConfigService.baseUrl + url, qs.stringify(body), {headers: this.configForm(),...config})
  }

  /*form表单提交*/
  postFormData(url, body = {}, config = {withCredentials:true}): Observable<any> {
    const f = new FormData();
    for (let i in body) {
      f.append(i, body[i]);
    }
    return this._http.post<Result>(ConfigService.baseUrl + url, f, {...config})
  }

  /*上传*/
  postFormDataUpload(url, body = {}, config = {withCredentials:true}): Observable<any> {
    const f = new FormData();
    for (let i in body) {
      if (body.hasOwnProperty(i)) f.append(i, body[i]);
    }
    return this._http.post<Result>(ConfigService.uploadPath + url, f, {...config})
  }

  /*json格式提交*/

  postJson(url, body = {}, config = {withCredentials:true}): Observable<any> {
    return this._http.post<Result>(ConfigService.baseUrl + url, body, {headers: this.configJson(),...config})
  }

  get(url, body: any = {}, config = {withCredentials:true}): Observable<any> {
    return this._http.get<Result>(`${ConfigService.baseUrl + url}?${qs.stringify(body)}`, config)
  }

  getUrl(url, body: any = {}): string {
    let search = qs.stringify(body);
    if (search) {
      return ConfigService.baseUrl + url + '?' + search
    }
    return ConfigService.baseUrl + url
  }

}
