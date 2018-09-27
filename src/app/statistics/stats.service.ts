import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {RotaService} from '../rota/rota.service';
import {map} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class StatsService {
  private rosters = [];
  private statsHolder = [];
  private statsUpdated = new Subject<any>();
  private rotas: any;

  constructor (private http: HttpClient, public rotaService: RotaService) {}

  getStats() {
    this.rotaService.getRotas();
    this.rotas = this.rotaService.getRosters();
  }



  getStatsUpdateListener() {
    return this.statsUpdated.asObservable();
  }

}
