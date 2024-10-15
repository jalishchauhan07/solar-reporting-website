/* eslint-disable react/prop-types */
import logo from "../../../assets/logobalaji.png";
import styles from "./projectSetting.module.css";
import { useToast } from "@chakra-ui/react";
import proxy from "../../../../proxy";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Map from "../../map";

export default function ProjectSetting() {
  const location = useLocation();
  const navigator = useNavigate();
  const [module, setModule] = useState(0);
  const [data, setData] = useState(location.state?.info || {});

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(location.state));
    setData(location.state?.info || {});
  }, [location.state]);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header>
          <div className={styles.logo}>
            <img
              src={logo}
              alt="Logo"
              width={76}
              onClick={() => {
                navigator("/admin");
              }}
            />
          </div>
          <nav>
            <ul className={styles.menu}>
              <li
                onClick={() => {
                  setModule(0);
                }}
              >
                <a href="#">Project</a>
              </li>
              <li
                onClick={() => {
                  setModule(1);
                }}
              >
                <a href="#">Add User</a>
              </li>
              <li
                onClick={() => {
                  setModule(2);
                }}
              >
                <a href="#">Completed Task</a>
              </li>
              <li
                onClick={() => {
                  setModule(3);
                }}
              >
                <a href="#">Uncompleted Task</a>
              </li>
              <li
                onClick={() => {
                  setModule(4);
                }}
              >
                <a href="#">Add List</a>
              </li>
              <li
                onClick={() => {
                  setModule(5);
                }}
              >
                <a href="#">List Report</a>
              </li>
            </ul>
          </nav>
        </header>
        {module === 0 ? (
          <ProjectDetails data={data} />
        ) : module === 1 ? (
          <AddUsers data={data} />
        ) : module === 2 ? (
          <CompletedTask data={data} />
        ) : module === 3 ? (
          <UnCompletedTask data={data} />
        ) : module === 4 ? (
          <AddList />
        ) : module === 5 ? (
          <Report />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

function ProjectDetails({ data }) {
  console.log(data);
  return (
    <div className={styles.projectContainer}>
      <h2>{data.name}</h2>
      <Map
        location={
          (data && data.location) || "24.179064177319027 72.41892388490099"
        }
      />
    </div>
  );
}

function AddUsers({ data }) {
  const [input, setInput] = useState({ name: "" });
  async function changeHandle(event) {
    event.preventDefault();
    const response = await fetch(proxy + "/project/setUser", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectID: data.id,
        emailAddress: input.name,
      }),
    });
    console.log(response);
  }

  return (
    <div className={styles.addUserContainer}>
      <div className={styles.card}>
        <div className={styles.content}>
          <label>Enter Email </label>
          &nbsp;
          <input
            type="text"
            id="email"
            onChange={(event) => setInput({ name: event.target.value })}
          />
        </div>
      </div>
      <div className={styles.card}>
        <button
          type="submit"
          onClick={changeHandle}
          style={{
            color: "white",
            backgroundColor: "green",
            width: "6rem",
            height: "3rem",
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

function CompletedTask({ data }) {
  const [taskList, setTaskList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    (async function () {
      try {
        const response = await fetch("http://localhost:8080/getOperationList", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectID: data.id,
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const response_data = await response.json();
        console.log(response_data.data);
        setTaskList(response_data.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!taskList) {
    return <div>Error: Failed to fetch data</div>;
  }

  return (
    <div className={styles.completedTaskContainer}>
      {taskList.tasks
        .filter((task) => task.completeTask)
        .map((task, index) => (
          <div className={styles.compeletedCard} key={index}>
            <h2>{task.taskName}</h2>
            <input type="checkbox" checked />
          </div>
        ))}
    </div>
  );
}

function UnCompletedTask({ data }) {
  const [taskList, setTaskList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    (async function () {
      try {
        const response = await fetch("http://localhost:8080/getOperationList", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectID: data.id,
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const response_data = await response.json();
        console.log(response_data.data);
        setTaskList(response_data.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!taskList) {
    return <div>Error: Failed to fetch data</div>;
  }

  return (
    <div className={styles.completedTaskContainer}>
      {taskList.tasks
        .filter((task) => !task.completeTask)
        .map((task, index) => (
          <div className={styles.compeletedCard} key={index}>
            <h2>{task.taskName}</h2>
            <input type="checkbox" />
          </div>
        ))}
    </div>
  );
}

function AddList({ data }) {
  const [taskName, setTaskName] = useState({ name: "", date: null });
  const toast = useToast();

  async function ClickHandle() {
    const response = await fetch(proxy + "/createTask", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectID: data.id,
        taskName: taskName.name,
        dueDate: Date.parse(taskName.date),
      }),
    }).catch((err) => console.log(err));

    const response_data = await response.json();
    if (response.ok) {
      toast({
        title: "Successfully Operation List ",
        description: response_data.message,
        status: "success",
        position: "top-right",

        duration: 500,
        isClosable: true,
      });
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
  }
  return (
    <div className={styles.addUserContainer}>
      <div className={styles.card}>
        <div className={styles.content}>
          <label>Enter Task Name</label>
          <input
            type="text"
            id="name"
            onChange={(event) => {
              setTaskName(
                Object.assign({}, taskName, {
                  [event.target.id]: event.target.value,
                })
              );
            }}
          />
        </div>
        <div className={styles.content}>
          <label>Select Due Date</label>
          <input
            type="date"
            id="dueDate"
            onChange={(event) => {
              setTaskName(
                Object.assign({}, taskName, {
                  [event.target.id]: event.target.value,
                })
              );
            }}
          />
        </div>
      </div>
      <button
        type="button"
        onClick={ClickHandle}
        style={{ color: "white", backgroundColor: "green" }}
      >
        add List
      </button>
    </div>
  );
}

function Report() {
  const [data, setData] = useState(null);
  const toast = useToast();

  // eslint-disable-next-line no-unused-vars
  const [AddNewProject, setAddNewProject] = useState(false);

  useEffect(() => {
    (async function () {
      const response = await fetch(
        proxy +
          "/report/getReport?projectID=" +
          localStorage.getItem("projectID"),
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const response_data = await response.json();
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
  console.log(data);
  if (localStorage.getItem("token")) {
    return (
      <div className={styles.container}>
        <div className={styles.subContainer}>
          {data &&
            data.map((el, index) => {
              return (
                // eslint-disable-next-line react/jsx-key
                <div className={styles.reportCard} key={index}>
                  <h4>{el.email && el.email}</h4>
                  <h6>{el.content}</h6>
                  <h7>{el.createTime}</h7>
                </div>
              );
            })}
        </div>
      </div>
    );
  } else {
    navigator("/");
  }
}
