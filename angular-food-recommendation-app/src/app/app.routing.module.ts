
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { HomeComponent } from './home/home.component';
import { CalendarComponent } from './calendar/calendar.component';

@NgModule({
  // declarations: [RecipeDetailComponent],
  imports: [
    RouterModule.forRoot([
    //   { path: 'login', component: LoginViewComponent },
    //   { path: 'catalog', component: CatalogViewComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'recipe-details', component: RecipeDetailComponent },
      { path: 'calendar-events', component: CalendarComponent },
      { path: '**', redirectTo: 'home' },
    ]),
  ],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
