import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { flyInOut, visibility, expand } from '../animations/app.animation';
import { FeedbackService } from '../services/feedback.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    style: 'display: block;',
  },
  animations: [visibility(), flyInOut(), expand()],
})
export class ContactComponent implements OnInit {
  feedbackForm!: FormGroup;
  feedback!: Feedback;
  feedbackCopy!: Feedback;
  contactType = ContactType;
  errMess!: string;
  @ViewChild('fform')
  feedbackFormDirective!: { resetForm: () => void };
  visibility = 'shown';

  formErrors: any = {
    firstname: '',
    lastname: '',
    telnum: '',
    email: '',
  };

  validationMessages: any = {
    firstname: {
      required: 'First Name is required.',
      minlength: 'First Name must be at least 2 characters long.',
      maxlength: 'First Name cannot be more than 25 characters long.',
    },
    lastname: {
      required: 'Last Name is required.',
      minlength: 'Last Name must be at least 2 characters long.',
      maxlength: 'Last Name cannot be more than 25 characters long.',
    },
    telnum: {
      required: 'Tel. number is required.',
      pattern: 'Tel. number must contain only numbers.',
    },
    email: {
      required: 'Email is required.',
      email: 'Email not in valid format.',
    },
  };

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService,
    @Inject('BaseURL') public BaseURL: string
  ) {
    this.createForm();
  }

  ngOnInit(): void {}

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ],
      ],
      lastname: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ],
      ],
      telnum: [0, [Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contacttype: 'None',
      message: '',
    });

    this.feedbackForm.valueChanges.subscribe((data) =>
      this.onValueChanged(data)
    );

    this.onValueChanged(); // (re)set form validation messages
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) {
      return;
    }
    const form = this.feedbackForm;
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

  // onSubmit() {
  //   // can use this .value easily
  //   // cos it happens that feedbackForm has exactly the same properties
  //   // as feedback object. If not, need to do the mapping explicitly
  //   // for each attributes.
  //   this.feedback = this.feedbackForm.value;
  //   console.log(this.feedback);
  //   this.feedbackForm.reset({
  //     firstname: '',
  //     lastname: '',
  //     telnum: 0,
  //     email: '',
  //     agree: false,
  //     contacttype: 'None',
  //     message: '',
  //   });

  //   // this is to ensure that the feedbackForm is completely reset to its
  //   // prestine value at this point.
  //   this.feedbackFormDirective.resetForm();
  // }

  onSubmit() {
    this.feedbackForm.setValue({
      firstname: this.feedbackForm.get('firstname')!.value,
      lastname: this.feedbackForm.get('lastname')!.value,
      telnum: this.feedbackForm.get('telnum')!.value,
      email: this.feedbackForm.get('email')!.value,
      agree: this.feedbackForm.get('agree')!.value,
      contacttype: this.feedbackForm.get('contacttype')!.value,
      message: this.feedbackForm.get('message')!.value,
    });

    this.feedbackCopy = this.feedbackForm.value;
    this.feedback = null!;
    this.feedbackForm = null!;

    this.feedbackService.submitFeedback(this.feedbackCopy).subscribe(
      (feedback) => {
        this.feedback = feedback;
      },
      (errmess) => {
        this.feedback = null!;
        this.errMess = <any>this.errMess;
      }
    );

    setTimeout(() => {
      this.feedback = null!;
      this.createForm();
    }, 7000);

    // this is to ensure that the feedbackForm is completely reset to its
    // prestine value at this point.
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: 0,
      email: '',
      agree: false,
      contacttype: 'None',
      message: '',
    });
  }
}
