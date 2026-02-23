import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Home, ArrowLeft } from 'lucide-angular';

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [RouterLink, LucideAngularModule],
    templateUrl: './not-found.html',
})
export class NotFoundComponent {
    HomeIcon = Home;
    ArrowLeftIcon = ArrowLeft;
}
