const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  console.log(event);
  console.log(event.queryStringParameters);

  const listId = event?.queryStringParameters?.listId;

  if (!listId) {
    return {
      statusCode: 400,
      body: JSON.stringify("Missing 'listId' in query string"),
    };
  }

  const params = {
    TableName: "inventory",
    Key: {
      pk: listId,
    },
  };

  try {
    const data = await ddbDocClient.send(new GetCommand(params));

    if (!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify("Item not found"),
      };
    }

    console.log(data);

    return {
      statusCode: 200,
      body: JSON.stringify(data.Item),
    };
  } catch (err) {
    console.error("Error retrieving item from DynamoDB", err);
    return {
      statusCode: 500,
      body: JSON.stringify("Error retrieving item from DynamoDB"),
    };
  }
};