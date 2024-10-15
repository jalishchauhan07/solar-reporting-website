/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import styles from "./setting.module.css";
import { useEffect, useState } from "react";
import chart from "chart.js/auto";
import { useToast } from "@chakra-ui/react";
import proxy from "../../../../proxy";
import { useLocation } from "react-router-dom";
import logo from "../../../assets/logobalaji.png";
import { Line } from "react-chartjs-2";
import Map from "../../map";

export default function Setting() {
  const location = useLocation();
  const [data, setData] = useState(location.state);
  const toast = useToast();
  if (location.state) {
    localStorage.setItem("projectID", location.state.id);
    localStorage.setItem("data", JSON.stringify(location.state));
  }

  const [module, setModule] = useState(0);

  return (
    <div className={styles.container}>
      <div className={styles.dashboardContainer}>
        <header>
          <div className={styles.logo}>
            <img src={logo} alt="Logo" width={76} />
          </div>
          {/* <button className={styles.menu_toggle} aria-label="Menu">
          <span></span>
        </button> */}
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
                <a href="#">Site Photo</a>
              </li>
              <li
                onClick={() => {
                  setModule(2);
                }}
              >
                <a href="#">Work Progress</a>
              </li>
              <li
                onClick={() => {
                  setModule(3);
                }}
              >
                <a href="#">Operation </a>
              </li>
              <li
                onClick={() => {
                  setModule(5);
                }}
              >
                <a href="#">Report </a>
              </li>
            </ul>
          </nav>
        </header>
        <div className={styles.settingContainer}>
          {module === 0 ? (
            <ProjectDetails data={data && data} />
          ) : module === 1 ? (
            <SitePhoto toast={toast} id={localStorage.getItem("projectID")} />
          ) : module === 2 ? (
            <WorkProgress
              toast={toast}
              id={localStorage.getItem("projectID")}
              chartData={[
                { j1: 20 },
                { j1: 40 },
                { j1: 60 },
                { j1: 80 },
                { j1: 90 },
              ]}
            />
          ) : module === 3 ? (
            <ListOperation
              toast={toast}
              id={localStorage.getItem("projectID")}
            />
          ) : module === 4 ? (
            <TransferProject toast={toast} />
          ) : module === 5 ? (
            <Report
              toast={toast}
              id={localStorage.getItem("projectID")}
              projectName={localStorage.getItem("projectName")}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ProjectDetails({ data }) {
  console.log(data);
  return (
    <div className={styles.projectDetailsContainer}>
      <div className={styles.subProjectDetailsContainer}>
        <h2>{data.projectName}</h2>
        <Map
          location={
            (data && data.projectLocation) ||
            "24.179064177319027 72.41892388490099"
          }
        />
      </div>
    </div>
  );
}

function SitePhoto({ toast, id }) {
  async function handleSubmit() {
    const photo = document.getElementById("pics").files[0];
    const reader = new FileReader();
    reader.onload = async (event) => {
      const response = await fetch(proxy + "/createSiteInfo", {
        method: "post",
        "Content-Type": "application/json",
        body: JSON.stringify({
          email: localStorage.getItem("email"),
          Photo: reader.result,
          Location: location,
          ProjectID: id,
        }),
      });
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
    };
    reader.readAsDataURL(photo);
  }
  return (
    <div className={styles.siteContainer}>
      <div className={styles.subSiteContainer}>
        <label>Enter Operation Name</label>
        <input type="text" id="operationName" />
      </div>
      <div className={styles.subSiteContainer}>
        <label>Photo Upload</label>
        <input type="file" id="pics" accept=".jpg, .jpeg, .png" />
      </div>
      <div className={styles.btnSubmit}>
        <button className={styles.btn} onClick={handleSubmit} type="button">
          Submit
        </button>
      </div>
    </div>
  );
}

function getStartOfMonth() {
  const now = new Date();
  const month = now.getMonth() + 1; // Months are zero-based, so add 1
  const year = now.getFullYear().toString().slice(-2); // Get last two digits of the year
  return `${month.toString().padStart(2, "0")}-01-${year}`;
}

function WorkProgress({ chartData, toast, id }) {
  const [taskList, setTaskList] = useState([]);
  console.log(id);
  useEffect(() => {
    (async function () {
      const response = await fetch(proxy + "/getOperationList", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectID: id }),
      });
      console.log(response);
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
        console.log(response_data);
        setTaskList(response_data.data.tasks);
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
  const taskNames = taskList.map((task) => task.taskName);
  const completeTasks = taskList
    .filter((task) => {
      return task.updatedAt ? task.updatedAt : null;
    })
    .map((task) => task.updatedAt);

  const completeTimes = taskList
    .filter((task) => {
      return task.completeTime ? task.completeTime : null;
    })
    .map((task) => task.completeTime);

  console.log(taskNames);
  console.log(completeTasks);
  console.log(completeTimes);
  const data = {
    labels: taskNames,
    datasets: [
      {
        label: "Worked on time",
        data: completeTimes,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Current Working",
        data: completeTasks,
        fill: false,
        borderColor: "rgb(55, 12, 192)",
        tension: 0.1,
      },
    ],
  };

  // Optional configuration for the chart
  const options = {
    scales: {
      x: {
        offset: false, // Add space at the start and end of the x-axis
      },
      y: {
        beginAtZero: true,
        min: new Date(getStartOfMonth()).getTime(),
        ticks: {
          callback: function (value, index, values) {
            return new Date(value).toDateString();
          },
        },
      },
    },
  };

  return (
    <div className="workProgressContainer">
      <Line height={"100%"} data={data} options={options} />
    </div>
  );
}

function ListOperation({ id, toast }) {
  const [taskList, setTaskList] = useState([]);
  console.log(id);
  useEffect(() => {
    (async function () {
      const response = await fetch(proxy + "/getOperationList", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectID: id }),
      });
      console.log(response);
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
        console.log(response_data);
        setTaskList(response_data.data.tasks);
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

  return (
    <div className={styles.listOperationContainer}>
      <div className={styles.sublistOperationContainer}>
        {taskList.map((task, index) => {
          return (
            <div key={index} className={styles.operationCard}>
              <input
                type="checkbox"
                id={index}
                className={styles.input}
                onChange={async (event) => {
                  const response = fetch(proxy + "/setTask", {
                    method: "post",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      projectID: id,
                      value: event.target.checked,
                      index: event.target.id,
                    }),
                  });
                  console.log(event.target.checked);
                }}
              />
              <h5>{task.taskName}</h5>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TransferProject() {
  const [email, setEmail] = useState("");
  function handleChange(event) {
    setEmail(event.target.value);
  }
  function handleSubmit() {}
  return (
    <div className={styles.transferProjectContainer}>
      <div className={styles.reportContainer}>
        <div className={styles.field}>
          <label className="label">Email</label>
          <input type="text" name="email" onChange={handleChange} required />
        </div>
        <div className={styles.control}>
          <button className={styles.btn} type="button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

function Report({ id, toast, projectName }) {
  const [content, setContent] = useState();
  function handleChange(event) {
    setContent(event.target.value);
  }
  async function handleSubmit() {
    const response = await fetch(proxy + "/report/createReport", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectID: id,
        projectName: projectName,
        email: localStorage.getItem("email"),
        content: content,
      }),
    });
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
    <div className={styles.reportContainer}>
      <div className={styles.formContainer}>
        <div className={styles.field}>
          <label className="label">email</label>
          <input type="text" name="name" onChange={handleChange} required />
        </div>

        <div className={styles.field}>
          <label className="label">Report</label>
          <textarea name="report" onChange={handleChange} required></textarea>
        </div>
        <div className={styles.control}>
          <button className={styles.btn} type="button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
