import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import { Observable, of } from 'rxjs';
// delay the emitting of the item from our observable
import { delay } from 'rxjs/operators';
import { promise } from 'selenium-webdriver';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DishService {
  constructor(private http: HttpClient) {}

  getDishes(): Observable<Dish[]> {
    // we know that the result will be available immediately
    // return new Promise(resolve => {
    //   setTimeout(() => resolve(DISHES), 2000);
    // });

    // method return Promise<Dish[]>
    // return of(DISHES).pipe(delay(2000)).toPromise();

    // method return Observable
    // return of(DISHES).pipe(delay(2000));

    return this.http.get<Dish[]>(baseURL + 'dishes');
  }

  getDish(id: string): Observable<Dish> {
    // return new Promise(resolve => {
    //   setTimeout(() => resolve(DISHES.filter((dish) => dish.id === id)[0]), 2000);
    // });

    // return Promise<Dish>
    // return of(DISHES.filter((dish) => dish.id === id)[0]).pipe(delay(2000)).toPromise();

    // return of(DISHES.filter((dish) => dish.id === id)[0]).pipe(delay(2000));

    return this.http.get<Dish>(baseURL + 'dishes/' + id);
  }

  getFeaturedDish(): Observable<Dish> {
    //   return new Promise((resolve) => {
    //     // Simulate server latency with 2 second delay
    //     setTimeout(
    //       () => resolve(DISHES.filter((dish) => dish.featured)[0]),
    //       2000
    //     );
    //   });
    // }

    // return Promise<Dish>
    // return of(DISHES.filter((dish) => dish.featured)[0]).pipe(delay(2000)).toPromise();

    // return of(DISHES.filter((dish) => dish.featured)[0]).pipe(delay(2000));

    return this.http
      .get<Dish[]>(baseURL + 'dishes?featuresd=true')
      .pipe(map((dishes) => dishes[0]));
  }

  getDishIds(): Observable<string[] | any> {
    // return of(DISHES.map((dish) => dish.id));

    return this.getDishes().pipe(
      map((dishes) => dishes.map((dish) => dish.id))
    );
  }
}
