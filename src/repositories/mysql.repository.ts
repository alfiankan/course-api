import { Course } from '../entities/course.entity'
import { CourseCommandRepositoryInteractor } from './course.repository.interactor'
import { PrismaClient, Prisma } from '../../node_modules/prismamysqlclient'

export class MysqlRepository implements CourseCommandRepositoryInteractor {
  constructor(private mysql: PrismaClient) {}

  async add(course: Course): Promise<boolean> {
    await this.mysql.course.create({
      data: course as Prisma.CourseUncheckedCreateInput,
    })
    return true
  }

  async update(course: Course): Promise<boolean> {
    await this.mysql.course.update({
      where: {
        id: course.id,
      },
      data: course as Prisma.CourseUncheckedCreateInput,
    })
    return true
  }

  async delete(id: string): Promise<boolean> {
    await this.mysql.course.delete({
      where: {
        id: id,
      },
    })
    return true
  }

  async getOneById(id: string): Promise<Course | null> {
    const course = await this.mysql.course.findFirst({
      where: {
        id: id,
      },
    })

    return course as unknown as Course
  }
}
