import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { NgModule } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatListModule} from '@angular/material/list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';






@NgModule({
    imports:    [MatButtonModule, MatCheckboxModule, MatSidenavModule, MatToolbarModule, 
                MatIconModule, MatGridListModule, MatListModule,MatFormFieldModule,
                MatSelectModule, MatInputModule, MatCardModule, MatProgressSpinnerModule,
                MatTableModule, MatPaginatorModule],
    exports:    [MatButtonModule, MatCheckboxModule, MatSidenavModule, MatToolbarModule, 
                MatIconModule, MatGridListModule, MatListModule, MatFormFieldModule,
                MatSelectModule, MatInputModule, MatCardModule, MatProgressSpinnerModule,
                MatTableModule, MatPaginatorModule],
})

export class MaterialModule{}