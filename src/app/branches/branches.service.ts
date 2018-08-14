import {Branch} from './branch.model';
import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable({providedIn: 'root'})
export class BranchesService {
  private branches: Branch[] = [];
  private branchesUpdated = new Subject<Branch[]>();

  constructor(private http: HttpClient) {}

  getBranches() {
    this.http.get<{message: string, branches: Branch[]}>('http://localhost:3000/api/branches')
      .subscribe((shiftData) => {
        this.branches = shiftData.branches;
        this.branchesUpdated.next([...this.branches]);
      });
  }

  getBranchUpdateListener() {
    return this.branchesUpdated.asObservable();
  }

  addBranch(name: string) {
    const branch: Branch = {id: null, branchName: name};
    this.branches.push(branch);
    this.branchesUpdated.next([...this.branches]);
  }

}
