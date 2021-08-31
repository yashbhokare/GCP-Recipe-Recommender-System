import { Component, OnInit } from '@angular/core';
import { imageList } from '../mock-data';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { StateService } from '../state.service';

// Display home page of the app
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  images: string[];
  recipeList;
  constructor(private stateService: StateService, private router: Router) {}

  ngOnInit(): void {
    this.init();
    this.images = imageList;
  }

  init() {
    this.fetchRecipeList();
  }

  fetchRecipeList() {
    this.stateService.fethchAllRecipes().subscribe((data: any) => {
      this.recipeList = data;
    });
  }

  showCalendar() {
    this.router.navigate(['/calendar-events']);
  }

  fetchPrices() {
    this.stateService.fetchIngredientsPrices().subscribe((data: any) => {});
  }


}
