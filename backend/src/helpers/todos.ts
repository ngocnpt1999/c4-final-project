import * as TodoAccess from './todosAcess'
import * as AttachmentUtils from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import { v4 as uuidv4 } from 'uuid';
import * as createError from 'http-errors'
import { parseUserId } from '../auth/utils';
import { TodoUpdate } from '../models/TodoUpdate';

const bucketName = process.env.S3_BUCKET_NAME;

// TODO: Implement businessLogic
export async function getAllTodo(jwtToken: string): Promise<TodoItem[]> {
    var userId = parseUserId(jwtToken);
    return TodoAccess.findAllTodoByUserId(userId);
}

export async function create(jwtToken: string, request: CreateTodoRequest): Promise<TodoItem> {
    var userId = parseUserId(jwtToken);
    var todoId = uuidv4();
    var imageUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`;
    return TodoAccess.create({
        userId: userId,
        todoId: todoId,
        createdAt: new Date().getTime().toString(),
        attachmentUrl: imageUrl,
        done: false,
        ...request
    });
}

export async function update(jwtToken: string, todoId: string, request: UpdateTodoRequest): Promise<TodoUpdate> {
    var userId = parseUserId(jwtToken);
    return TodoAccess.update({ ...request }, todoId, userId);
}

export async function remove(jwtToken: string, todoId: string): Promise<string> {
    var userId = parseUserId(jwtToken)
    return TodoAccess.remove(todoId, userId);
}