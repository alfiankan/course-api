import { Course } from '../../entities/course.entity'
import { CourseQueryRepositoryInteractor } from '../course.repository.interactor'

export class DynamoDbRepositoryMock implements CourseQueryRepositoryInteractor {
  constructor(public courses: Map<string, Course>) {}

  add(course: Course): boolean {
    course.validate()
    this.courses.set(course.id, course)
    return true
  }

  invalidate(id: string): boolean {
    this.courses.delete(id)
    return true
  }

  getList(): Array<Course> {
    return Array.from(this.courses.values())
  }

  getOneById(id: string): Course | null {
    if (this.courses.get(id) == undefined) {
      return null
    }
    return this.courses.get(id)!
  }
}
