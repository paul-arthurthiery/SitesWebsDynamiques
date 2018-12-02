import { Component } from '@angular/core';

/**
 * Defines the main component of the application.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  readonly authors = [
    'Paul-Arthur Thiéry',
    'Louis-Efflam Le Vély'
  ];


}
