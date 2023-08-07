import { Course } from '../entities/course.entity'
import { CourseCommandRepositoryInteractor } from './course.repository.interactor'
import { PrismaClient, Prisma } from '../prismas/mysql/client'

export class MysqlRepository implements CourseCommandRepositoryInteractor {
  constructor(private mysql: PrismaClient) {}

  async add(course: Course): Promise<boolean> {
    await this.mysql.course.create({
      data: course as Prisma.courseCreateInput,
    })
    return true
  }

  async update(course: Course): Promise<boolean> {
    await this.mysql.course.update({
      where: {
        id: course.id,
      },
      data: course as Prisma.courseUncheckedCreateInput,
    })
    return true
  }

  async delete(id: string): Promise<boolean> {
    await this.mysql.course.update({
      where: {
        id: id,
      },
      data: {
        deleted_at: new Date(),
      },
    })
    return true
  }

  async getOneById(id: string): Promise<Course | null> {
    const course = await this.mysql.course.findFirst({
      where: {
        id: id,
        deleted_at: null,
      },
    })

    return course as unknown as Course
  }
}
