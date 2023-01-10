"use strict";
const AWS = require("aws-sdk");
const uuid = require("uuid");

const docClient = new AWS.DynamoDB.DocumentClient();

// Register client
module.exports.createUser = async (event, context, callback) => {
  const data = JSON.parse(event.body);
  console.log("data for post", data);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v4(),
      email: data.email,
      name: data.name,
      password: data.password,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    },
  };

  console.log("params", params);

  await docClient.put(params).promise();

  return { statusCode: 200, body: JSON.stringify(params.Item) };
};

// login client
module.exports.login = async (event, context, callback) => {
  const data = JSON.parse(event.body);
  console.log("data for post", data);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    ExpressionAttributeValues: {
      ":email": data.email,
      ":password": data.password,
    },
    FilterExpression: "email = :email and password = :password",
  };

  console.log("params", params);

  const result = await docClient.scan(params).promise();

  if (result["Count"] > 0) {
    return { statusCode: 200, body: JSON.stringify(result["Items"]) };
  } else {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Invalid credentials" }),
    };
  }
};

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v4.0! Your function executed successfully!",
        input: event,
      },
      null,
      2
    ),
  };
};
