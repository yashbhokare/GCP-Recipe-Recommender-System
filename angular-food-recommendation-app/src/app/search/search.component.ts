import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { StateService } from '../state.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

// Search Bar for the recipes
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  value = '';
  recipeNames = null;
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  constructor(
    private http: HttpClient,
    private router: Router,
    private stateService: StateService
  ) {}

  ngOnInit(): void {
    this.fetchRecipeNames();

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.recipeNames.filter(option => option.toLowerCase().includes(filterValue));
  }

  // Fetch all recipe names from node server
  fetchRecipeNames() {
    this.stateService.fethchAllRecipes().subscribe((recipeList) => {
      this.recipeNames = recipeList.map((recipe) => recipe.name);
      this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
      // console.log('Recipe Names:',this.recipeNames);
    });
  }

  searchRecipie() {
    this.stateService.fetchRecipeByName(this.myControl.value)
      .subscribe((data: any) => {
        this.stateService.recipeData = data;
        this.router.navigate(['/recipe-details']);
      });
  }
}
