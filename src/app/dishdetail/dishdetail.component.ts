import { Component, Input, OnInit, ViewChild, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Comment } from '../shared/comment';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';

import { switchMap } from 'rxjs/operators';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    trigger('visibility', [
      state(
        'shown',
        style({
          transform: 'scale(1.0)',
          opacity: 1,
        })
      ),
      state(
        'hidden',
        style({
          transform: 'scale(0.5)',
          opacity: 0,
        })
      ),
      transition('* => *', animate('0.5s ease-in-out')),
    ]),
  ],
})
export class DishdetailComponent implements OnInit {
  constructor(
    private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') public BaseURL: string
  ) {
    this.createForm();
  }

  dish!: Dish;
  errMess!: string;
  dishIds!: string[];
  prev!: string;
  next!: string;
  commentForm!: FormGroup;
  comment!: Comment;
  @ViewChild('fform')
  commentFormDirective!: { resetForm: () => void };
  dishcopy!: Dish;
  visibility = 'shown';

  formErrors: any = {
    author: '',
    comment: '',
  };

  validationMessages: any = {
    author: {
      required: 'Author Name is required.',
      minlength: 'Author Name must be at least 2 characters long.',
      maxlength: 'Author Name cannot be more than 25 characters long.',
    },
    comment: {
      required: 'Comment is required.',
      minlength: 'Comment must be at least 2 characters long.',
    },
  };

  createForm() {
    this.commentForm = this.fb.group({
      rating: new FormControl('5'),
      comment: ['', [Validators.required, Validators.minLength(2)]],
      author: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ],
      ],
      date: '',
    });

    this.commentForm.valueChanges.subscribe((data) =>
      this.onValueChanged(data)
    );

    this.onValueChanged(); // (re)set form validation messages
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) {
      return;
    }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  ngOnInit(): void {
    // snapshot: current value of the route
    //let id = this.route.snapshot.params['id'];
    // this.dishService.getDish(id).then((dish) => (this.dish = dish));
    //this.dishService.getDish(id).subscribe((dish) => (this.dish = dish));
    this.dishService
      .getDishIds()
      .subscribe((dishIds) => (this.dishIds = dishIds));

    this.route.params
      .pipe(
        switchMap((params: Params) => {
          this.visibility = 'hidden';
          return this.dishService.getDish(params['id']);
        })
      )
      .subscribe(
        (dish) => {
          this.dish = dish;
          this.dishcopy = dish;
          this.setPrevNext(dish.id);
          this.visibility = 'shown';
        },
        (errmess) => (this.errMess = <any>errmess)
      );
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev =
      this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next =
      this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit() {
    var now = new Date();
    this.commentForm.setValue({
      rating: this.commentForm.get('rating')!.value,
      comment: this.commentForm.get('comment')!.value,
      author: this.commentForm.get('author')!.value,
      date: now.toISOString(),
    });
    this.comment = this.commentForm.value;
    console.log(this.comment);
    this.dishcopy.comments.push(this.comment);
    this.dishService.putDish(this.dishcopy).subscribe(
      (dish) => {
        this.dish = dish;
        this.dishcopy = dish;
      },
      (errmess) => {
        this.dish = null!;
        this.dishcopy = null!;
        this.errMess = <any>this.errMess;
      }
    );

    // this is to ensure that the feedbackForm is completely reset to its
    // prestine value at this point.
    this.commentFormDirective.resetForm();

    this.commentForm.reset({
      rating: '5',
      author: '',
      comment: '',
      date: '',
    });
  }
}
