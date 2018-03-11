import { Component, OnInit } from '@angular/core';
import { RestService } from "../../injectables/rest/rest.service";
import { LogsService } from "../../injectables/logs/logs.service";
import * as moment from 'moment';
import { FormControl, FormBuilder } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';

import { LogParamsConfig  } from '../../interfaces/log-params';
import { Logs } from '../../interfaces/logs';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  
  currentActivetab = 0;

  logs:Logs = {
    rethinkdb: [],
    cratedb: []
  };
  config: LogParamsConfig = {
    rethinkdb : {
      skip : 0,
      limit : 100
    },
    cratedb : {
      skip: 0,
      limit: 100
    },
    increment : 100
  };


  filter = {
    info:true,
    error:true,
    search: null
  };

  mindate = new Date();
  maxdate = new Date();

  constructor(
    private http: RestService,
    private logsService: LogsService) {
      this.mindate = moment().subtract('days',1).toDate();

   }

  ngOnInit() {

    let params = {
      min:moment(this.mindate).toISOString(),
      max:moment(this.maxdate).toISOString(),
      limit: this.config.rethinkdb.limit,
      skip:this.config.rethinkdb.skip
    };

   this.getRethinkDBLogs(params);
   this.getCrateDBLogs(params);
  }

  getLogsBetweenDateRange() {
      this.config.rethinkdb.limit = this.config.increment;
      this.config.rethinkdb.skip = 0;
      this.config.cratedb.limit = this.config.increment;
      this.config.cratedb.skip = 0;
      this.logs.rethinkdb = [];
      this.logs.cratedb = [];

      this.ngOnInit();

  }

  onDateSelect(event) {
    console.log(event);
  }

  getMoreLogs() {
    if(this.currentActivetab == 0) {
      this.getMoreRethinkLogs()
    }
    else {
      this.getMoreCrateLogs();
    }
  }

  getMoreRethinkLogs() {

    this.config.rethinkdb.skip += this.config.increment
    this.config.rethinkdb.limit += this.config.increment;

    let params = {
      min:moment(this.mindate).toISOString(),
      max:moment(this.maxdate).toISOString(),
      limit: this.config.rethinkdb.limit,
      skip:this.config.rethinkdb.skip
    };

    this.getRethinkDBLogs(params);

  }

  getMoreCrateLogs() {

    this.config.cratedb.skip += this.config.increment
    this.config.cratedb.limit += this.config.increment;

    let params = {
      min:moment(this.mindate).toISOString(),
      max:moment(this.maxdate).toISOString(),
      limit: this.config.cratedb.limit,
      skip:this.config.cratedb.skip
    };

    this.getCrateDBLogs(params);
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
        console.log(this.logs.cratedb);
      },
      error => {

      }
    )

  }

  onTabChanged(event:MatTabChangeEvent) {
    console.log(event);
    this.currentActivetab = event.index;

  }

}
