import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';

import { colors } from './mock-data';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  recipeDetails = null;
  recipeList = null;
  calendarEventList: CalendarEvent[] = [];
  ingredientsList = [];
  imageName = '3-ingredient-caramel-apple-hand-pies.jpg';
  priceList = null;
  constructor(private http: HttpClient) {}

  set recipeData(data) {
    this.recipeDetails = data;
  }

  get recipeData() {
    return this.recipeDetails;
  }

  set imageData(data: string) {
    this.imageName = data;
  }

  get imageData() {
    return this.imageName;
  }

  getPriceList(){
    return this.priceList;
  }

  // Store specific ingredients
  storeIngredients(list) {
    this.ingredientsList = this.ingredientsList.concat(list);
    console.log('Selected Ingredients are:', this.ingredientsList);
    const body = {
      list: this.ingredientsList
    };
    this.http
      .post('https://backend-dot-food-recommendation-310001.uc.r.appspot.com/api/storeIngredients', body)
      .subscribe((res) => {
        console.log('Sheets Response status:', res);
      });
  }

  // Set the calendar events in google calendar
  setCalendarEvent(title: string, description: string, date: Date) {
    const event = {
      start: startOfDay(date), // 1 Jan 2011, 00:00:00), hours/minutes/seconds/ms
      title: title,
      color: colors.red,
      draggable: true,
    };
    this.calendarEventList.push(event);
    const body = {
      date: date,
      title: title,
      description: description,
    };

    this.http
      .post('https://backend-dot-food-recommendation-310001.uc.r.appspot.com/api/calendar', body)
      .subscribe((res) => {
        console.log('Calendar Response status:', res);
      });
  }

// Returns the selected calendar events to display on Calendar component 
  getCalendarEvents(): CalendarEvent[] {
    return this.calendarEventList;
  }


// List all recipes from the server and store it locally
  fethchAllRecipes(): Observable<any> {
    if (this.recipeList) {
      return of(this.recipeList);
    } else {
      return this.fethchRecipeListFromServer();
    }
  }

  // Fetch recipe name from node server which is hosted 
  fetchRecipeByName(recipeName): Observable<any> {
    return this.http.get('https://backend-dot-node-312122.wl.r.appspot.com/api/recipe/' + recipeName).pipe(
      map((data: any) => {
        console.log('Search Value of Recipe:', data);
        return data[0];
      })
    );
  }

  // Fetch recipe list from node server which is hosted 
  private fethchRecipeListFromServer(): Observable<any> {
    return this.http.get('https://backend-dot-node-312122.wl.r.appspot.com/api/recipeList').pipe(
      map((data) => {
        this.recipeList = data;
        console.log('fetchRecipeList data:', data);
        return data;
      })
    );
  }

  // Fetch recipe name from node server which is hosted 
  fetchRecipeSteps(data, index): Observable<any> {
    console.log('Fetch Recepie For:', data);
    const body = {
      step: data,
      index: index,
    };
    return this.http
      .post('https://backend-dot-food-recommendation-310001.uc.r.appspot.com/api/send_recipe_step', body)
      .pipe(
        map((data: any) => {
          console.log('Recipe Step status:', data);
          return data;
        })
      );
  }

  // Send commands
  sendAudioCommands(bufferData): Observable<any> {
    const body = { buffer: bufferData };
    return this.http.post('https://backend-dot-food-recommendation-310001.uc.r.appspot.com/api/upload_sound', body).pipe(
      mergeMap((data: any) => {
        console.log('Return Value', data);
        return of(data);
      })
    );
  }

  // Fetch Recepie Prices
  fetchIngredientsPrices(): Observable<any> {
    return this.http.get('https://backend-dot-food-recommendation-310001.uc.r.appspot.com/api/getIngredientsPrice').pipe(
      mergeMap((data: any) => {
        console.log('fetchIngredientsPrices', data);
        this.priceList = data;
        return of(data);
      })
    );
  }

}
