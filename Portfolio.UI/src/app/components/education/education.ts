import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { EducationEntry } from '../../models/portfolio.models';
import { NavbarComponent } from '../navbar/navbar';
import { LucideAngularModule, GraduationCap, MapPin, AlertCircle } from 'lucide-angular';

@Component({
    selector: 'app-education',
    standalone: true,
    imports: [CommonModule, NavbarComponent, LucideAngularModule],
    templateUrl: './education.html'
})
export class EducationComponent implements OnInit {
    private portfolio = inject(PortfolioService);
    education: EducationEntry[] = [];
    isLoading = true;
    hasError = false;

    GraduationCapIcon = GraduationCap;
    MapPinIcon = MapPin;
    AlertCircleIcon = AlertCircle;

    ngOnInit() {
        this.portfolio.getEducation().subscribe({
            next: (data) => {
                this.education = data;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
                this.hasError = true;
            }
        });
    }

    get skeletonItems() { return Array(3); }
}
