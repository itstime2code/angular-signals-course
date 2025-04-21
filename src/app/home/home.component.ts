import {Component, computed, effect, inject, Injector, signal} from '@angular/core';
import {CoursesService} from "../services/courses.service";
import {Course, sortCoursesBySeqNo} from "../models/course.model";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {CoursesCardListComponent} from "../courses-card-list/courses-card-list.component";
import {MatDialog} from "@angular/material/dialog";
import {MessagesService} from "../messages/messages.service";
import {catchError, from, throwError} from "rxjs";
import {toObservable, toSignal, outputToObservable, outputFromObservable} from "@angular/core/rxjs-interop";
import { CoursesServiceWithFetch } from '../services/courses-fetch.service';
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';

@Component({
    selector: 'home',
    imports: [
        MatTabGroup,
        MatTab,
        CoursesCardListComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
    #courses = signal<Course[]>([]);
    beginnerCourses = computed(() => {
        const courses = this.#courses();
        return courses.filter(
            courses => courses.category === "BEGINNER"
        );
    })
    advancedCourses = computed(() => {
        const courses = this.#courses();
        return courses.filter(
            courses => courses.category === "ADVANCED"
        );
    })

    coursesService = inject(CoursesService);
    dialog = inject(MatDialog);

    constructor() {
        effect(() => {
            console.log('Beginner courses: ', this.beginnerCourses());
            console.log('Advanced courses: ', this.advancedCourses());
        })

        this.loadAllCourses().then(() => {
            console.log('All courses loaded: ', this.#courses());
        });
    }

    async loadAllCourses() {
        try {
            const coursas = await this.coursesService.loadAllCourses();
            this.#courses.set(coursas.sort(sortCoursesBySeqNo));
        } catch(err) {
            alert('Error loading courses...!')
            console.error(err);
        }
    }

    onCourseUpdated(updatedCourse: Course) {
        const courses = this.#courses();

        const newCourses = courses.map( course =>
            course.id === updatedCourse.id ? updatedCourse : course
        );

        this.#courses.set(newCourses);
    }

    async onAddCourse() {
        const newCourse = await openEditCourseDialog(
            this.dialog, 
            {
                mode: 'create',
                title: 'Create New Course'
            }
        );
        const newCourses = [
            ...this.#courses(),
            newCourse
        ];
        this.#courses.set(newCourses);
    }

    async onCourseDeleted(courseID: string) {
        try {
            await this.coursesService.deletCourse(courseID);
            const coursas = this.#courses();
            const newCourses = coursas.filter(
                course => course.id !== courseID
            );
            this.#courses.set(newCourses);
        } catch (err) {
            console.error(err);
            alert('Error deleting course...!');
        }
    }
}
