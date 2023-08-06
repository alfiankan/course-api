import { describe, expect, test } from '@jest/globals'
import { DynamoDbRepositoryMock } from '../repositories/mock/dynamodb.repository.mock'
import { MysqlRepositoryMock } from '../repositories/mock/mysql.repository.mock'
import { CourseCommandService } from '../services/command.service'
import { faker } from '@faker-js/faker'
import { Course } from '../entities/course.entity'
import { v4 as uuidv4 } from 'uuid'
import { CourseQueryService } from '../services/query.service'

describe('course management', () => {
  let coursesMockStore = new Map<string, Course>()
  const courseCommandRepo = new MysqlRepositoryMock(coursesMockStore)
  const courseQueryRepository = new DynamoDbRepositoryMock(coursesMockStore)
  const courseCommandService = new CourseCommandService(
    courseCommandRepo,
    courseQueryRepository,
  )
  const courseQueryService = new CourseQueryService(
    courseCommandRepo,
    courseQueryRepository,
  )

  test('add new course', () => {
    coursesMockStore.clear()
    courseCommandService.createCourse(
      faker.commerce.product(),
      faker.lorem.words({ max: 2, min: 1 }),
      faker.lorem.paragraph(5),
    )

    const courses = courseQueryService.getList()
    expect(courses.length).toBe(1)
  })

  test('get list', () => {
    coursesMockStore.clear()
    for (let i = 0; i < 3; i++) {
      courseCommandService.createCourse(
        faker.commerce.product(),
        faker.lorem.words({ max: 2, min: 1 }),
        faker.lorem.paragraph(5),
      )
    }

    const courses = courseQueryService.getList()
    expect(courses.length).toBe(3)
  })

  test('get detail', () => {
    coursesMockStore.clear()
    courseCommandService.createCourse(
      faker.commerce.product(),
      faker.lorem.words({ max: 2, min: 1 }),
      faker.lorem.paragraph(5),
    )

    const course = courseQueryService.getList()[0]
    const checkCourse = courseQueryService.getById(course.id)
    expect(course.title).toBe(checkCourse?.title)

    const checkNotFound = courseQueryService.getById(uuidv4())
    expect(checkNotFound).toBeNull()
  })

  test('delete course', () => {
    coursesMockStore.clear()
    coursesMockStore = new Map<string, Course>()
    courseCommandService.createCourse(
      faker.commerce.product(),
      faker.lorem.words({ max: 2, min: 1 }),
      faker.lorem.paragraph(5),
    )

    const course = courseQueryService.getList()[0]
    courseCommandService.deleteById(course.id)
    const courses = courseQueryService.getList()
    expect(courses.length).toBe(0)
  })
})
