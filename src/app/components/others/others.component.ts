import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-others',
  imports: [],
  templateUrl: './others.component.html',
  styleUrl: './others.component.css',
  standalone: true,
})
export class OthersComponent implements OnInit {
  ngOnInit() {
    this.setupImageModal();
  }

  private setupImageModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage') as HTMLImageElement;
    const captionText = document.getElementById('imageCaption');
    const closeBtn = document.getElementsByClassName('close-modal')[0];

    // Añadir click listener a todas las imágenes de certificados
    const images = document.querySelectorAll('.certificate-box img');
    images.forEach(img => {
      img.addEventListener('click', function(this: HTMLImageElement) {
        modal!.style.display = "block";
        modalImg.src = this.src;
        if (captionText) {
          const caption = this.parentElement?.querySelector('.certificate-caption');
          captionText.innerHTML = caption?.textContent || '';
        }
      });
    });

    // Cerrar modal
    closeBtn?.addEventListener('click', () => {
      modal!.style.display = "none";
    });

    // Cerrar modal al hacer click fuera de la imagen
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }
}
