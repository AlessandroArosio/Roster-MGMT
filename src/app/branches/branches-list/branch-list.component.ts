import {Component, OnDestroy, OnInit} from '@angular/core';
import {Branch} from '../branch.model';
import {Subscription} from 'rxjs';
import {BranchesService} from '../branches.service';

@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.css']
})
export class BranchListComponent implements OnInit, OnDestroy {

  branches: Branch[] = [];
  isLoading = false;
  private branchesSub: Subscription;

  constructor(public branchesService: BranchesService) {}

  ngOnInit() {
    this.isLoading = true;
    this.branchesService.getBranches();
    this.branchesSub = this.branchesService
      .getBranchUpdateListener()
      .subscribe((branches: Branch[]) => {
        this.isLoading = false;
        this.branches = branches;
      });
  }

  onDelete(branchId: string) {
    this.branchesService.deleteBranch(branchId);
  }

  ngOnDestroy() {
    this.branchesSub.unsubscribe();
  }
}
