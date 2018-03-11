import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpInterceptor
} from '@angular/common/http'
import { Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
/** 
 * this is used for configuring resp apis,
 * and all rest calls will be processed though it.
 */

 export interface Methods {}

 @Injectable()
export class RestService {
  
  API_ENDPOINT = "http://ideal-cardinal.hackathon.venom360.com/api/";
 // API_ENDPOINT = "http://localhost:8081/"

  config: any = {};

  constructor( public http : HttpClient) {

   this.config = {
      rethinkdb: {
        logs: {
          url: "logs/rethinkdb?min=2018-03-10T09:00:00.000Z&max=2018-03-10T10:00:00.000Z&limit={limit}&skip={skip}",
          method: "GET"
        }
      },
      cratedb: {
        logs: {
          url: "logs/cratedb?min=2018-03-10T00:00:00.000Z&max=2018-03-10T09:59:59.999Z&limit={limit}&skip={skip}",
          method: "GET"
        }
      }
  
    }
  }

  get(url: string, params: any):any {
    console.log(params);
    return this.http.get(url);
  }
  
  execute (api,params,body) {
    try {
        let url = this.format(api.url,params);
        api.body = body;
        url = this.API_ENDPOINT + url;
        console.log(url);
        //delete api.url;
        
        // return this[api.method.toLowerCase()].call(url,api).map(res => {
        //   console.log(res)
        //  res =  res.json()
        // });

      return this.get(url,params);
    }
    catch(error) {
        throw error;
  }
}

format(url: string, data: object) {
  let keys = Object.keys(data);

  for (var i = 0; i < keys.length; i++) {
      var regexp = new RegExp('\\{' + keys[i] + '\\}', 'gi');
      url = url.replace(regexp, data[keys[i]]);
  }
  return url;
}

}
