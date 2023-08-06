import { Course } from '../entities/course.entity'
import {
  CourseCommandRepositoryInteractor,
  CourseQueryRepositoryInteractor,
} from '../repositories/course.repository.interactor'

export class CourseQueryService {
  constructor(
    private courseCommandRepository: CourseCommandRepositoryInteractor,
    private courseQueryRepository: CourseQueryRepositoryInteractor,
  ) {}

  getCourses(): Array<Course> {
    return this.courseQueryRepository.getList()
  }

  getList(): Array<Course> {
    return this.courseQueryRepository.getList()
  }

  getById(id: string): Course | null {
    let course = this.courseQueryRepository.getOneById(id)
    if (!course) {
      course = this.courseCommandRepository.getOneById(id)
      if (course) {
        this.courseQueryRepository.add(course)
        return course
      }
    }
    return course
  }
}
