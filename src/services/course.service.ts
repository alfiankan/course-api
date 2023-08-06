import { Course } from '../entities/course.entity'
import {
  CourseCommandRepositoryInteractor,
  CourseQueryRepositoryInteractor,
} from '../repositories/course.repository.interactor'
import { v4 as uuidv4 } from 'uuid'

export class CourseService {
  constructor(
    private courseCommandRepository: CourseCommandRepositoryInteractor,
    private courseQueryRepository: CourseQueryRepositoryInteractor,
  ) {}

  async createCourse(
    title: string,
    description: string,
    contents: string,
    author_id?: string,
    slug?: string,
  ): Promise<boolean> {
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
    await this.courseCommandRepository.add(course)
    // save to read database
    await this.courseQueryRepository.add(course)

    return true
  }

  async updateCourse(
    id: string,
    title: string,
    description: string,
    contents: string,
    author_id?: string,
    slug?: string,
  ): Promise<boolean> {
    const course = new Course()
    course.id = id
    course.title = title
    course.description = description
    course.author_id = author_id
    if (!slug) {
      course.slug = title.replace(/[^a-z0-9]/gi, '')
    }
    course.contents = contents
    course.createdAt = new Date()
    course.validate()
    course.sanityXss()

    await this.courseQueryRepository.invalidate(id)
    await this.courseCommandRepository.update(course)
    await this.courseQueryRepository.add(course)

    return true
  }

  async deleteById(id: string): Promise<boolean> {
    return await this.courseCommandRepository.delete(id)
  }

  async getList(): Promise<Array<Course>> {
    return await this.courseQueryRepository.getList()
  }

  async getById(id: string): Promise<Course | null> {
    let course = await this.courseQueryRepository.getOneById(id)
    if (!course) {
      course = await this.courseCommandRepository.getOneById(id)
      if (course) {
        await this.courseQueryRepository.add(course)
        return course
      }
    }
    return course
  }
}
