import { BrowserModule } from '@angular/platform-browser';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list'
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTabsModule} from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { AppComponent } from './components/app/app.component';
import { LogsComponent } from './components/logs/logs.component';

import { RouterModule, Routes } from '@angular/router';

import { RestService } from './injectables/rest.service'
import { LogsService } from './injectables/logs/logs.service';
import { WebsocketService } from './injectables/websocket/websocket.service';
import { FilterPipe } from './pipes/filter/filter.pipe';

const routes: Routes = [
  { path: 'app', component: AppComponent },
  { path: 'logs',      component: LogsComponent },
  { path: '',
    redirectTo: '/logs',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LogsComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatTabsModule,
    MatCheckboxModule,
    MatInputModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    RouterModule.forRoot(
      routes
    ),
    HttpClientModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule
  ],
  exports:[
    MatSidenavModule
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
