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
  isDarkMode = false;
  currentLang = 'es';

  ngOnInit() {
    this.initializeParallax();
  }

  initializeParallax() {
    document.querySelectorAll('a[data-scroll]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = (e.currentTarget as HTMLAnchorElement).getAttribute('href')?.substring(1);
        const targetElement = document.getElementById(targetId || '');
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme');
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === 'es' ? 'en' : 'es';
    // Aquí implementarías la lógica de cambio de idioma
  }
}