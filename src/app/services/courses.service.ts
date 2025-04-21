import {Injectable, inject} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../environments/environment";
import {firstValueFrom} from "rxjs";
import {Course} from "../models/course.model";
import {GetCoursesResponse} from "../models/get-courses.response";


@Injectable({
  providedIn: "root"
})
export class CoursesService {

  env = environment;

  http = inject(HttpClient);
  
  async loadAllCourses(): Promise<Course[]> {
    const couses$ = this.http.get<GetCoursesResponse>(
      `${this.env.apiRoot}/courses`
    );
    const response = await firstValueFrom(couses$);
    return response.courses;
  }

  async createCourse(course: Partial<Course>): Promise<Course> {
    const course$ = this.http.post<Course>(
      `${this.env.apiRoot}/courses`,
      course
    );
    return firstValueFrom(course$);
  }

  async saveCourse(courseID: string, changes: Partial<Course>): Promise<Course> {
    const course$ = this.http.put<Course>(
      `${this.env.apiRoot}/courses/${courseID}`,
      changes
    );
    return firstValueFrom(course$);
  }

  async deletCourse(courseID: string): Promise<unknown> {
    const delete$ = this.http.delete(
      `${this.env.apiRoot}/courses/${courseID}`
    );
    return firstValueFrom(delete$);
  }

}
