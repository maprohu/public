import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { repositoryDispatch } from './main';
import env from './env';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    await repositoryDispatch(env());
    return {
        statusCode: 200,
        body: "ok",
    };
};