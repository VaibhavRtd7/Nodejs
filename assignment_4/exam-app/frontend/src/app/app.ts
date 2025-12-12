import { Component, signal } from '@angular/core';
import { Exam } from './exam/exam';

@Component({
  selector: 'app-root',
  imports: [Exam],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
