import {Component, OnDestroy, OnInit} from '@angular/core';
import {RotaService} from '../rota.service';
import {UsersService} from '../../users/users.service';
import {AuthService} from '../../auth/auth.service';
import {Rota} from '../rota.model';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {User} from '../../users/user.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-rota-swap',
  templateUrl: './rota-swap.component.html',
  styleUrls: ['./rota-swap.component.css']
})
export class RotaSwapComponent implements OnInit, OnDestroy {
  isLoading = false;
  rota: Rota[] = [];
  rotas = [];
  users: User[] = [];
  private rotaId: string;
  private rotasSub: Subscription;
  private usersSub: Subscription;

  constructor(
    public rotaService: RotaService,
    public usersService: UsersService,
    public authService: AuthService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.rotaService.getRotas();
    this.usersService.getUsers();
    this.rotasSub = this.rotaService
      .getRotaUpdateListener()
      .subscribe((rotas) => {
        this.isLoading = false;
        this.rotas = this.rotaService.getRosters();
      });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('rotaId')) {
        this.rotaId = paramMap.get('rotaId');
        console.log(paramMap);
        this.isLoading = true;
        this.rotaService.getRota(this.rotaId).subscribe(rotaData => {
          console.log(rotaData);
        });
      }
    });
  }

  ngOnDestroy() {
    this.rotasSub.unsubscribe();
  }

}
