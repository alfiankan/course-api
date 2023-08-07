import { Course } from '../entities/course.entity'
import { CourseQueryRepositoryInteractor } from './course.repository.interactor'
import { PrismaClient } from '../prismas/mongodb/client'

export class DynamoDBRepository implements CourseQueryRepositoryInteractor {
  constructor(private mongodb: PrismaClient) {}

  async add(course: Course): Promise<boolean> {
    await this.mongodb.course.create({
      data: {
        course_id: course.id,
        title: course.title,
        description: course.description,
        slug: course.slug,
        author_id: course.author_id ?? '',
        contents: course.contents,
      },
    })

    return true
  }

  async invalidate(id: string): Promise<boolean> {
    await this.mongodb.course.deleteMany({
      where: {
        course_id: id,
      },
    })
    return true
  }

  async getList(): Promise<Array<Course>> {
    const courses = await this.mongodb.course.findMany()
    return courses as unknown as Array<Course>
  }

  async getOneById(id: string): Promise<Course | null> {
    const courses = await this.mongodb.course.findFirst({
      where: {
        course_id: id,
      },
    })
    return courses as unknown as Course
  }

  async delete(id: string): Promise<boolean> {
    await this.mongodb.course.deleteMany({
      where: {
        course_id: id,
      },
    })
    return true
  }
}
