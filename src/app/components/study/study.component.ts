import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-study',
  imports: [],
  standalone: true,
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.css']
})
export class StudyComponent implements OnInit {
  ngOnInit() {
    this.setupPdfModal();
  }

  private setupPdfModal() {
    const modal = document.getElementById('pdfModal');
    const modalImg = document.getElementById('modalImg') as HTMLImageElement;
    const modalOverlay = document.querySelector('.modal-overlay');

    if (!modal || !modalImg || !modalOverlay) {
        console.error('No se encontraron los elementos del modal');
        return;
    }

    document.querySelectorAll('.certificate-trigger').forEach(link => {
        link.addEventListener('click', (e: Event) => {
            e.preventDefault();
            const target = e.target as HTMLElement;
            const imgPath = target.getAttribute('data-img');
            
            if (imgPath) {
                modal.style.display = 'block';
                modalImg.src = imgPath;
            }
        });
    });

    // Cerrar haciendo click fuera de la imagen
    modalOverlay.addEventListener('click', (e: Event) => {
        if (e.target === modalOverlay) {
            modal.style.display = 'none';
            modalImg.src = '';
        }
    });

    // Agregar manejador de tecla Escape
    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            modalImg.src = '';
        }
    });
  }
}