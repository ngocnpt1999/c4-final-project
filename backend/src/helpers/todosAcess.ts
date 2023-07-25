import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
const documentClient = new DocumentClient();

const tableName = process.env.TODO_TABLE_NAME;

export async function findAllTodoByUserId(userId: string): Promise<TodoItem[]> {
    const params: DocumentClient.QueryInput = {
        TableName: tableName,
        KeyConditionExpression: '#userId = :userId',
        ExpressionAttributeNames: {
            '#userId': 'userId'
        },
        ExpressionAttributeValues: {
            ':userId': userId
        }
    };
    const result = await documentClient.query(params).promise();
    const items: TodoItem[] = result.Items as TodoItem[];
    return items;
}

export async function create(item: TodoItem): Promise<TodoItem> {
    const params: DocumentClient.PutItemInput = {
        TableName: tableName,
        Item: item
    };
    await documentClient.put(params).promise();
    return item;
}

export async function update(
    item: TodoUpdate,
    userId: string,
    todoId: string
): Promise<TodoUpdate> {
    const params: DocumentClient.UpdateItemInput = {
        TableName: tableName,
        Key: {
            userId,
            todoId
        },
        UpdateExpression: 'set #nameItem = :nameItem, #dueDateItem = :dueDateItem, #doneITem = :doneItem',
        ExpressionAttributeNames: {
            '#nameItem': 'name',
            '#doneITem': 'done',
            '#dueDateItem': 'dueDate'
        },
        ExpressionAttributeValues: {
            ':nameItem': item.name,
            ':doneITem': item.done,
            ':dueDateItem': item.dueDate
        },
        ReturnValues: 'ALL_NEW'
    };
    const result = await documentClient.update(params).promise();
    const updatedTodo: TodoUpdate = result.Attributes as TodoUpdate;
    return updatedTodo;
}

export async function remove(userId: string, todoId: string): Promise<string> {
    const params = {
        Key: {
            userId: userId,
            todoId: todoId
        },
        TableName: tableName
    };
    await documentClient.delete(params).promise();
    return '';
}