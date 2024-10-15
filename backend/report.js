const router = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const report = require("./model/SupervisorReport");
router.post("/createReport", async (req, res) => {
  try {
    const { projectID, projectName, createTime, email, content } = req.body;
    const id = uuidv4();
    const userData = await report({
      id: id,
      email: email,
      projectID: projectID,
      projectName: projectName,
      content: content,
      createTime: createTime,
    }).save();

    if (userData) {
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

router.get("/getReport", async (req, res) => {
  try {
    const { projectID } = req.query;
    const data = await report.find();
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

module.exports = router;
