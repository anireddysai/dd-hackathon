import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSidenavModule,
    MatTabsModule,
    MatToolbarModule,
  } from '@angular/material';

@NgModule({
    exports: [
      MatButtonModule,
      MatCheckboxModule,
      MatIconModule,
      MatInputModule,
      MatListModule,
      MatSidenavModule,
      MatTabsModule,
      MatToolbarModule,
    ]
  })
  export class DDMaterialModule {}