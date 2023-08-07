import { Course } from '../entities/course.entity'

export interface CourseQueryRepositoryInteractor {
  add(course: Course): Promise<boolean>
  invalidate(id: string): Promise<boolean>
  getList(): Promise<Array<Course>>
  delete(id: string): Promise<boolean>
  getOneById(id: string): Promise<Course | null>
}

export interface CourseCommandRepositoryInteractor {
  add(course: Course): Promise<boolean>
  update(course: Course): Promise<boolean>
  delete(id: string): Promise<boolean>
  getOneById(id: string): Promise<Course | null>
}
