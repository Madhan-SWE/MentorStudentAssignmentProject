const express = require("express");
const mongodb = require("mongodb");
const cors = require("cors");
const dotenv = require("dotenv");;

const port = process.env.PORT || 3000;
const dbUrl = process.env.DBURL || "mongodb+srv://rcmk:Hm6hGfpOyzIqq6Gm@cluster0.pyaww.mongodb.net/<dbname>?retryWrites=true&w=majority";

const app = express();

const mongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectID;

app.use(express.json());
app.use(cors());
dotenv.config();

app.listen(port, () => {
  console.log("your app is running at port: ", port);
});

app.get("/students", async (req, resp) => {
  try {
    let client = await mongodb.connect(dbUrl);
    let db = client.db("studentMentorDb");
    let result = await db.collection("student").find();
    let res = await result.toArray();
    console.log("---", res);
    resp.status(200).json({ body: res, result: true });
  } catch (err) {
    console.log(err);
    resp.status(500).json({ message: "Internal server error", result: false });
  }
});

app.get("/students/:mentorId", async (req, resp) => {
  try {
    let client = await mongodb.connect(dbUrl);
    let db = client.db("studentMentorDb");
    let result = await db.collection("student").find({Mentor: req.params.mentorId});
    let res = await result.toArray();
    resp.status(200).json({ body: res, result: true });
  } catch (err) {
    console.log(err);
    resp.status(500).json({ message: "Internal server error", result: false });
  }
});

app.post("/students", async (req, resp) => {
  try {
    let client = await mongodb.connect(dbUrl);
    let db = client.db("studentMentorDb");
    let result = await db.collection("student").insertOne(req.body);

    resp
      .status(200)
      .json({ message: "Student added successfully", result: true });
  } catch (err) {
    console.log(err);
    resp.status(500).json({ message: "Internal server error", result: false });
  }
});

app.get("/mentor", async (req, resp) => {
  try {
    let client = await mongodb.connect(dbUrl);
    let db = client.db("studentMentorDb");
    let result = await db.collection("mentor").find();
    let res = await result.toArray();
    resp.status(200).json({ body: res, result: true });
  } catch (err) {
    console.log(err);
    resp.status(500).json({ message: "Internal server error", result: false });
  }
});

app.post("/mentor", async (req, resp) => {
  try {
    let client = await mongodb.connect(dbUrl);
    let db = client.db("studentMentorDb");
    let result = await db.collection("mentor").insertOne(req.body);
    resp
      .status(200)
      .json({ message: "Mentor added successfully", result: true });

    client.close();
  } catch (err) {
    console.log(err);
    resp.status(500).json({ message: "Internal server error", result: false });
  }
});

app.get("/mentor/:mentorId", async (req, resp) => {
  try {
    let client = await mongodb.connect(dbUrl);
    let db = client.db("studentMentorDb");
    let mentorId = req.params.mentorId;
    let pipeline = [
      {
        $match: {
          _id: ObjectId(mentorId),
        },
      },
      {
        $lookup: {
          from: "student",
          localField: "students",
          foreignField: "_id",
          as: "Mentees",
        },
      },
    ];
    let result = await db.collection("mentor").aggregate(pipeline);

    let res = await result.toArray();
    console.log(res);
    result.forEach((item) => console.log(item));
    resp.status(200).json({ result: true, body: res });
    client.close();
  } catch (err) {
    console.log(err);
    resp.status(500).json({ message: "Internal server error", result: false });
  }
});

app.put("/mentor/:mentorId", async (req, resp) => {
  try {
    let client = await mongodb.connect(dbUrl);
    let db = client.db("studentMentorDb");
    let mentorId = req.params.mentorId;
    let MentorName = req.body.mentorName
    console.log(MentorName);
    let studentId = req.body.studentId;

    result = db.collection("student").findOneAndUpdate(
      {
        _id: ObjectId(studentId),
      },
      {
        $set: {
          Mentor: mentorId,
          MentorName: MentorName
        },
      }
    );
    resp
      .status(200)
      .json({ message: "Record Updated Successfully", result: true });

    client.close();
  } catch (err) {
    console.log(err);
    resp.status(500).json({ message: "Internal server error", result: false });
  }
});
