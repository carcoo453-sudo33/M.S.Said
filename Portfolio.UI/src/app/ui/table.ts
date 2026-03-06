import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full overflow-auto">
      <table [class]="tableClasses">
        <ng-content></ng-content>
      </table>
    </div>
  `
})
export class TableComponent {
  @Input() className = '';

  get tableClasses(): string {
    return `w-full caption-bottom text-sm ${this.className}`;
  }
}

@Component({
  selector: 'ui-table-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <thead [class]="headerClasses">
      <ng-content></ng-content>
    </thead>
  `
})
export class TableHeaderComponent {
  @Input() className = '';

  get headerClasses(): string {
    return `[&_tr]:border-b ${this.className}`;
  }
}

@Component({
  selector: 'ui-table-body',
  standalone: true,
  imports: [CommonModule],
  template: `
    <tbody [class]="bodyClasses">
      <ng-content></ng-content>
    </tbody>
  `
})
export class TableBodyComponent {
  @Input() className = '';

  get bodyClasses(): string {
    return `[&_tr:last-child]:border-0 ${this.className}`;
  }
}

@Component({
  selector: 'ui-table-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <tfoot [class]="footerClasses">
      <ng-content></ng-content>
    </tfoot>
  `
})
export class TableFooterComponent {
  @Input() className = '';

  get footerClasses(): string {
    return `border-t bg-muted/50 font-medium [&>tr]:last:border-b-0 ${this.className}`;
  }
}

@Component({
  selector: 'ui-table-row',
  standalone: true,
  imports: [CommonModule],
  template: `
    <tr [class]="rowClasses">
      <ng-content></ng-content>
    </tr>
  `
})
export class TableRowComponent {
  @Input() className = '';
  @Input() selected = false;

  get rowClasses(): string {
    const selectedClass = this.selected ? 'bg-muted' : '';
    return `border-b transition-colors hover:bg-muted/50 ${selectedClass} ${this.className}`;
  }
}

@Component({
  selector: 'ui-table-head',
  standalone: true,
  imports: [CommonModule],
  template: `
    <th [class]="headClasses">
      <ng-content></ng-content>
    </th>
  `
})
export class TableHeadComponent {
  @Input() className = '';

  get headClasses(): string {
    return `h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${this.className}`;
  }
}

@Component({
  selector: 'ui-table-cell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <td [class]="cellClasses">
      <ng-content></ng-content>
    </td>
  `
})
export class TableCellComponent {
  @Input() className = '';

  get cellClasses(): string {
    return `p-4 align-middle [&:has([role=checkbox])]:pr-0 ${this.className}`;
  }
}

@Component({
  selector: 'ui-table-caption',
  standalone: true,
  imports: [CommonModule],
  template: `
    <caption [class]="captionClasses">
      <ng-content></ng-content>
    </caption>
  `
})
export class TableCaptionComponent {
  @Input() className = '';

  get captionClasses(): string {
    return `mt-4 text-sm text-muted-foreground ${this.className}`;
  }
}