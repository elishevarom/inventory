const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  UpdateCommand
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  console.log("Event received:", event);

  const listId = event?.queryStringParameters?.listId;

  if (!listId) {
    return {
      statusCode: 400,
      body: JSON.stringify("Missing 'listId' in query string"),
    };
  }

  let requestBody;
  try {
    requestBody = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify("Invalid JSON body"),
    };
  }

  const { attributeName, newValue } = requestBody;

  if (!attributeName || typeof newValue === 'undefined') {
    return {
      statusCode: 400,
      body: JSON.stringify("Missing 'attributeName' or 'newValue' in body"),
    };
  }

  const params = {
    TableName: "inventory",
    Key: { pk: listId },
    UpdateExpression: "set #attr = :val",
    ExpressionAttributeNames: {
      "#attr": attributeName
    },
    ExpressionAttributeValues: {
      ":val": newValue
    },
    ReturnValues: "UPDATED_NEW"
  };

  try {
    const data = await ddbDocClient.send(new UpdateCommand(params));
    return {
      statusCode: 200,
      body: JSON.stringify(data.Attributes),
    };
  } catch (err) {
    console.error("Error updating item in DynamoDB", err);
    return {
      statusCode: 500,
      body: JSON.stringify("Error updating item in DynamoDB"),
    };
  }
};