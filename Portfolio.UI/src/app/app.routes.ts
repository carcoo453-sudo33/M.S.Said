import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { TimelineComponent } from './components/timeline/timeline';
import { ProjectsComponent } from './components/projects/projects';
import { ProjectDetailsComponent } from './components/projects/project-details';
import { HomeComponent } from './components/home/home';
import { EducationComponent } from './components/education/education';
import { BlogComponent } from './components/blog/blog';
import { BlogPostComponent } from './components/blog-post/blog-post';
import { ContactComponent } from './components/contact/contact';
import { NotFoundComponent } from './components/not-found/not-found';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'timeline', component: TimelineComponent },
    { path: 'projects', component: ProjectsComponent },
    { path: 'projects/:slug', component: ProjectDetailsComponent, title: 'Project Details' },
    { path: 'education', component: EducationComponent },
    { path: 'blog', component: BlogComponent },
    { path: 'blog/:id', component: BlogPostComponent },
    { path: 'contact', component: ContactComponent },
    { path: '404', component: NotFoundComponent },
    { path: '**', component: NotFoundComponent },
];
