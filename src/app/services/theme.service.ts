import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkMode = true;
  private darkModeSubject = new BehaviorSubject<boolean>(true);

  darkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    // Cargar tema guardado
    this.loadSavedTheme();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.darkModeSubject.next(this.isDarkMode);

    if (this.isDarkMode) {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
    }

    // Guardar preferencia
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  private loadSavedTheme(): void {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') {
      this.isDarkMode = false;
      document.body.classList.add('light-mode');
      this.darkModeSubject.next(false);
    } else {
      document.body.classList.add('dark-mode');
    }
  }
}
