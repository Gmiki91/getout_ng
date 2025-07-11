import { Component, inject, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TIMES } from '../../../time';
import { MatFormField,  } from '@angular/material/form-field';
import {  MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';
@Component({
    selector: 'app-time-field',
    templateUrl: './time-field.component.html',
    styleUrl: '../../event-form.component.scss',
    providers: [provideNativeDateAdapter()],
    imports: [ReactiveFormsModule, MatFormField, MatDatepickerModule, MatInputModule, MatSelectModule]
})
export class TimeFieldComponent implements OnInit {
  form!: FormGroup;
  times = TIMES;
  endTimes: string[] = [];
  isEndTime = false;
  minDate = new Date(); // Min date is today
  durationInDays = output<number>();
  fb = inject(FormBuilder);

  ngOnInit(): void {
    this.buildForm();
    this.subscribeToStartDateChange();
    this.checkEndTimeHours();
  }

  buildForm():void{
    const currentHour = new Date().getHours();
    const defaultStartTime =
      currentHour === 0 ? TIMES[1] : TIMES[currentHour * 2 + 2];
    const defaultEndTime =
      currentHour === 0 ? TIMES[2] : TIMES[currentHour * 2 + 2];
      this.form = this.fb.group({
        startDate: [new Date(), Validators.required],
        selectedTime: [defaultStartTime, Validators.required],
        endDate: [new Date()],
        selectedEndTime: [defaultEndTime],
      });
  }

  subscribeToStartDateChange():void{
    this.form.get('startDate')?.valueChanges.subscribe((startDate) => {
        const endDateControl = this.form.get('endDate');
        endDateControl?.setValue(startDate)
      });
  }

  toogleEndTime() {
    this.isEndTime = !this.isEndTime;
    if(this.isEndTime){
      this.checkEndTimeHours();
    }
      }

  checkEndTimeHours() {
    if(this.isEndTime){
      const startDate = this.form.get('startDate')?.value;
      const selectedTime = this.form.get('selectedTime')?.value;

      if (this.form.get('endDate')?.value?.toDateString() === startDate?.toDateString()) {
        this.endTimes = this.times.filter((time) => time > selectedTime);
        this.form.patchValue({ selectedEndTime: this.endTimes[0] || '00:00' });
      } else {
        this.endTimes = [...this.times];
      }
      this.updateDuration();
    }
  }

   /**
    * endingDate is set to startDate, but if we change startDate, it is possible the endDate is earlier
    * (onSubmit gets the endDate from the form, so its fine)
    * if thats the case, endDate was not initilaized, so duration is still less than 1 day
    */
  updateDuration() {
    const startDate = this.form.get('startDate')?.value;
    const endDate = this.form.get('endDate')?.value;
    const selectedTime = this.form.get('selectedTime')?.value;
    const selectedEndTime = this.form.get('selectedEndTime')?.value;

    if(startDate && endDate){
       if (startDate.getTime() >= endDate.getTime()) {
         this.durationInDays.emit(0);
       } else {
         const start = new Date(
           this.initTime(startDate, selectedTime)
         ).getTime();
         const end = new Date(
           this.initTime(endDate, selectedEndTime)
         ).getTime();
         const diffInMs = end - start;
         this.durationInDays.emit(diffInMs / 1000 / 60 / 60 / 24);
       }
      }
  }

  getStartTime():string{
    const date = this.form.get('startDate')?.value;
    const time = this.form.get('selectedTime')?.value;
    return  this.initTime(date, time);
  }

  getEndTime():string{
    if(!this.isEndTime)
      return '';
    const date = this.form.get('endDate')?.value;
    const time = this.form.get('selectedEndTime')?.value;
    return  this.initTime(date, time);
  }

  private initTime(date: Date, time: string):string {
    const result = new Date(date);
    const hour = +time.substring(0, 2);
    const minute = +time.substring(3);
    result.setHours(hour);
    result.setMinutes(minute);
    result.setSeconds(0);
    return result.toISOString();
  }
}
