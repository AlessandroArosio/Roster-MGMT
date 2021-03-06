import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {ShiftCreateComponent} from './Shifts/shift-create/shift-create.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
import {StatisticsComponent} from './statistics/statistics.component';
import {ErrorInterceptor} from './error-interceptor';
import {ErrorComponent} from './error/error.component';
import {AngularMaterialModule} from './angular-material.module';

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
    RequestsComponent,
    StatisticsComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AngularMaterialModule
  ],
  providers: [
      {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
      {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
    ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
