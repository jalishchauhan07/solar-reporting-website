const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const user = require("./user");
const project = require("./project");
const db = require("./db/db");
const siteInfo = require("./model/siteInfo");
const { v4: uuidv4 } = require("uuid");
const operationList = require("./model/operationList");
const rtc = require("./model/recordTaskCompleted");
const report = require("./report");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use("/user", user);
app.use("/project", project);
app.use("/report", report);

app.post("/createSiteInfo", async (req, res) => {
  try {
    const { email, Photo, Location } = req.body;
    // console.log(Photo);
    const data = await siteInfo({
      id: uuidv4(),
      email: email,
      Photo: Photo,
      Location: Location,
      time: Date().toString(),
    }).save();
    if (data) {
      return res
        .status(200)
        .send({ status: 200, message: "Successfully Save Data" });
    } else {
      return res
        .status(400)
        .send({ status: 400, message: "Something went wrong" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: 500, message: "Internal Server" });
  }
});

app.get("/getSiteInfo", async (req, res) => {
  try {
    const data = await siteInfo.find();
    if (data) {
      return res.status(200).send({ status: 200, data: data });
    } else {
      return res
        .status(400)
        .send({ status: 400, message: "Something went wrong" });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ status: 500, message: "Internal Server Error" });
  }
});

app.post("/createTask", async (req, res) => {
  try {
    console.log(req.body);
    const { projectID, taskName, dueDate } = req.body;
    if (!projectID) {
      return res
        .status(400)
        .send({ status: 400, message: "Project id is required" });
    }

    const data = await operationList.updateOne(
      { projectID },
      {
        $push: {
          tasks: {
            taskName: taskName,
            completeTask: false,
            completeTime: dueDate,
          },
        },
      },
      { upsert: true }
    );

    if (data.modifiedCount) {
      return res
        .status(200)
        .send({ status: 200, message: "Successfully Save Data" });
    } else {
      return res
        .status(400)
        .send({ status: 400, message: "Something went wrong" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: 500, message: "Internal Server" });
  }
});

app.post("/getOperationList", async (req, res) => {
  try {
    const { projectID } = req.body;
    console.log(projectID);
    const data = await operationList.findOne({ projectID: projectID });
    console.log(data);
    if (data) {
      return res.status(200).send({ status: 200, data: data });
    } else {
      return res
        .status(400)
        .send({ status: 400, message: "Something went wrong" });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ status: 500, message: "Internal Server Error" });
  }
});

app.post("/completeTask", async (req, res) => {
  try {
    const { projectID, taskName, dueTask } = req.body;
    if (!projectID) {
      return res
        .status(400)
        .send({ status: 400, message: "Project id is required" });
    }

    const data = await rtc.updateOne(
      { projectID: projectID },
      {
        $set: { projectID: projectID, dueTask: dueTask },
        $push: {
          taskComplete: { taskName: taskName, time: new Date().toString() },
        },
      },
      { upsert: true }
    );
    if (data.modifiedCount) {
      return res
        .status(200)
        .send({ status: 200, message: "Successfully Save Data" });
    } else {
      return res
        .status(400)
        .send({ status: 400, message: "Something went wrong" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: 500, message: "Internal Server" });
  }
});

app.post("/setTask", async (req, res) => {
  try {
    // console.log(req.body);
    const { index, value, projectID } = req.body;
    if (!index) {
      return res
        .status(400)
        .send({ status: 400, message: "Check select task" });
    }

    const updateData = await operationList.updateOne(
      { projectID: projectID },
      {
        $set: {
          [`tasks.${index}.completeTask`]: value,
          [`tasks.${index}.updatedAt`]: Date.now(),
        },
      }
    );

    if (updateData.modifiedCount) {
      return res.status(200).send({ status: 200, message: "Set task" });
    } else {
      return res.status(400).send({ status: 400, message: "Task not found" });
    }
  } catch (err) {
    console.error("Error setting task:", err);
    return res
      .status(500)
      .send({ status: 500, message: "Internal server error" });
  }
});

app.get("/getCompleteTask", async (req, res) => {
  try {
    const { projectID } = req.body;
    const data = await rtc.findOne({ projectID: projectID });
    if (data) {
      return res.status(200).send({ status: 200, data: data });
    } else {
      return res
        .status(400)
        .send({ status: 400, message: "Something went wrong" });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ status: 500, message: "Internal Server Error" });
  }
});
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
