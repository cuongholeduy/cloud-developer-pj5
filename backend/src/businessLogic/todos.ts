import { TodosAccess } from '../dataLayer/todosAccess'
import { AttachmentUtils } from '../helpers/attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

// TODO: Implement businessLogic
const logger = createLogger('TodosAcess')
const attachmentUtils = new AttachmentUtils()
const todosAccess = new TodosAccess()

// Function Get Todo
export async function funcGetTodosForUser(userId: string): Promise<TodoItem[]> {
  logger.info('funcGetTodosForUser function was called.')
  return todosAccess.funcGetAllTodos(userId)
}

// Function Create Todo
export async function funcCreateTodo(
  newTodo: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  logger.info('funcCreateTodo function was called.')

  const todoId = uuid.v4()
  const createdAt = new Date().toISOString()
  const s3AttachmentUrl = attachmentUtils.funcGetAttachmentUrl(todoId)
  const newItem = {
    userId,
    todoId,
    createdAt,
    done: false,
    attachmentUrl: s3AttachmentUrl,
    ...newTodo
  }

  return await todosAccess.funcCreateTodoItem(newItem)
}

// Function Update Todo
export async function funcUpdateTodo(
  userId: string,
  todoId: string,
  todoUpdate: UpdateTodoRequest
): Promise<TodoUpdate> {
  logger.info('funcUpdateTodo function was called.')

  return await todosAccess.funcUpdateTodoItem(userId, todoId, todoUpdate)
}

// Function Delete Todo
export async function funcDeleteTodo(
  userId: string,
  todoId: string
): Promise<string> {
  logger.info('funcDeleteTodo function was called.')
  return todosAccess.funcDeleteTodoItem(userId, todoId)
}

// Create attachment function
export async function funcCreateAttachmentPresignedUrl(
  userId: string,
  todoId: string
): Promise<string> {
  logger.info('funcDeleteTodo function was called.', todoId)

  todosAccess.funcUpdateTodoAttachmentUrl(userId, todoId)
  return attachmentUtils.funcGetUploadUrl(todoId)
}
