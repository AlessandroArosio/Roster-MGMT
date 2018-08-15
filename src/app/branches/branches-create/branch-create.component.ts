import {Component, OnInit} from '@angular/core';
import {BranchesService} from '../branches.service';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Branch} from '../branch.model';

@Component({
  selector: 'app-branch-create',
  templateUrl: './branch-create.component.html',
  styleUrls: ['./branch-create.component.css']
})
export class BranchCreateComponent implements OnInit {
  branch: Branch;
  isLoading = false;
  message: string;
  private mode = 'create';
  private branchId: string;

  constructor(public branchesService: BranchesService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('branchId')) {
        this.mode = 'edit';
        this.branchId = paramMap.get('branchId');
        this.isLoading = true;
        this.branchesService.getBranch(this.branchId).subscribe(branchData => {
          this.isLoading = false;
          this.branch = {
            id: branchData._id,
            branchName: branchData.branchName
          };
        });
      } else {
        this.mode = 'create';
        this.branchId = null;
      }
    });
  }

  onSaveBranch(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.branchesService.addBranch(
        form.value.branchName
      );
      this.message = 'Branch "' + form.value.branchName + '" has been added';
    } else {
      this.branchesService.updateBranch(
        this.branchId,
        form.value.branchName
      );
      this.message = 'Branch "' + form.value.branchName + '" has been updated';
    }
    form.resetForm();
  }
}
