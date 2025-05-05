import {Component, ElementRef, effect, inject, input, output, viewChildren} from '@angular/core';
import {RouterLink} from "@angular/router";
import {Course} from "../models/course.model";
import {MatDialog} from "@angular/material/dialog";
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';

@Component({
    selector: 'courses-card-list',
    imports: [
        RouterLink
    ],
    templateUrl: './courses-card-list.component.html',
    styleUrl: './courses-card-list.component.scss'
})
export class CoursesCardListComponent {

    dialog = inject(MatDialog);

    courses = input.required<Course[]>();
    
    courseCards = viewChildren<ElementRef>("courseCard");

    courseUpdated = output<Course>();
    courseDeleted = output<string>();

    constructor() {
        effect(() => console.log(`Course cards: `, this.courseCards()))
    }

    async  onEditCourse(course: Course) {
        const newCourse = await openEditCourseDialog(
            this.dialog,
            {
                mode: "update",
                title: "Edit Course",
                course
            }
        );

        if (!newCourse) {
            return;
        }

        console.log('Course edited: ', newCourse);
        this.courseUpdated.emit(newCourse);
    }

    onDeleteCourse(course: Course) {
        this.courseDeleted.emit(course.id);
    }

}
