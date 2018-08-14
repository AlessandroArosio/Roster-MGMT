import {Branch} from './branch.model';
import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';


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

  getBranchUpdateListener() {
    return this.branchesUpdated.asObservable();
  }

  addBranch(name: string) {
    const branch: Branch = {
      id: null,
      branchName: name};
    this.http.post<{message: string}>('http://localhost:3000/api/branches', branch)
      .subscribe((responseData) => {
        console.log(responseData);
        this.branches.push(branch);
        this.branchesUpdated.next([...this.branches]);
      });
  }

}
