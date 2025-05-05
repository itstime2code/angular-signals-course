import {Component, ElementRef, contentChild, contentChildren, effect, input, model} from '@angular/core';
import {CourseCategory} from "../models/course-category.model";

@Component({
  selector: 'course-category-combobox',
  standalone: true,
  imports: [],
  templateUrl: './course-category-combobox.component.html',
  styleUrl: './course-category-combobox.component.scss'
})
export class CourseCategoryComboboxComponent {


  title = contentChild<ElementRef>('title');
  titles = contentChildren<ElementRef>('title');

  label = input.required<string>();
  value = model.required<CourseCategory>();

  constructor() {
    effect(() => console.log(`title: `, this.title()));
    effect(() => console.log(`titles: `, this.titles()));
  }
  
  onCategoryChanged(category: string) {
    this.value.set(category as CourseCategory);
  }

}
