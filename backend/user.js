const router = require("express").Router();
const users = require("./model/usersInfo");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/createUser", async (req, res) => {
  try {
    console.log();
    const { name, email, gender, phone, address, typeOfUser, password } =
      req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const userData = await users({
      id: uuidv4(),
      name: name,
      email: email,
      gender: gender,
      contactNo: phone,
      address: address,
      password: hashPassword,
      typeOfUser: typeOfUser,
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

router.get("/getUser", async (req, res) => {
  try {
    const data = await users.find({ typeOfUser: "Supervisor" });
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

router.post("/deleteUser", async (req, res) => {
  try {
    const { email } = req.body;
    const deleteData = await users.deleteOne({ email: email });
    console.log(deleteData);
    if (deleteData.deletedCount) {
      return res
        .status(200)
        .send({ status: 200, message: "Successfully delete user" });
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

router.post("/editUser", async (req, res) => {
  try {
    const { name, email, gender, contactNo, address, typeOfUser, password } =
      req.body;

    if (!email) {
      return res
        .status(400)
        .send({ status: 400, message: "Email Address is required" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const updateInfo = await users.updateOne(
      { email: email },
      {
        $set: {
          name: name,
          gender: gender,
          contactNo: contactNo,
          address: address,
          password: hashPassword,
          typeOfUser: typeOfUser,
          modifiedTime: new Date().toString(),
        },
      }
    );
    if (updateInfo.modifiedCount) {
      return res
        .status(200)
        .send({ status: 200, message: "Successfully update user infomation" });
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

router.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    const data = await users.findOne({ email: email });
    console.log(data);
    const hash = await bcrypt.compare(password, data.password);
    console.log(hash);
    if (data && hash) {
      const token = jwt.sign(
        JSON.stringify({ email: email, status: "online" }),
        "VCo61eDzj5KI2GvEd9hrOQrsjXE5jkny"
      );
      return res
        .status(200)
        .send({ status: 200, token: token, role: data.typeOfUser });
    } else {
      return res
        .status(400)
        .send({ status: 400, message: "Check you email address/ Password" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: 500, message: "Internal Server" });
  }
});

module.exports = router;
