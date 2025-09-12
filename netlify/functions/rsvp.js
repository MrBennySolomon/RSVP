const { MongoClient } = require("mongodb");

let client;

async function connectToDB() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
  }
  return client.db("wedding").collection("guests");
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { name, attendance } = JSON.parse(event.body);

    if (!name || !attendance) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "נא למלא את כל השדות" })
      };
    }

    const collection = await connectToDB();

    await collection.updateOne(
      { name },
      { $set: { name, attendance, timestamp: new Date() } },
      { upsert: true }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "התשובה נשמרה בהצלחה" })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ message: "שגיאת שרת" }) };
  }
};
