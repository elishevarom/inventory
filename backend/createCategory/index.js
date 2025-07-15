const {
    DynamoDBClient
  } = require("@aws-sdk/client-dynamodb");
  const {
    DynamoDBDocumentClient,
    PutCommand
  } = require("@aws-sdk/lib-dynamodb");
  
  const client = new DynamoDBClient({});
  const ddbDocClient = DynamoDBDocumentClient.from(client);
  
  exports.handler = async (event) => {
    console.log("Raw event:", event);
  
    let body;
    try {
      body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } catch (err) {
      console.error("Invalid JSON body:", event.body);
      return {
        statusCode: 400,
        body: JSON.stringify("Invalid JSON"),
      };
    }
  
    const { category } = body;
  
    if (!category) {
      return {
        statusCode: 400,
        body: JSON.stringify("Missing required fields: category"),
      };
    }
  
    const params = {
      TableName: "inventory",
      Item: {
        pk: category,
        created_at: new Date().toISOString(),
      },
    };
  
    console.log("DynamoDB PutCommand params:", params);
  
    try {
      await ddbDocClient.send(new PutCommand(params));
      return {
        statusCode: 200,
        body: JSON.stringify("Item created successfully"),
      };
    } catch (err) {
      console.error("Error writing to DynamoDB:", err);
      return {
        statusCode: 500,
        body: JSON.stringify("Error creating item in DynamoDB"),
      };
    }
  };