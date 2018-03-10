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

/*
{
  "architecture":"x86_64",
  "availabilityZone":"us-west-2a",
  "contentLength":"3994",
  "hostname":"ip-172-31-25-71","id":
  "9f1fc56c-6b1b-424e-a482-9428c2d321e7",
  "imageId":"ami-b730b0cf",
  "instanceId":"i-08c32e4129c3d12dd",
  "level":30,
  "ms":"0.454",
  "msg":"GET /application/2f97b9ca-6b3b-4520-8577-ebceedda13ad 200 0.454 ms - 3994","name":"Venom","pid":2820,"privateIp":"172.31.25.71",
  "publicHostname":"ec2-34-215-73-47.us-west-2.compute.amazonaws.com",
  "publicIpv4":"34.215.73.47",
  "region":"us-west-2",
  "remoteAddress":"75.171.179.111",
  "req":{
    "headers":{
      "accept-encoding":"gzip",
      "access-control-allow-headers":"Content-Type, Origin",
      "access-control-allow-methods":"GET, OPTIONS",
      "access-control-allow-origin":"*",
      "connection":"upgrade",
      "content-type":"application/json",
      "host":"api.im360.com",
      "if-modified-since":"Fri, 09 Mar 2018 23:59:57 GMT+00:00",
      "if-none-match":"W/\"f9a-9efG3AGY+0GO6NviqczZt9+51Ww\"",
      "key":"61d74a94-b52d-4aa7-ab09-25531ed9638a",
      "protocol-version":"1.1",
      "signature":"",
      "user-agent":"Dalvik/2.1.0 (Linux; U; Android 7.0; SM-G930V Build/NRD90M)",
      "x-forwarded-for":"75.171.179.111, 172.31.35.234",
      "x-forwarded-port":"443",
      "x-forwarded-proto":"http",
      "x-nginx-proxy":"true",
      "x-real-ip":"172.31.35.234"
    },
    "method":"GET",
    "remoteAddress":"127.0.0.1",
    "remotePort":33146,
    "url":"/api/v1.1/application/2f97b9ca-6b3b-4520-8577-ebceedda13ad"
  },
  "reqStart":"2018-03-10T00:00:00.752Z",
  "res":{
    "header":"HTTP/1.1 200 OK\r\nX-DNS-Prefetch-Control: off\r\nStrict-Transport-Security: max-age=15552000; includeSubDomains\r\nX-Download-Options: noopen\r\nX-Content-Type-Options: nosniff\r\nX-XSS-Protection: 1; mode=block\r\nServer-Version: v1.8.6-2-g3dac0d9\r\nContent-Type: application/json; charset=utf-8\r\nContent-Length: 3994\r\nETag: W/\"f9a-9efG3AGY+0GO6NviqczZt9+51Ww\"\r\nDate: Sat, 10 Mar 2018 00:00:00 GMT\r\nConnection: keep-alive\r\n\r\n","statusCode":200
  },
  "resStart":"2018-03-10T00:00:00.752Z",
  "time":"2018-03-10T00:00:00.752Z",
  "type":"access",
  "v":0,
  "venom_version":"v1.8.6-2-g3dac0d9",
  "version":"v1.8.6-2-g3dac0d9"
}
*/