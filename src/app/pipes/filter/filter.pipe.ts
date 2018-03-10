import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    
    console.log(args);
    let logs = value.filter(log => {
      if(args.info === true && args.error === true){
        return (log.level == "30" || log.level == "50");
      }
      else if(args.info === true) {
        console.log("came in errro");
        return log.level == "30";
      }
      else if(args.error === true) {
        return log.level == "50";
      }
    });

    if(args.search != null) {
      logs = logs.filter(log => {
        return (log.name+log.msg+log.time+log.hostname+log.publicHostname).search(args.search) >= 0;
      })
  
    }

    console.log(logs);
    return logs;
  }

}
