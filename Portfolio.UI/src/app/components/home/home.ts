import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { BioEntry, ServiceEntry, ProjectEntry, ExperienceEntry } from '../../models/portfolio.models';
import { NavbarComponent } from '../navbar/navbar';
import { RouterLink } from '@angular/router';
import {
    LucideAngularModule,
    Mail,
    Phone,
    MapPin,
    Linkedin,
    Github,
    Twitter,
    MessageCircle,
    Download,
    Code2,
    Zap,
    ArrowRight,
    FileCode,
    Database,
    Monitor,
    Terminal
} from 'lucide-angular';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        NavbarComponent,
        RouterLink,
        LucideAngularModule
    ],
    templateUrl: './home.html'
})
export class HomeComponent implements OnInit {
    private portfolio = inject(PortfolioService);
    bio?: BioEntry;
    services: ServiceEntry[] = [];
    featuredProjects: ProjectEntry[] = [];
    experiences: ExperienceEntry[] = [];

    // Icons
    MailIcon = Mail;
    PhoneIcon = Phone;
    MapPinIcon = MapPin;
    LinkedinIcon = Linkedin;
    GithubIcon = Github;
    TwitterIcon = Twitter;
    MessageCircleIcon = MessageCircle;
    DownloadIcon = Download;
    Code2Icon = Code2;
    ZapIcon = Zap;
    ArrowRightIcon = ArrowRight;
    FileCodeIcon = FileCode;
    DatabaseIcon = Database;
    MonitorIcon = Monitor;
    TerminalIcon = Terminal;

    // Icons mapping for dynamic icons from backend
    getServiceIcon(iconName: string): any {
        const icons: { [key: string]: any } = {
            'code': Code2,
            'code-2': Code2,
            'zap': Zap,
            'monitor': Monitor,
            'database': Database,
            'terminal': Terminal,
            'file-code': FileCode,
            'mail': Mail,
            'phone': Phone,
            'map-pin': MapPin,
            'layout': Monitor,
            'smartphone': Monitor
        };

        // Remove 'lucide-' prefix if present
        const cleanName = iconName?.replace('lucide-', '')?.toLowerCase();
        return icons[cleanName] || Code2; // Default to Code2 if not found
    }

    ngOnInit() {
        this.portfolio.getBio().subscribe(data => this.bio = data);
        this.portfolio.getServices().subscribe(data => this.services = data);
        this.portfolio.getExperiences().subscribe(data => {
            this.experiences = data.slice(0, 2); // Show latest 2
        });
        this.portfolio.getProjects().subscribe(data => {
            this.featuredProjects = data.slice(0, 2);
        });
    }
}
