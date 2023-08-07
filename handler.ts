import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { PrismaClient as PrismaMysqlClient } from './src/prismas/mysql/client'
import { PrismaClient as PrismaMongoClient } from './src/prismas/mongodb/client'
import { DynamoDBRepository } from './src/repositories/dynamodb.repository'
import { MysqlRepository } from './src/repositories/mysql.repository'
import { CourseService } from './src/services/course.service'

const mysqlClient = new PrismaMysqlClient()
const mongoClient = new PrismaMongoClient()

const readRepo = new DynamoDBRepository(mongoClient)
const writeRepo = new MysqlRepository(mysqlClient)

const service = new CourseService(writeRepo, readRepo)

export const getById = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const pathParams = event.pathParameters! as any
    const course = await service.getById(pathParams['id'])

    return {
      statusCode: 200,
      body: JSON.stringify(course),
    }
  } catch (e) {
    console.error(e)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: e }),
    }
  }
}

export const getAll = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const courses = await service.getList()

    return {
      statusCode: 200,
      body: JSON.stringify(courses),
    }
  } catch (e) {
    console.error(e)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: e }),
    }
  }
}

export const addNew = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'body json in required' }),
    }
  }

  try {
    const bodyJson = JSON.parse(event.body!)
    console.log(bodyJson['slug'])
    await service.createCourse(
      bodyJson['title'],
      bodyJson['description'],
      bodyJson['content'],
      bodyJson['author_id'],
      bodyJson['slug'],
    )

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'success add course' }),
    }
  } catch (e) {
    console.error(e)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: e }),
    }
  }
}

export const edit = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'body json in required' }),
    }
  }

  const pathParams = event.pathParameters! as any

  try {
    const bodyJson = JSON.parse(event.body!)
    console.log(bodyJson['slug'])
    await service.updateCourse(
      pathParams['id'],
      bodyJson['title'],
      bodyJson['description'],
      bodyJson['content'],
      bodyJson['author_id'],
      bodyJson['slug'],
    )

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'success update course' }),
    }
  } catch (e) {
    console.error(e)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: e }),
    }
  }
}

export const deleteById = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const pathParams = event.pathParameters! as any
    await service.deleteById(pathParams['id'])

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'success delete course' }),
    }
  } catch (e) {
    console.error(e)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: e }),
    }
  }
}
