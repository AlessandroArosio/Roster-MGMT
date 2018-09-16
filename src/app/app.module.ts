import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {ShiftCreateComponent} from './Shifts/shift-create/shift-create.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule, MatCheckboxModule, MatDatepickerModule,
  MatExpansionModule,
  MatInputModule,
  MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatProgressSpinnerModule, MatSelectModule, MatSnackBarModule,
  MatTableModule, MatTabsModule,
  MatToolbarModule
} from '@angular/material';
import {HeaderComponent} from './header/header.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ShiftListComponent} from './Shifts/shift-list/shift-list.component';
import {UsersCreateComponent} from './users/users-create/users-create.component';
import {UsersListComponent} from './users/users-list/users-list.component';
import {BranchCreateComponent} from './branches/branches-create/branch-create.component';
import {BranchListComponent} from './branches/branches-list/branch-list.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {RotaCreateComponent} from './rota/rota-create/rota-create.component';
import {RotaListComponent} from './rota/rota-list/rota-list.component';
import {LoginComponent} from './auth/login/login.component';
import {AuthInterceptor} from './auth/auth-interceptor';
import {RotaSwapComponent} from './rota/rota-swap/rota-swap.component';
import {MessageCreateComponent} from './messages/message-create/message-create.component';
import {MessageListComponent} from './messages/message-list/message-list.component';
import {RequestsComponent} from './requests/requests.component';

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
    RotaListComponent,
    RotaSwapComponent,
    LoginComponent,
    MessageCreateComponent,
    MessageListComponent,
    RequestsComponent
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
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
      {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
