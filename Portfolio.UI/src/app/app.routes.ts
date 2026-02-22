import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { TimelineComponent } from './components/timeline/timeline';
import { ProjectsComponent } from './components/projects/projects';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'timeline', component: TimelineComponent },
    { path: 'projects', component: ProjectsComponent },
    { path: '', redirectTo: '/timeline', pathMatch: 'full' }
];
