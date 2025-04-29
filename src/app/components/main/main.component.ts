import { Component } from '@angular/core';
import { IntroComponent } from '../intro/intro.component';
import { ExperienceComponent } from '../experience/experience.component';
import { ProjectsComponent } from '../projects/projects.component';
import { AboutComponent } from '../about/about.component';
import { OthersComponent } from '../others/others.component';
import { StudyComponent } from '../study/study.component';
import { ContactComponent } from '../contact/contact.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-main',
  imports: [
    IntroComponent,
    AboutComponent,
    ExperienceComponent,
    ProjectsComponent,
    OthersComponent,
    StudyComponent,
    ContactComponent,
    HeaderComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {}
