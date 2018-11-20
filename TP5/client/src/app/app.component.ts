import { Component } from '@angular/core';

/**
 * Defines the main component of the application.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  // TODO: Modifier le nom des auteurs pour vos noms
  readonly authors = [
    'Antoine Béland',
    'Konstantinos Lambrou-Latreille'
  ];

  // TODO: À compléter
}
