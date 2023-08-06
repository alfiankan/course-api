import { Course } from '../../entities/course.entity'
import { CourseCommandRepositoryInteractor } from '../course.repository.interactor'

export class MysqlRepositoryMock implements CourseCommandRepositoryInteractor {
  constructor(public courses: Map<string, Course>) {}

  add(course: Course): boolean {
    course.validate()
    this.courses.set(course.id, course)
    return true
  }

  update(course: Course): boolean {
    course.validate()
    this.courses.set(course.id, course)
    return true
  }

  delete(id: string): boolean {
    this.courses.delete(id)
    return true
  }

  getOneById(id: string): Course | null {
    if (this.courses.get(id) == undefined) {
      return null
    }
    return this.courses.get(id)!
  }
}
