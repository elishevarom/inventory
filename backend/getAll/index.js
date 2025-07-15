const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  console.log("Event received:", event);

  const params = {
    TableName: "inventory"
  };

  try {
    const data = await ddbDocClient.send(new ScanCommand(params));
    
    if (!data.Items || data.Items.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify("No items found"),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data.Items),
    };
  } catch (err) {
    console.error("Error retrieving items from DynamoDB", err);
    return {
      statusCode: 500,
      body: JSON.stringify("Error retrieving items from DynamoDB"),
    };
  }
};