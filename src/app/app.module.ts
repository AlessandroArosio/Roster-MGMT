import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {ShiftCreateComponent} from './Shifts/shift-create/shift-create.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatExpansionModule,
  MatInputModule,
  MatMenuModule, MatProgressSpinnerModule,
  MatTableModule,
  MatToolbarModule
} from '@angular/material';
import {HeaderComponent} from './header/header.component';
import {FormsModule} from '@angular/forms';
import {ShiftListComponent} from './Shifts/shift-list/shift-list.component';
import {UsersCreateComponent} from './users/users-create/users-create.component';
import {UsersListComponent} from './users/users-list/users-list.component';
import {BranchCreateComponent} from './branches/branches-create/branch-create.component';
import {BranchListComponent} from './branches/branches-list/branch-list.component';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {RotaCreateComponent} from './rota/rota-create/rota-create.component';
import {RotaListComponent} from './rota/rota-list/rota-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ShiftCreateComponent,
    ShiftListComponent,
    UsersCreateComponent,
    UsersListComponent,
    BranchCreateComponent,
    BranchListComponent,
    RotaCreateComponent,
    RotaListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatTableModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
