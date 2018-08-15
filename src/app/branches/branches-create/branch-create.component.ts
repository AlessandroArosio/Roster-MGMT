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
  private mode = 'create';
  private branchId: string;

  constructor(public branchesService: BranchesService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('branchId')) {
        this.mode = 'edit';
        this.branchId = paramMap.get('branchId');
        this.branchesService.getBranch(this.branchId).subscribe(branchData => {
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
    } else {
      this.branchesService.updateBranch(
        this.branchId,
        form.value.branchName
      );
    }

    form.resetForm();
  }
}
