const { MongoClient } = require("mongodb");

let client;

async function connectToDB() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
  }
  return client.db("wedding").collection("guests");
}

exports.handler = async () => {
  try {
    const collection = await connectToDB();
    const guests = await collection.find({}).sort({ timestamp: 1 }).toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(guests)
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ message: "שגיאת שרת" }) };
  }
};
