import {Branch} from './branch.model';
import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {hostReportError} from 'rxjs/internal-compatibility';
import {Shift} from '../Shifts/shift.model';


@Injectable({providedIn: 'root'})
export class BranchesService {
  private branches: Branch[] = [];
  private branchesUpdated = new Subject<Branch[]>();

  constructor(private http: HttpClient) {}

  getBranches() {
    this.http
      .get<{message: string, branches: any}>('http://localhost:3000/api/branches')
      .pipe(map((branchData) => {
        return branchData.branches.map(branches => {
          return {
            branchName: branches.branchName,
            id: branches._id
          };
        });
      }))
      .subscribe((transformedBranch) => {
        this.branches = transformedBranch;
        this.branchesUpdated.next([...this.branches]);
      });
  }

  getBranch(id: string) {
    return this.http.get<{ _id: string, branchName: string }>(
      'http://localhost:3000/api/branches/' + id);
  }

  getBranchUpdateListener() {
    return this.branchesUpdated.asObservable();
  }

  addBranch(name: string) {
    const branch: Branch = {
      id: null,
      branchName: name};
    this.http.post<{message: string, branchId: string}>('http://localhost:3000/api/branches', branch)
      .subscribe((responseData) => {
        const id = responseData.branchId;
        branch.id = id;
        this.branches.push(branch);
        this.branchesUpdated.next([...this.branches]);
      });
  }

  updateBranch(id: string, name: string) {
    const branch: Branch = { id: id, branchName: name };
    this.http.put('http://localhost:3000/api/branches/' + id, branch)
      .subscribe(response => {
        const updatedBranch = [...this.branches];
        const oldShiftIndex = updatedBranch.findIndex(p => p.id === branch.id);
        updatedBranch[oldShiftIndex] = branch;
        this.branches = updatedBranch;
        this.branchesUpdated.next([...this.branches]);
      });
  }

  deleteBranch(branchId: string) {
    this.http.delete('http://localhost:3000/api/branches/' + branchId)
      .subscribe(() => {
        const updatedBranch = this.branches.filter(branch => branch.id !== branchId);
        this.branches = updatedBranch;
        this.branchesUpdated.next([...this.branches]);
      });
  }

}
