import {Injectable} from '@angular/core';
import {Shift} from '../Shifts/shift.model';
import {Rota} from './rota.model';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {RotaListComponent} from './rota-list/rota-list.component';


@Injectable({providedIn: 'root'})
export class RotaService {

  isLoading = false;
  private shifts: Shift[] = [];
  private rotas: Rota[] = [];
  private rotasUpdated = new Subject<Rota[]>();

  constructor(
    private http: HttpClient,
  ) {}



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
        this.rotasUpdated.next([...this.rotas]);
      });
  }

  getRota(id: string) {
    return this.http.get<any>('http://localhost:3000/api/rotas/' + id);
  }

  deleteRota(rotaId: string) {
    this.http.delete('http://localhost:3000/api/rotas/' + rotaId)
      .subscribe(() => {
        const updatedRotas = this.rotas.filter(rota => rota.id !== rotaId);
        this.rotas = updatedRotas;
        console.log(updatedRotas);
        this.rotasUpdated.next([...this.rotas]);
      });
  }

  // create a method to normalise the array to be sent as observable (at line 67)
}
