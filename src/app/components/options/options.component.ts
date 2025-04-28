import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-options-menu',
  imports: [CommonModule, TranslateModule],
  standalone: true,
  templateUrl: './options-menu.component.html',
  styleUrls: ['./options-menu.component.scss'],
})
export class OptionsMenuComponent implements OnInit {
  isMenuOpen = false;

  constructor(
    private themeService: ThemeService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    // Cargar preferencias guardadas
    this.loadSavedPreferences();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.isMenuOpen = false;
  }

  toggleLanguage(): void {
    const currentLang = this.translateService.currentLang;
    const newLang = currentLang === 'es' ? 'en' : 'es';
    this.translateService.use(newLang);
    localStorage.setItem('language', newLang);
    this.isMenuOpen = false;
  }

  loadSavedPreferences(): void {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      this.translateService.use(savedLang);
    }
  }

  // Cerrar el menú al hacer clic fuera de él
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = event
      .composedPath()
      .find(
        (element) =>
          element === document.querySelector('.corner-menu-container')
      );

    if (!clickedInside && this.isMenuOpen) {
      this.isMenuOpen = false;
    }
  }
}
