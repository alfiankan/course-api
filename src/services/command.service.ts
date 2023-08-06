import { Course } from '../entities/course.entity'
import {
  CourseCommandRepositoryInteractor,
  CourseQueryRepositoryInteractor,
} from '../repositories/course.repository.interactor'
import { v4 as uuidv4 } from 'uuid'

export class CourseCommandService {
  constructor(
    private courseCommandRepository: CourseCommandRepositoryInteractor,
    private courseQueryRepository: CourseQueryRepositoryInteractor,
  ) {}

  createCourse(
    title: string,
    description: string,
    contents: string,
    author_id?: string,
    slug?: string,
  ): boolean {
    const course = new Course()
    course.id = uuidv4()
    course.title = title
    course.description = description
    course.author_id = author_id
    if (!slug) {
      // auto generate slug
      course.slug = title.replace(/[^a-z0-9]/gi, '')
    }
    course.contents = contents
    course.createdAt = new Date()
    course.validate()
    course.sanityXss()

    // save to main database
    this.courseCommandRepository.add(course)
    // save to read database
    this.courseQueryRepository.add(course)

    return true
  }

  deleteById(id: string): boolean {
    return this.courseCommandRepository.delete(id)
  }
}
