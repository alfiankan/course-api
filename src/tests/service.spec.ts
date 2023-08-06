import { describe, expect, test } from '@jest/globals'
import { DynamoDbRepositoryMock } from '../repositories/mock/dynamodb.repository.mock'
import { MysqlRepositoryMock } from '../repositories/mock/mysql.repository.mock'
import { faker } from '@faker-js/faker'
import { Course } from '../entities/course.entity'
import { v4 as uuidv4 } from 'uuid'
import { CourseService } from '../services/course.service'

describe('course management', () => {
  let coursesMockStore = new Map<string, Course>()
  const courseCommandRepo = new MysqlRepositoryMock(coursesMockStore)
  const courseQueryRepository = new DynamoDbRepositoryMock(coursesMockStore)
  const courseService = new CourseService(
    courseCommandRepo,
    courseQueryRepository,
  )

  test('add new course', async () => {
    coursesMockStore.clear()
    await courseService.createCourse(
      faker.commerce.product(),
      faker.lorem.words({ max: 2, min: 1 }),
      faker.lorem.paragraph(5),
    )

    const courses = await courseService.getList()
    expect(courses.length).toBe(1)
  })

  test('get list', async () => {
    coursesMockStore.clear()
    for (let i = 0; i < 3; i++) {
      await courseService.createCourse(
        faker.commerce.product(),
        faker.lorem.words({ max: 2, min: 1 }),
        faker.lorem.paragraph(5),
      )
    }

    const courses = await courseService.getList()
    expect(courses.length).toBe(3)
  })

  test('get detail', async () => {
    coursesMockStore.clear()
    await courseService.createCourse(
      faker.commerce.product(),
      faker.lorem.words({ max: 2, min: 1 }),
      faker.lorem.paragraph(5),
    )

    const course = await courseService.getList()
    const checkCourse = await courseService.getById(course[0].id)
    expect(course[0].title).toBe(checkCourse?.title)

    const checkNotFound = await courseService.getById(uuidv4())
    expect(checkNotFound).toBeNull()
  })

  test('delete course', async () => {
    coursesMockStore.clear()
    coursesMockStore = new Map<string, Course>()
    await courseService.createCourse(
      faker.commerce.product(),
      faker.lorem.words({ max: 2, min: 1 }),
      faker.lorem.paragraph(5),
    )

    const course = await courseService.getList()
    await courseService.deleteById(course[0].id)
    const courses = await courseService.getList()
    expect(courses.length).toBe(0)
  })
})
