import { Course } from '../../entities/course.entity'
import { CourseQueryRepositoryInteractor } from '../course.repository.interactor'

export class DynamoDbRepositoryMock implements CourseQueryRepositoryInteractor {
  constructor(public courses: Map<string, Course>) {}

  async add(course: Course): Promise<boolean> {
    course.validate()
    this.courses.set(course.id, course)
    return true
  }

  async invalidate(id: string): Promise<boolean> {
    this.courses.delete(id)
    return true
  }

  async getList(): Promise<Array<Course>> {
    return Array.from(this.courses.values())
  }

  async getOneById(id: string): Promise<Course | null> {
    if (this.courses.get(id) == undefined) {
      return null
    }
    return this.courses.get(id)!
  }
}
