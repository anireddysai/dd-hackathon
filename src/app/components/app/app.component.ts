import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  filter = {
    info:true,
    error:true,
    search: null
  };

  
}

export interface Filter {
  info : boolean,
  error: boolean,
  search : string
}
