import {Injectable} from '@angular/core';
import {Shift} from '../Shifts/shift.model';
import {Rota} from './rota.model';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class RotaService {

  isLoading = false;
  private shifts: Shift[] = [];
  private rotas: Rota[] = [];
  private rotasUpdated = new Subject<Rota[]>();
  private rosters = [];

  constructor(private http: HttpClient) {}



  addRota(rota) {
    this.http.post<any>('http://localhost:3000/api/rotas', rota)
      .subscribe((responseData) => {
        const id = responseData.rotaId;
        rota.id = id;
        this.rotas.push(rota);
        this.rotasUpdated.next([...this.rotas]);
      });
  }

  getRotaUpdateListener() {
    return this.rotasUpdated.asObservable();
  }

  getRotas() {
    this.http
      .get<{message: string, rotas: any}>('http://localhost:3000/api/rotas')
      .pipe(map((rotaData) => {
        return rotaData.rotas.map(rotas => {
          return {
            branchName: rotas.branchName,
            employeeName: rotas.employeeName,
            shifts: rotas.shifts,
            rotaStartDate: rotas.rotaStartDate,
            rotaEndDate: rotas.rotaEndDate,
            id: rotas._id
          };
        });
      }))
      .subscribe((transformedRota) => {
        this.rotas = transformedRota;
        this.rosters = [];
        this.normaliseArray(this.rotas);
        this.rotasUpdated.next([...this.rosters]);
      });
  }

  getRota(id: string) {
    return this.http.get<any>('http://localhost:3000/api/rotas/' + id);
  }

  deleteRota(rotaId: string) {
    this.http.delete('http://localhost:3000/api/rotas/' + rotaId)
      .subscribe(() => {
          for (let i = 0; i < this.rosters.length; i++) {
            for (let j = 0; j < this.rosters[i].weeklyRota.length; j++) {
              if (this.rosters[i].weeklyRota[j].id === rotaId) {
                this.rosters[i].weeklyRota.splice(j, 1);
              }
            }
          }
        const updatedRotas = this.rotas.filter(rota => rota.id !== rotaId);
        this.rotas = updatedRotas;
        this.rotasUpdated.next([...this.rotas]);
      });
  }

  updateRota(arr) {
    const rota = arr;
    this.http.put('http://localhost:3000/api/rotas/' + arr.id, rota)
      .subscribe(response => {
        const updatedRotas = [...this.rotas];
        const oldRotaIndex = updatedRotas.findIndex(p => p.id === rota.id);
        updatedRotas[oldRotaIndex] = rota;
        this.rotas = updatedRotas;
        this.rotasUpdated.next([...this.rotas]);
      });
  }

  getRosters() {
    return this.rosters;
  }

// create a method to normalise the array to be sent as observable (at line 67)
  private normaliseArray(rotas) {
    let found = false;
    for (let i = 0; i < rotas.length; i++) {
      for (let j = 0; j < this.rosters.length; j++) {
        if (rotas[i].branchName === this.rosters[j].branch) {
          const shifts = this.shiftsPerUser(rotas[i].shifts);
          const obj = {
            startDate: rotas[i].rotaStartDate + ' <---> ' + rotas[i].rotaEndDate,
            id: rotas[i].id,
            userRoster: [{
              employeeName: rotas[i].employeeName,
              shifts: [shifts]}],
          };
          this.rosters[j].weeklyRota.push(obj);
          found = true;
        }
      }
      if (!found) {
        const shifts = this.shiftsPerUser(rotas[i].shifts);
        this.rosters.push({
          branch: rotas[i].branchName,
          weeklyRota: [{
            id: rotas[i].id,
            startDate: rotas[i].rotaStartDate + ' <---> ' + rotas[i].rotaEndDate,
            userRoster: [{
              employeeName: rotas[i].employeeName,
              shifts: [shifts]}]
          }]
        });
        found = false;
      }
      found = false;
    }
  }

  private shiftsPerUser(arr: string[]) {
    const sevenShiftsPerUser = [];
    for (let i = 0; i <= arr.length; i++) {
      const tempArr = arr.splice(0, 7);
      sevenShiftsPerUser.push(tempArr);
    }
    return sevenShiftsPerUser;
  }
}
