import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { ProjectsComponent } from './components/projects/projects';
import { ProjectsListComponent } from './components/projects-list/projects-list';
import { ProjectDetailsComponent } from './components/project-details/project-details';
import { HomeComponent } from './components/home/home';
import { EducationComponent } from './components/education/education';
import { BlogComponent } from './components/blog/blog';
import { ContactComponent } from './components/contact/contact';
import { NotFoundComponent } from './components/not-found/not-found';

import { EducationCategoryList } from './components/education-category-list/education-category-list';

export const routes: Routes = [
    { path: '', component: HomeComponent, title: 'Mostafa.Dev | Strategic Engineering' },
    { path: 'login', component: LoginComponent, title: 'System Access' },
    { path: 'projects', component: ProjectsComponent, title: 'Projects | Manifesto' },
    { path: 'projects/all', component: ProjectsListComponent, title: 'All Projects | Complete Portfolio' }, // Must come before :slug
    { path: 'projects/:slug', component: ProjectDetailsComponent, title: 'Project Details' },
    { path: 'education', component: EducationComponent, title: 'Education | Technical Specialization' },
    { path: 'education/:category', component: EducationCategoryList, title: 'Category Details' },
    { path: 'blog', component: BlogComponent, title: 'Social Feed | Digital Insights' },
    { path: 'contact', component: ContactComponent, title: 'Connection | Get in Touch' },
    { path: '404', component: NotFoundComponent, title: 'Space Not Found' },
    { path: '**', component: NotFoundComponent, title: 'Space Not Found' },
];
