import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { TimelineComponent } from './components/timeline/timeline';
import { ProjectsComponent } from './components/projects/projects';
import { ProjectDetailsComponent } from './components/project-details/project-details';
import { HomeComponent } from './components/home/home';
import { EducationComponent } from './components/education/education';
import { BlogComponent } from './components/blog/blog';
import { ContactComponent } from './components/contact/contact';
import { NotFoundComponent } from './components/not-found/not-found';

export const routes: Routes = [
    { path: '', component: HomeComponent, title: 'Mostafa.Dev | Strategic Engineering' },
    { path: 'login', component: LoginComponent, title: 'System Access' },
    { path: 'timeline', component: TimelineComponent, title: 'Resume | Professional Timeline' },
    { path: 'projects', component: ProjectsComponent, title: 'Projects | Manifesto' },
    { path: 'projects/:slug', component: ProjectDetailsComponent, title: 'Project Details' },
    { path: 'education', component: EducationComponent, title: 'Education | Technical Specialization' },
    { path: 'blog', component: BlogComponent, title: 'Social Feed | Digital Insights' },
    { path: 'contact', component: ContactComponent, title: 'Connection | Get in Touch' },
    { path: '404', component: NotFoundComponent, title: 'Space Not Found' },
    { path: '**', component: NotFoundComponent, title: 'Space Not Found' },
];
