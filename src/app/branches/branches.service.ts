import {Branch} from './branch.model';
import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class BranchesService {
  private branches: Branch[] = [];
  private branchesUpdated = new Subject<Branch[]>();

  getBranches() {
    return [...this.branches];
  }

  getBranchUpdateListener() {
    return this.branchesUpdated.asObservable();
  }

  addBranch(name: string) {
    const branch: Branch = {name: name};
    this.branches.push(branch);
    this.branchesUpdated.next([...this.branches]);
  }

}
