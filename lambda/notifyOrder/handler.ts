import { APIGatewayEvent } from 'aws-lambda';

export const main = async (event: APIGatewayEvent) => {
  const order = JSON.parse(event.body || '{}');
  console.log('Order received in Lambda:', order);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Order received and processed.' }),
  };
};
