import { Injectable } from '@angular/core';
import {
  HttpClient
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
//2018-03-10T09:00:00.000Z , 2018-03-10T10:00:00.000Z
  config: any = {};

  constructor( public http : HttpClient) {


   this.config = {
      rethinkdb: {
        logs: {
          url: "logs/rethinkdb?min={min}&max={max}&limit={limit}&skip={skip}",
          method: "GET"
        }
      },
      cratedb: {
        logs: {
          url: "logs/cratedb?min={min}&max={max}&limit={limit}&skip={skip}",
          method: "GET"
        }
      }
  
    }
  }

  get(url: string, params: any):any {
    console.log(params);
    console.log(url);
    return this.http.get(url);
  }
  
  execute (api,params,body):Observable<any> {
    try {
        let url = this.format(api.url,params);
        api.body = body;
        url = this.API_ENDPOINT + url;        
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

format(url: string, data: object):string {
  let keys = Object.keys(data);

  for (var i = 0; i < keys.length; i++) {
      var regexp = new RegExp('\\{' + keys[i] + '\\}', 'gi');
      url = url.replace(regexp, data[keys[i]]);
  }
  return url;
}

}
