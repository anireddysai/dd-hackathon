import { Component, OnInit } from '@angular/core';
import { RestService } from "../../injectables/rest.service";
import { LogsService } from "../../injectables/logs/logs.service";
import * as moment from 'moment';
import { FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  
  skip:number = 0;
  limit:number = 100;
  increament = 100;

  logs:Logs = {
    rethinkdb: [],
    cratedb: []
  };

  filter = {
    info:true,
    error:true,
    search: null
  };
  mindate = new Date();
  maxdate = new Date();

  settings = {
    timePicker: true,
    format: 'dd-MMM-yyyy hh:mm a',
}
  constructor(
    private http: RestService,
    private logsService: LogsService
  ) {
    console.log(this.http);

   }

  ngOnInit() {
    let params = {
      min:moment(this.mindate).toISOString(),
      max:moment(this.maxdate).toISOString(),
      limit: this.limit,
      skip:this.skip
    };

    this.getRethinkDBLogs(params);
    this.getCrateDBLogs(params);

    // this.logsService.onNewMessage().subscribe(res=> {
    //   console.log(res);
    // })

  }

  onDateSelect(event) {
    console.log(event);
  }

  getMoreLogs() {
    let params = {
      min:moment(this.mindate).toISOString(),
      max:moment(this.maxdate).toISOString(),
      limit: this.limit,
      skip:this.skip
    };

    this.skip += this.increament
    this.limit += this.increament;
    this.getRethinkDBLogs(params);
  }


  getRethinkDBLogs(params) {

    this.http.execute(this.http.config.rethinkdb.logs,params,{}).subscribe(
      data => {
        console.log(data);
        this.logs.rethinkdb  = this.logs.rethinkdb.concat(data);
      },
      error => {

      }
    )
  }

  getCrateDBLogs(params) {
    this.http.execute(this.http.config.cratedb.logs,params,{}).subscribe(
      data => {
        this.logs.cratedb  = this.logs.cratedb.concat(data);
      },
      error => {

      }
    )

  }

  tagChanged() {
      console.log("TAB CHANGED");
  }

}


export interface Logs {
  rethinkdb : Array<any>;
  cratedb: Array<any>
}