import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyFeature, ChangelogItem } from '../../../../models/project.model';
import { ProjectKeyFeaturesManagerComponent } from './project-key-features-manager';
import { ProjectResponsibilitiesManagerComponent } from './project-responsibilities-manager';
import { ProjectChangelogManagerComponent } from './project-changelog-manager';

// Type for responsibility items (supports both legacy string format and new object format)
type ResponsibilityItem = string | { text: string; text_Ar?: string };

@Component({
    selector: 'app-project-features-manager',
    standalone: true,
    imports: [
        CommonModule,
        ProjectKeyFeaturesManagerComponent,
        ProjectResponsibilitiesManagerComponent,
        ProjectChangelogManagerComponent
    ],
    template: `
        <div class="space-y-6">
            <!-- Key Features Management -->
            <app-project-key-features-manager
                [(keyFeatures)]="keyFeatures">
            </app-project-key-features-manager>

            <!-- Responsibilities Management -->
            <app-project-responsibilities-manager
                [(responsibilities)]="responsibilities">
            </app-project-responsibilities-manager>

            <!-- Changelog Management -->
            <app-project-changelog-manager
                [(changelog)]="changelog">
            </app-project-changelog-manager>
        </div>
    `
})
export class ProjectFeaturesManagerComponent {
    @Input() keyFeatures: KeyFeature[] = [];
    @Input() responsibilities: ResponsibilityItem[] = [];
    @Input() changelog: ChangelogItem[] = [];
    
    @Output() keyFeaturesChange = new EventEmitter<KeyFeature[]>();
    @Output() responsibilitiesChange = new EventEmitter<ResponsibilityItem[]>();
    @Output() changelogChange = new EventEmitter<ChangelogItem[]>();
}