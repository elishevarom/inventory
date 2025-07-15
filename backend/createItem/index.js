const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  console.log("Event received:", event);

  const category = event?.queryStringParameters?.category;

  if (!category) {
    return {
      statusCode: 400,
      body: JSON.stringify("Missing 'category' in query string"),
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

  const { itemName } = requestBody;

  if (!itemName || itemName.trim() === "") {
    return {
      statusCode: 400,
      body: JSON.stringify("Missing or empty 'itemName' in request body"),
    };
  }

  const params = {
    TableName: "inventory",
    Key: { pk: category },
    // Append itemName to list attribute, or create list if it doesn't exist
    UpdateExpression: "SET #list = list_append(if_not_exists(#list, :empty_list), :new_item)",
    ExpressionAttributeNames: {
      "#list": "list",
    },
    ExpressionAttributeValues: {
      ":new_item": [itemName.trim()],
      ":empty_list": [],
    },
    ReturnValues: "UPDATED_NEW",
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