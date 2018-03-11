import { Component, OnInit } from '@angular/core';
import { LogsService } from '../../injectables/logs/logs.service';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit {

  logs = {
    rethinkdb: [],
    cratedb: []
  };

  filter = {
    info:true,
    error:true,
    search: null
  };

  
  constructor(
    private logsService: LogsService
  ) {
    this.logsService.connect()
    this.logsService.onNewMessage().subscribe(res=> {
      this.updateLiveData(res);
    })

   }

   updateLiveData(log) {
    console.log(log);  
    if(log.db == "rethinkdb") {
      this.logs.rethinkdb = this.logs.rethinkdb.concat(log.log);
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    console.log("Page destroyed");
    this.logsService.close();
  }

}
