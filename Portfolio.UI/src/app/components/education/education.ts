import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { EducationEntry } from '../../models/portfolio.models';
import { NavbarComponent } from '../navbar/navbar';
import { LucideAngularModule, GraduationCap, MapPin } from 'lucide-angular';

@Component({
    selector: 'app-education',
    standalone: true,
    imports: [CommonModule, NavbarComponent, LucideAngularModule],
    templateUrl: './education.html'
})
export class EducationComponent implements OnInit {
    private portfolio = inject(PortfolioService);
    education: EducationEntry[] = [];

    GraduationCapIcon = GraduationCap;
    MapPinIcon = MapPin;

    ngOnInit() {
        this.portfolio.getEducation().subscribe(data => {
            this.education = data;
        });
    }
}
