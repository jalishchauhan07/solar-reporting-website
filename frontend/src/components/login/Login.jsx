import styles from "./login.module.css";
import { useState } from "react";
import logo from "../../assets/logobalaji.png";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import proxy from "../../../proxy";
export default function Login() {
  const toast = useToast();
  const [data, setData] = useState({ email: "", password: "" });
  const navigator = useNavigate();
  async function clickHandle() {
    const response = await fetch(proxy + "/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const response_data = await response.json();

    if (response.status === 200) {
      toast({
        title: "Login Error",
        description: "Successfully Login",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      localStorage.setItem("email", data.email);
      localStorage.setItem("token", response_data.token);
      navigator("/camera", { state: response_data.role });
    } else {
      toast({
        title: "Login Error",
        description: response.meesage,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  }
  function changeHandle(e) {
    const key = e.target.id;
    console.log(data);
    setData({ ...data, [`${key}`]: e.target.value });
  }
  return (
    <div className={styles.container}>
      <div className={styles.subContainer}> </div>
      <div className={styles.wrapper}>
        <div className={styles.commonElementStyle}>
          <img src={logo} height={100} />
        </div>

        <div className={styles.field}>
          <input
            onChange={changeHandle}
            type="text"
            id="email"
            placeholder="Enter your Email Address"
          />
        </div>
        <div className={styles.field}>
          <input
            onChange={changeHandle}
            type="password"
            id="password"
            placeholder="Enter you Password"
          />
        </div>
        <div className={styles.commonElementStyle}>
          <button type="button" className={styles.button} onClick={clickHandle}>
            Login
          </button>
        </div>
        <div className={styles.commonElementStyle}>
          <a href="#"> Forgot Password</a>
        </div>
      </div>
    </div>
  );
}
