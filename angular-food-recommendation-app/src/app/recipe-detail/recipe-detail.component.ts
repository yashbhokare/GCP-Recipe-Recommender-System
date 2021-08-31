import { Component, OnInit, Input } from '@angular/core';
import { StateService } from '../state.service';
import { MatListOption } from '@angular/material/list';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';

declare var MediaRecorder: any;

// Display details page of any recipe
@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  @Input() image: string;
  @Input() recipeData: any;
  ingredientsList = null;
  ingredients = null;
  priceList = null;
  finalList = [] as any;
  dateSelected = new Date();
  steps = null;
  stepsLength = 0;
  currentStepIndex = 0;
  audioSource = null;
  currentCommand = 'stop';
  constructor(private stateService: StateService, private router: Router) {}
  ngOnInit(): void {
    this.priceList = this.stateService.getPriceList();
    this.fetchRecipeData();
  }

  // Fetch recipe data and clean it
  fetchRecipeData() {
    this.recipeData = this.stateService.recipeData;
    this.image = this.stateService.imageData;
    this.ingredientsList = this.recipeData.ingredients
      .replace(/['"]+/g, '')
      .replace(/[\[\]']+/g, '')
      .split(',');
    this.steps = this.recipeData.steps.split("'");
    for (var i = -1; i < this.steps.length; i++) {
      this.steps.splice(i + 1, 1);
    }
    this.stepsLength = this.steps.length;
    console.log('ingredientsList', this.steps, this.stepsLength);

    this.ingredientsList.forEach((value) => {
      if (this.priceList.ingredientsList.indexOf(value) != -1) {
        const index = this.priceList.ingredientsList.indexOf(value);
        const data = {
          title: this.priceList.title[index],
          price: this.priceList.priceList[index],
          ingredients: this.priceList.ingredientsList[index],
        };
        this.finalList.push(data);
      } else {
        const data = {
          title: '',
          price: 'Not in stock',
          ingredients: value,
        };
        this.finalList.push(data);
      }
    });
  }

  // Submit the ingredients
  submitIngredients(ingredients: MatListOption[]) {
    this.ingredients = ingredients.map((o) => o.value);
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log('Date Selected:', event.value);
    this.dateSelected = event.value;
  }

  // Submit all data
  submit() {
    this.stateService.setCalendarEvent(
      this.recipeData.name,
      this.recipeData.description,
      this.dateSelected
    );
    this.stateService.storeIngredients(this.ingredients);
    this.router.navigate(['/home']);
  }

  // Start the personal assistant
  startAssistant() {
    this.currentStepIndex = 0;
    this.textToSpeechRecepie();
  }

  // Converting the text to speech using backend calls
  textToSpeechRecepie() {
    // this.startRecording();
    if (this.currentStepIndex >= this.stepsLength) {
      return;
    }
    this.stateService
      .fetchRecipeSteps(
        this.steps[this.currentStepIndex],
        this.currentStepIndex
      )
      .subscribe((response) => {
        setTimeout(() => {
          this.playAudio();
        }, 1000);
      });
  }

  // Play the given audio
  playAudio() {
    let audio = new Audio(
      'https://storage.googleapis.com/download/storage/v1/b/audio-file-storage-123/o/Step' +
        this.currentStepIndex +
        '.mp3?alt=media'
    );
    audio.crossOrigin = 'anonymous';
    audio.load();
    audio.play();
    this.currentStepIndex = this.currentStepIndex + 1;
    const ref = this;
    audio.onloadedmetadata = function () {
      console.log('Total Audio time', audio.duration);

      setTimeout(() => {
        ref.startRecording();
        audio = null;
      }, Math.floor(audio.duration * 1000));
    };
  }

  // Start the voice recording 
  startRecording() {
    console.log('Start Recording');
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      let mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();

      const audioChunks = [];
      mediaRecorder.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        audioBlob.arrayBuffer().then((buffer) => {
          const uint8Array = new Uint8Array(buffer);
          const b64encoded = btoa(String.fromCharCode.apply(null, uint8Array));
          this.stateService.sendAudioCommands(b64encoded).subscribe((res) => {
            this.currentCommand = res;
            if (this.currentCommand == 'next') {
              this.textToSpeechRecepie();
            } else if (this.currentCommand == 'stop') {
              this.currentStepIndex = 0;
              return;
            } else if (this.currentCommand == 'previous') {
              if (this.currentStepIndex != 0 && this.currentStepIndex != 1) {
                this.currentStepIndex = this.currentStepIndex - 2;
              } else {
                this.currentStepIndex = 0;
              }

              this.textToSpeechRecepie();
            } else {
              setTimeout(() => {
                this.startRecording();
              }, 1000);
            }
          });
        });
      });

      setTimeout(() => {
        mediaRecorder.stop();
      }, 3000);
    });
  }
}
