import { BrowserModule } from '@angular/platform-browser';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';

import {DDMaterialModule} from './material.module';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { AppComponent } from './components/app/app.component';
import { LogsComponent } from './components/logs/logs.component';

import { RouterModule, Routes } from '@angular/router';

import { RestService } from './injectables/rest/rest.service'
import { LogsService } from './injectables/logs/logs.service';
import { WebsocketService } from './injectables/websocket/websocket.service';
import { FilterPipe } from './pipes/filter/filter.pipe';
import { LiveComponent } from './components/live/live.component';

const routes: Routes = [
  { path: 'app', component: AppComponent },
  { path: 'history/logs',component: LogsComponent },
  { path: 'live/logs',component: LiveComponent },
  { path: '',
    redirectTo: '/live/logs',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LogsComponent,
    FilterPipe,
    LiveComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DDMaterialModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    RouterModule.forRoot(
      routes,
      {useHash: true}
    ),
    HttpClientModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule
  ],
  exports:[
    
  ],
  providers: [
    RestService,
    LogsService,
    WebsocketService
  ],
  schemas: [ 
    CUSTOM_ELEMENTS_SCHEMA
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
