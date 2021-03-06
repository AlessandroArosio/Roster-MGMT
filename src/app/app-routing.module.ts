import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ShiftListComponent} from './Shifts/shift-list/shift-list.component';
import {ShiftCreateComponent} from './Shifts/shift-create/shift-create.component';
import {UsersListComponent} from './users/users-list/users-list.component';
import {UsersCreateComponent} from './users/users-create/users-create.component';
import {BranchListComponent} from './branches/branches-list/branch-list.component';
import {BranchCreateComponent} from './branches/branches-create/branch-create.component';
import {RotaCreateComponent} from './rota/rota-create/rota-create.component';
import {RotaListComponent} from './rota/rota-list/rota-list.component';
import {LoginComponent} from './auth/login/login.component';
import {AuthGuard} from './auth/auth.guard';
import {RotaSwapComponent} from './rota/rota-swap/rota-swap.component';
import {MessageListComponent} from './messages/message-list/message-list.component';
import {MessageCreateComponent} from './messages/message-create/message-create.component';
import {RequestsComponent} from './requests/requests.component';
import {StatisticsComponent} from './statistics/statistics.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'shift-list', component: ShiftListComponent, canActivate: [AuthGuard] },
  { path: 'shift-create', component: ShiftCreateComponent, canActivate: [AuthGuard] },
  { path: 'shift-edit/:shiftId', component: ShiftCreateComponent, canActivate: [AuthGuard] },
  { path: 'user-list', component: UsersListComponent, canActivate: [AuthGuard] },
  { path: 'user-create', component: UsersCreateComponent, canActivate: [AuthGuard] },
  { path: 'user-edit/:userId', component: UsersCreateComponent, canActivate: [AuthGuard] },
  { path: 'branch-list', component: BranchListComponent, canActivate: [AuthGuard] },
  { path: 'branch-create', component: BranchCreateComponent, canActivate: [AuthGuard] },
  { path: 'branch-edit/:branchId', component: BranchCreateComponent, canActivate: [AuthGuard] },
  { path: 'rota-list', component: RotaListComponent, canActivate: [AuthGuard] },
  { path: 'rota-create', component: RotaCreateComponent, canActivate: [AuthGuard] },
  { path: 'rota-edit/:rotaId', component: RotaCreateComponent, canActivate: [AuthGuard] },
  { path: 'employee', component: BranchListComponent, canActivate: [AuthGuard] },
  { path: 'rotas-view', component: RotaListComponent, canActivate: [AuthGuard] },
  { path: 'swap/:rotaId', component: RotaSwapComponent, canActivate: [AuthGuard] },
  { path: 'homepage', component: MessageListComponent, canActivate: [AuthGuard] },
  { path: 'homepage/send-message', component: MessageCreateComponent, canActivate: [AuthGuard] },
  { path: 'requests', component: RequestsComponent, canActivate: [AuthGuard] },
  { path: 'stats', component: StatisticsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
