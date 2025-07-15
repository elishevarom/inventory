const {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
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

  try {
    // Step 1: Get the current list
    const getResult = await ddbDocClient.send(
      new GetCommand({
        TableName: "inventory",
        Key: { pk: category },
        ProjectionExpression: "#list",
        ExpressionAttributeNames: { "#list": "list" },
      })
    );

    let currentList = getResult.Item?.list || [];

    // Step 2: Remove the itemName (trimmed) from the list
    const trimmedItemName = itemName.trim();
    const updatedList = currentList.filter((item) => item !== trimmedItemName);

    // Step 3: Update the list attribute with the filtered list
    const updateResult = await ddbDocClient.send(
      new UpdateCommand({
        TableName: "inventory",
        Key: { pk: category },
        UpdateExpression: "SET #list = :updatedList",
        ExpressionAttributeNames: { "#list": "list" },
        ExpressionAttributeValues: { ":updatedList": updatedList },
        ReturnValues: "UPDATED_NEW",
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(updateResult.Attributes),
    };
  } catch (err) {
    console.error("Error deleting item from DynamoDB", err);
    return {
      statusCode: 500,
      body: JSON.stringify("Error deleting item from DynamoDB"),
    };
  }
};
