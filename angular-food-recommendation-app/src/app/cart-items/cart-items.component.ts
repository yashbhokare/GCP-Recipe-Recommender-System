import { Component, OnInit, Input } from '@angular/core';
import { StateService } from '../state.service';


// Display ingredientsList
@Component({
  selector: 'app-cart-items',
  templateUrl: './cart-items.component.html',
  styleUrls: ['./cart-items.component.css'],
})
export class CartItemsComponent implements OnInit {
  @Input() ingredientsList;
  constructor(private stateService: StateService) {
  }

  ngOnInit(): void {
    this.ingredientsList = this.stateService.recipeData.ingredients;
    this.ingredientsList = this.ingredientsList.replace(/['"]+/g, '').replace(/[\[\]']+/g,'').split(',');
    console.log('ING',this.ingredientsList);
  }
}
