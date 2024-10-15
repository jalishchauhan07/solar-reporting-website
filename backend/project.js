const router = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const project = require("./model/projectInfo");
const user = require("./model/usersInfo");

router.post("/createProject", async (req, res) => {
  try {
    const { projectName, projectLocation, email } = req.body;
    const projectInfo = await project({
      id: uuidv4(),
      projectName: projectName,
      location: projectLocation,
      createTime: new Date().toString(),
    }).save();

    if (projectInfo) {
      return res
        .status(200)
        .send({ status: 200, message: "Successfully saved data" });
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

router.post("/setUser", async (req, res) => {
  try {
    console.log(req.body);
    const { projectID, emailAddress } = req.body;
    const updateProjectInfo = await project.updateOne(
      { id: projectID },
      { $push: { users: emailAddress } }
    );
    if (updateProjectInfo.modifiedCount) {
      return res.status(200).send({ status: 200, message: "Add User " });
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

router.get("/getProject", async (req, res) => {
  try {
    // const { email } = req.body;
    // if (!email) {
    //   return res
    //     .status(400)
    //     .send({ status: 400, message: "Email is Required" });
    // }
    const projectData = await project.find();
    if (projectData) {
      return res.status(200).send({ status: 200, data: projectData });
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

router.post("/deleteProject", async (req, res) => {
  try {
    console.log(req.body);
    const { id } = req.body;
    const deleteData = await project.deleteOne({ id: id });
    console.log(deleteData);
    if (deleteData.deletedCount) {
      return res
        .status(200)
        .send({ status: 200, message: "Successfully delete Project" });
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

router.post("/editProject", async (req, res) => {
  try {
    const { id, projectName, projectLocation } = req.body;
    if (!id) {
      return res
        .status(400)
        .send({ status: 400, message: "Project id is required" });
    }
    const updateInfo = await updateOne(
      { id: id },
      {
        $set: {
          projectName: projectName,
          projectLocation: projectLocation,
        },
      }
    );
    if (updateInfo.modifiedCount) {
      return res.status(200).send({
        status: 200,
        message: "Successfully update Project infomation",
      });
    } else {
      return res
        .status(400)
        .send({ status: 400, message: "data is already up to date" });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ status: 500, message: "Internal Server Error" });
  }
});

router.post("/getProjectForSupervisor", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .send({ status: 400, message: "Email is required" });
    }

    const userData = await user.findOne({ email: email });
    if (!userData) {
      return res.status(404).send({ status: 404, message: "User not found" });
    }

    const data_ = [];
    for (const projectid of userData.project) {
      const data = await project.findOne({ id: projectid });
      if (data) {
        data_.push(data);
      }
    }

    return res.status(200).send({ status: 200, data: data_ });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ status: 500, message: "Internal Server Error" });
  }
});

module.exports = router;
