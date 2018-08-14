import {Component, OnDestroy, OnInit} from '@angular/core';
import {Branch} from '../branch.model';
import {Subscription} from 'rxjs';
import {BranchesService} from '../branches.service';

@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.css']
})
export class BranchListComponent implements OnInit, OnDestroy{

  branches: Branch[] = [];
  private branchesSub: Subscription;

  constructor(public branchesService: BranchesService) {}

  ngOnInit() {
    this.branchesService.getBranches();
    this.branchesSub = this.branchesService
      .getBranchUpdateListener()
      .subscribe((branches: Branch[]) => {
        this.branches = branches;
      });
  }

  ngOnDestroy() {
    this.branchesSub.unsubscribe();
  }
}
