import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './components/app/app.component';
import { LogsComponent } from './components/logs/logs.component';

const appRoutes: Routes = [
    { path: 'app', component: AppComponent },
    { path: 'logs',      component: LogsComponent },
    { path: '',
      redirectTo: '/logs',
      pathMatch: 'full'
    }
];