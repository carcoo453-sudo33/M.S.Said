import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { TimelineComponent } from './components/timeline/timeline';
import { ProjectsComponent } from './components/projects/projects';
import { HomeComponent } from './components/home/home';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'timeline', component: TimelineComponent },
    { path: 'projects', component: ProjectsComponent },
    { path: '**', redirectTo: '' }
];
