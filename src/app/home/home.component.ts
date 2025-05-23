import {Component, computed, effect, ElementRef, inject, Injector, signal, viewChild} from '@angular/core';
import {CoursesService} from "../services/courses.service";
import {Course, sortCoursesBySeqNo} from "../models/course.model";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {CoursesCardListComponent} from "../courses-card-list/courses-card-list.component";
import {MatDialog} from "@angular/material/dialog";
import {MatTooltip, MatTooltipModule} from "@angular/material/tooltip";
import {MessagesService} from "../messages/messages.service";
import {catchError, from, interval, single, startWith, throwError} from "rxjs";
import {toObservable, toSignal, outputToObservable, outputFromObservable} from "@angular/core/rxjs-interop";
import { CoursesServiceWithFetch } from '../services/courses-fetch.service';
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';

@Component({
    selector: 'home',
    imports: [
        MatTabGroup,
        MatTab,
        MatTooltipModule,
        CoursesCardListComponent,
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

    coursesService: CoursesService = inject(CoursesService);
    dialog: MatDialog = inject(MatDialog);
    messagesService = inject(MessagesService);
    injector = inject(Injector);

    beginnerList = viewChild<CoursesCardListComponent>("beginnerList");
    advancedList = viewChild<CoursesCardListComponent>("advancedList");
    beginnerTooltip = viewChild("beginnerList", { read: MatTooltip });
    advancedTooltip = viewChild("advancedList", {read: MatTooltip});

    courses$ = toObservable(this.#courses);

    constructor() {
        // this.courses$.subscribe(
        //     courses => console.log(`courses$: `, courses)
        // );

        // effect(() => {
        //     console.log('courses: ', this.#courses());
        // })

        // effect(() => {
        //     console.log('Beginner courses: ', this.beginnerCourses());
        //     console.log('Advanced courses: ', this.advancedCourses());
        // })

        // effect(() => console.log(`Beginner List:`, this.beginnerList()));
        // effect(() => console.log(`Beginner Tooltip :`, this.beginnerTooltip()))
        // effect(() => console.log(`Advanced Tooltip :`, this.advancedTooltip()))

        this.loadAllCourses().then(() => {
            console.log('All courses loaded: ', this.#courses());
        });
    }

    async loadAllCourses() {
        try {
            const coursas = await this.coursesService.loadAllCourses();
            this.#courses.set(coursas.sort(sortCoursesBySeqNo));
        } catch(err) {
            this.messagesService.showMessage('Error loading courses...!', 'error');
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

        if (!newCourse) {
            return;
        }

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

    onToObservable() {
        // const courses$ = toObservable(
        //     this.#courses,
        //     { injector: this.injector }
        // );

        // courses$.subscribe(
        //     courses => console.log(`courses$: `, courses)
        // );

        const numbers = signal(0);
        numbers.set(1);
        numbers.set(2);
        numbers.set(3);
        const numbers$ = toObservable(
            numbers,
            { injector: this.injector }
            );
        numbers.set(4);
        numbers$.subscribe(
            val => console.log(`numbers$: `, val)
        );
        numbers.set(5);
    }

    onToSignal() {
        // const courses = toSignal(
        //     this.courses$,
        //     {
        //         injector: this.injector,

        //     }
        // );
        // effect(() => {
        //     console.log(`courses: `, courses());
        // }, { injector: this.injector });

        const numbers$ = interval(1000).pipe(
            startWith(0)
        );
        const numbers = toSignal(
            numbers$,
            {
                injector: this.injector,
                requireSync: true
            }
        );
        effect(() => {
            console.log(`Numbers: `, numbers());
        }, { injector: this.injector });
    }
}
