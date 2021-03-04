import { Component, Input, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
})
export class DishdetailComponent implements OnInit {
  constructor(
    private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  dish!: Dish;

  ngOnInit(): void {
    let id = this.route.snapshot.params['id'];
    this.dishService.getDish(id).then((dish) => (this.dish = dish));
  }

  goBack(): void {
    this.location.back();
  }
}
