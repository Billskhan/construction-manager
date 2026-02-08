import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { SQLiteService } from './app/core/services/sqlite.service';

async function startApp() {
  const sqlite = new SQLiteService();

  console.log('⏳ Initializing SQLite BEFORE Angular starts...');
  await sqlite.init();
  console.log('✅ SQLite ready. Bootstrapping Angular...');

  await bootstrapApplication(AppComponent, {
    providers: [
      provideRouter(routes),
      { provide: SQLiteService, useValue: sqlite }
    ]
  });
}

startApp();