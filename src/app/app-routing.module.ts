import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ShiftListComponent} from './Shifts/shift-list/shift-list.component';
import {ShiftCreateComponent} from './Shifts/shift-create/shift-create.component';
import {UsersListComponent} from './users/users-list/users-list.component';
import {UsersCreateComponent} from './users/users-create/users-create.component';
import {BranchListComponent} from './branches/branches-list/branch-list.component';
import {BranchCreateComponent} from './branches/branches-create/branch-create.component';

const routes: Routes = [
  { path: '', component: ShiftListComponent },   // to be changed to shift-list and replace '' for login screen
  { path: 'shift-list', component: ShiftListComponent },
  { path: 'shift-create', component: ShiftCreateComponent },
  { path: 'user-list', component: UsersListComponent },
  { path: 'user-create', component: UsersCreateComponent },
  { path: 'branch-list', component: BranchListComponent },
  { path: 'branch-create', component: BranchCreateComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
