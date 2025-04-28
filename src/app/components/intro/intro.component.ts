import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import * as THREE from 'three';
declare var particlesJS: any;

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css'],
  standalone: true,
})
export class IntroComponent implements AfterViewInit, OnDestroy {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private stars: THREE.Points[] = [];
  private animationFrameId: number | null = null;
  private zoomActive = false;
  private initialCameraPosition = new THREE.Vector3(0, 0, 30);
  private targetCameraPosition = new THREE.Vector3(0, 0, -3000);
  private animationStartTime = 0;
  private totalAnimationDuration = 20000; // 20 segundos para toda la animación
  private starTexture!: THREE.Texture; // Textura para las partículas circulares

  constructor() {
    // Bloquear el scroll al iniciar
    document.body.style.overflow = 'hidden';
  }

  ngAfterViewInit(): void {
    this.initThreeJS();
    this.createStars();
    this.initAnimationSequence();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // Limpiar recursos de Three.js
    this.stars.forEach((points) => {
      if (points.geometry) points.geometry.dispose();
      if (points.material) {
        if (Array.isArray(points.material)) {
          points.material.forEach((material) => material.dispose());
        } else {
          points.material.dispose();
        }
      }
    });

    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.starTexture) {
      this.starTexture.dispose();
    }

    // Asegurar que el scroll esté habilitado si el componente se destruye
    document.body.style.overflow = 'auto';
  }

  private initThreeJS(): void {
    const canvas = document.getElementById('space-canvas') as HTMLCanvasElement;

    // Crear escena
    this.scene = new THREE.Scene();

    // Crear cámara
    this.camera = new THREE.PerspectiveCamera(
      75, // FOV
      window.innerWidth / window.innerHeight, // Aspect ratio
      0.1, // Near clipping plane
      10000 // Far clipping plane
    );
    this.camera.position.copy(this.initialCameraPosition);

    // Crear renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Cargar textura para partículas circulares
    const textureLoader = new THREE.TextureLoader();
    this.starTexture = textureLoader.load('assets/images/Particula.png');

    // Manejar redimensionamiento de ventana
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Iniciar bucle de animación
    this.animate();
  }

  private createStars(): void {
    // Crear múltiples capas de estrellas a diferentes distancias
    this.createStarLayer(5000, 1000, 0xffffff);
    this.createStarLayer(3000, 2000, 0xaaaaaa);
    this.createStarLayer(2000, 3000, 0x888888);

    // Crear nebulosas de colores
    this.createNebula(500, 2000, 0x9966ff); // Púrpura
    this.createNebula(300, 2500, 0x66aaff); // Azul
    this.createNebula(400, 3000, 0xff6666); // Rojo
  }

  private createStarLayer(count: number, radius: number, color: number): void {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count * 3; i += 3) {
      // Distribución esférica
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = radius * Math.random();

      positions[i] = r * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = r * Math.cos(phi);

      sizes[i / 3] = Math.random() * 2 + 0.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      color: color,
      size: 2,
      map: this.starTexture, // Usar la textura circular para las estrellas
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const stars = new THREE.Points(geometry, material);
    this.scene.add(stars);
    this.stars.push(stars);
  }

  private createNebula(count: number, radius: number, color: number): void {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    // Crear cluster de puntos en una región específica del espacio
    const clusterCenter = new THREE.Vector3(
      (Math.random() - 0.5) * radius * 0.5,
      (Math.random() - 0.5) * radius * 0.5,
      (Math.random() - 0.5) * radius * 0.5
    );

    const clusterRadius = radius * 0.4;

    for (let i = 0; i < count * 3; i += 3) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = clusterRadius * Math.pow(Math.random(), 0.3); // Concentrar puntos hacia el centro

      positions[i] = clusterCenter.x + r * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = clusterCenter.y + r * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = clusterCenter.z + r * Math.cos(phi);

      // Hacer que las partículas de nebulosa sean más grandes
      sizes[i / 3] = Math.random() * 10 + 5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      color: color,
      size: 5,
      map: this.starTexture, // Usar la textura circular para las nebulosas
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const nebula = new THREE.Points(geometry, material);
    this.scene.add(nebula);
    this.stars.push(nebula);
  }

  private animate(): void {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    // Rotación lenta de estrellas para dar efecto de movimiento
    this.stars.forEach((star, index) => {
      const speed = 0.0003 * ((index % 3) + 1);
      star.rotation.y += speed;
      star.rotation.x += speed * 0.5;
    });

    // Animación de zoom cuando está activa
    if (this.zoomActive) {
      const elapsedTime = Date.now() - this.animationStartTime;
      const progress = Math.min(elapsedTime / this.totalAnimationDuration, 1);

      // Función de easing para suavizar el movimiento
      const easedProgress = this.easeInOutQuart(progress);

      // Interpolar la posición de la cámara
      this.camera.position.lerpVectors(
        this.initialCameraPosition,
        this.targetCameraPosition,
        easedProgress
      );

      // Ajustar la intensidad del efecto de partículas según el progreso
      const particlesElement = document.getElementById('particles-js');
      if (particlesElement && progress > 0.1) {
        // Aparecer más rápido (0.1 en vez de 0.2)
        particlesElement.style.opacity = ((progress - 0.1) / 0.4).toString(); // Transición más rápida
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  private easeInOutQuart(t: number): number {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
  }

  private initAnimationSequence(): void {
    // Referencia a los elementos
    const whiteOverlay = document.querySelector(
      '.white-overlay'
    ) as HTMLElement;
    const textHello = document.getElementById('text-hello') as HTMLElement;
    const textName = document.getElementById('text-name') as HTMLElement;
    const textWelcome = document.getElementById('text-welcome') as HTMLElement;

    // Asegurar que el fondo empiece en blanco y los textos ocultos
    textName.style.opacity = '0';
    textWelcome.style.opacity = '0';

    // Iniciar secuencia después de un breve retraso
    setTimeout(() => {
      // Mostrar "Hola" en negro sobre fondo blanco
      textHello.classList.add('fade-in');

      // Después de 2 segundos, comenzar la transición al espacio
      setTimeout(() => {
        whiteOverlay.classList.add('fade-out');

        // Comenzar el zoom después de que se desvanezca el blanco
        setTimeout(() => {
          this.zoomActive = true;
          this.animationStartTime = Date.now();

          // Inicializar particles.js para efectos adicionales - antes para que aparezcan más rápido
          this.initParticles();

          // Ocultar "Hola" gradualmente
          setTimeout(() => {
            textHello.classList.remove('fade-in');
            textHello.classList.add('fade-out');

            // Mostrar "Soy Emanuel Gómez Díaz"
            setTimeout(() => {
              textName.classList.add('fade-in');

              // Después de un tiempo, cambiar al siguiente texto
              setTimeout(() => {
                textName.classList.remove('fade-in');
                textName.classList.add('fade-out');

                // Mostrar "Bienvenido a mi portafolio"
                setTimeout(() => {
                  textWelcome.classList.add('fade-in');

                  // Después de 5 segundos de mostrar el mensaje de bienvenida, habilitar el scroll
                  setTimeout(() => {
                    this.enableScrolling();
                  }, 0);
                }, 1000);
              }, 4000);
            }, 1000);
          }, 3000);
        }, 1000);
      }, 2000);
    }, 500);
  }

  // Nuevo método para habilitar el scroll y permitir al usuario navegar por la página
  private enableScrolling(): void {
    document.body.style.overflow = 'auto';

    // Crear un indicador de scroll
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    scrollIndicator.innerHTML = `
      <div class="scroll-arrow">
        <span>↓</span>
      </div>
      <div class="scroll-text">Scroll para explorar</div>
    `;

    // Mostrar el indicador con una animación
    setTimeout(() => {
      scrollIndicator.classList.add('visible');
    }, 300);
  }

  private initParticles(): void {
    particlesJS('particles-js', this.getParticlesConfig());
  }

  private getParticlesConfig(): any {
    return {
      particles: {
        number: {
          value: 300, // Aumentado el número de partículas
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: [
            '#ff3333',
            '#3333ff',
            '#33ff33',
            '#ffff33',
            '#ff33ff',
            '#33ffff',
          ],
        },
        shape: {
          type: 'circle',
          stroke: {
            width: 0,
            color: '#000000',
          },
        },
        opacity: {
          value: 0.6,
          random: true,
          anim: {
            enable: true,
            speed: 2, // Velocidad aumentada
            opacity_min: 0.1,
            sync: false,
          },
        },
        size: {
          value: 4, // Tamaño aumentado
          random: true,
          anim: {
            enable: true,
            speed: 3, // Velocidad aumentada
            size_min: 0.1,
            sync: false,
          },
        },
        line_linked: {
          enable: false,
        },
        move: {
          enable: true,
          speed: 2, // Velocidad aumentada
          direction: 'none',
          random: true,
          straight: false,
          out_mode: 'out',
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: {
            enable: true,
            mode: 'bubble',
          },
          onclick: {
            enable: true,
            mode: 'repulse',
          },
          resize: true,
        },
        modes: {
          bubble: {
            distance: 150,
            size: 6,
            duration: 2,
            opacity: 0.8,
            speed: 3,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
        },
      },
      retina_detect: true,
    };
  }
}
