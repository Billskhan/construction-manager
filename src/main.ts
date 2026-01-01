import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { SQLiteService } from './app/core/services/sqlite.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    {
      provide: 'APP_INIT_DB',
      multi: true,
      useFactory: (db: SQLiteService) => () => db.init(),
      deps: [SQLiteService],
    },
  ],
});

