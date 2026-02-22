import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PortfolioService } from '../../services/portfolio.service';
import { BlogPost } from '../../models/portfolio.models';
import { NavbarComponent } from '../navbar/navbar';
import { LucideAngularModule, ArrowLeft, Share2 } from 'lucide-angular';

@Component({
    selector: 'app-blog-post',
    standalone: true,
    imports: [CommonModule, NavbarComponent, RouterLink, LucideAngularModule],
    templateUrl: './blog-post.html'
})
export class BlogPostComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private portfolio = inject(PortfolioService);
    post?: BlogPost;

    ArrowLeftIcon = ArrowLeft;
    Share2Icon = Share2;

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.portfolio.getBlogPost(id).subscribe(data => {
                this.post = data;
            });
        }
    }
}
