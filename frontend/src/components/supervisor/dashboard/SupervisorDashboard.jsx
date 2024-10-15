import styles from "./supervisor.module.css";
import { useEffect, useState } from "react";
import logo from "../../../assets/logobalaji.png";

import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
export default function SupervisorDashBoard() {
  const [data, setData] = useState();
  const toast = useToast();
  useEffect(() => {
    (async function () {
      const response = await fetch(
        "http://localhost:8080/project/getProjectForSupervisor",
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: localStorage.getItem("email") }),
        }
      );
      const response_data = await response.json();
      console.log(response_data);
      if (response.ok) {
        toast({
          title: "Successfully Project ",
          description: response_data.message,
          status: "success",
          position: "top-right",

          duration: 500,
          isClosable: true,
        });
        setData(response_data.data);
      } else {
        toast({
          title: "Error",
          description: response_data.message,
          status: "error",
          position: "top-right",
          duration: 500,
          isClosable: true,
        });
      }
    })();
  }, []);

  const navigator = useNavigate();

  // function mouseHandle(event) {
  //   console.log(event);
  //   console.log("mouse");
  // }

  function handleClick(event) {
    alert(event);
    console.log(event);
    const projectId = data[Number(event.target.id)].id;
    const projectLocation = data[Number(event.target.id)].location;
    const projectName = data[Number(event.target.id)].projectName;
    navigator("/supervisorSetting", {
      state: {
        id: projectId,
        projectName: projectName,
        projectLocation: projectLocation,
      },
    });
  }

  return (
    <div className={styles.container}>
      {/* <div className={styles.menuContainer}>
        <div>
          <img src={menu_fill} />
        </div>
        <div>
          <img src={dashboard} />
        </div>

        <div>
          <img src={logout} />
        </div>
      </div> */}
      <header>
        <div className={styles.logo}>
          <img src={logo} alt="Logo" width={76} />
        </div>
        {/* <button className={styles.menu_toggle} aria-label="Menu">
          <span></span>
        </button> */}
        <nav>
          <ul className={styles.menu}>
            <li>
              <a href="#">Home</a>
            </li>

            <li>
              <a href="#">Logout</a>
            </li>
          </ul>
        </nav>
      </header>
      <div className={styles.dashboardContainer}>
        <div className={styles.header}></div>
        <div className={styles.projectListContainer}>
          {data &&
            data.map((el, index) => {
              return (
                <div
                  key={index}
                  className={styles.card}
                  onClick={handleClick}
                  id={index}
                >
                  <div className={styles.header_}>
                    <h2 className={styles.headerProject}>{el.projectName}</h2>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
