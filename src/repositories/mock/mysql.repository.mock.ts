import { Course } from '../../entities/course.entity'
import { CourseCommandRepositoryInteractor } from '../course.repository.interactor'

export class MysqlRepositoryMock implements CourseCommandRepositoryInteractor {
  constructor(public courses: Map<string, Course>) {}

  async add(course: Course): Promise<boolean> {
    course.validate()
    this.courses.set(course.id, course)
    return true
  }

  async update(course: Course): Promise<boolean> {
    course.validate()
    this.courses.set(course.id, course)
    return true
  }

  async delete(id: string): Promise<boolean> {
    this.courses.delete(id)
    return true
  }

  async getOneById(id: string): Promise<Course | null> {
    if (this.courses.get(id) == undefined) {
      return null
    }
    return this.courses.get(id)!
  }
}
