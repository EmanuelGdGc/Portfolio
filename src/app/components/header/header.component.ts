import { Component, OnInit } from '@angular/core';
import SimpleParallax from 'simple-parallax-js';

@Component({
  selector: 'app-header',
  imports: [], // Aquí puedes importar otros módulos si es necesario
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isDarkMode = true;
  currentLang = 'es';

  ngOnInit() {
    // Establece el tema oscuro por defecto
    document.body.classList.add('dark-theme');
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme');
    document.body.classList.toggle('light-theme');
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === 'es' ? 'en' : 'es';
    // Aquí implementarías la lógica de cambio de idioma
  }
}