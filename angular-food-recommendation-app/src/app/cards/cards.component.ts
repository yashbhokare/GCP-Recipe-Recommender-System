import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from '../state.service';

// Display Recipe name and image in card format
@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css'],
})
export class CardsComponent implements OnInit {
  @Input() image: string;
  @Input() recipeData: any;
  displayCart = false;
  constructor(private router: Router, private stateService: StateService) {}

  ngOnInit(): void {}

  onImageSelect(imageName) {
    this.stateService.recipeData = this.recipeData;
    this.stateService.imageData = this.image;
    this.router.navigate(['/recipe-details']);
  }
}
