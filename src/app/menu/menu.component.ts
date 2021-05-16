import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DISHES } from '../shared/dishes';

import { DishService } from '../services/dish.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  dishes!: Dish[];
  errMess!: string;

  constructor(
    private dishService: DishService,
    @Inject('BaseURL') public BaseURL: string
  ) {}

  ngOnInit(): void {
    // this.dishService.getDishes().then((dishes) => (this.dishes = dishes));
    this.dishService.getDishes().subscribe(
      (dishes) => (this.dishes = dishes),
      (errmess) => (this.errMess = <any>errmess)
    );
    // The subscribe method, right now we have only specified one function here.
    // We can also specify a second function which will be called when the error results.
  }
}
