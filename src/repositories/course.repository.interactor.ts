import { Course } from '../entities/course.entity'

export interface CourseQueryRepositoryInteractor {
  add(course: Course): boolean
  invalidate(id: string): boolean
  getList(): Array<Course>
  getOneById(id: string): Course | null
}

export interface CourseCommandRepositoryInteractor {
  add(course: Course): boolean
  update(course: Course): boolean
  delete(id: string): boolean
  getOneById(id: string): Course | null
}
