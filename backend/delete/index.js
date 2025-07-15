const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  console.log("Incoming event:", event);

  const category = event?.queryStringParameters?.category;

  if (!category) {
    return {
      statusCode: 400,
      body: JSON.stringify("Missing 'category' in query string"),
    };
  }

  const params = {
    TableName: "inventory",
    Key: {
      pk: category,
    },
  };

  try {
    await ddbDocClient.send(new DeleteCommand(params));
    return {
      statusCode: 204, // No Content
      body: JSON.stringify("Item deleted successfully"),
    };
  } catch (err) {
    console.error("Error deleting item from DynamoDB", err);
    return {
      statusCode: 500,
      body: JSON.stringify("Error deleting item from DynamoDB"),
    };
  }
};