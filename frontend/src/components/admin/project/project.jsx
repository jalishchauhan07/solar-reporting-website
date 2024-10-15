import styles from "./project.module.css";
import { useEffect, useState } from "react";
import ProjectModal from "./projectModel";
import proxy from "../../../../proxy";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import editBtn from "../../../assets/edit_FILL0_wght400_GRAD0_opsz24.svg";
import deleteBtn from "../../../assets/delete_FILL0_wght400_GRAD0_opsz24.svg";
import Modal from "./module";

export default function Project() {
  const [data, setData] = useState([]);
  const navigator = useNavigate();
  const [_open, _setOpen] = useState(false);
  const toast = useToast();
  const [tempData, SetTempData] = useState({ projectID: "", location: "" });
  const [refresh, setRefresh] = useState(0);
  const [open, setOpen] = useState(false);
  const [, setAddNewProject] = useState(false);

  function refreshModule() {
    setAddNewProject(true);
  }

  function refreshPage() {
    setRefresh(1);
  }

  useEffect(() => {
    (async function () {
      const response = await fetch(proxy + "/project/getProject", {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
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
        console.log(response_data);
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

  function clickHandle(event) {
    const projectName = data[Number(event.target.id)].projectName;
    const projectLocation = data[Number(event.target.id)].location;
    const projectId = data[Number(event.target.id)].id;
    navigator("/projectSetting", {
      state: {
        info: { name: projectName, location: projectLocation, id: projectId },
      },
    });
  }
  if (localStorage.getItem("token")) {
    const handleClose = () => {
      setOpen(false);
    };
    const handleClose_ = () => {
      _setOpen(false);
    };

    const handleOpen = () => {
      setOpen(true);
    };
    console.log(data);
    return (
      <div className={styles.container}>
        <div className={styles.subContainer}>
          {data &&
            data.map((el, index) => {
              return (
                // eslint-disable-next-line react/jsx-key
                <div className={styles.card}>
                  <div
                    id={index}
                    key={index}
                    onClick={clickHandle}
                    className={styles.content}
                  >
                    <h4>{el.projectName && el.projectName}</h4>

                    <h5>Work Progress:</h5>
                    <div className={styles.progressBar}>
                      <div className={styles.subProgressBar}></div>
                    </div>
                  </div>
                  <div className={styles.controlBtn}>
                    <img
                      id={index}
                      src={editBtn}
                      onClick={async (event) => {
                        SetTempData(
                          Object.assign({}, tempData, {
                            ["projectID"]:
                              data[Number(event.target.id)].projectName,
                            ["location"]:
                              data[Number(event.target.id)].location,
                          })
                        );
                        _setOpen(true);
                      }}
                    />
                    <img
                      id={index}
                      src={deleteBtn}
                      onClick={async (event) => {
                        alert(event.target.id);

                        const response = await fetch(
                          proxy + "/project/deleteProject",
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              id: data[Number(event.target.id)].id,
                            }),
                          }
                        );
                        const response_data = await response.json();
                        if (response_data.status === 200) {
                          toast({
                            title: "SuccessFully",
                            description: "Successfully Delete Data",
                            status: "success",
                            duration: 500,
                            isClosable: true,
                          });
                          refreshPage();
                        } else {
                          toast({
                            title: " Error",
                            description: response_data.message,
                            status: "error",
                            duration: 500,
                            isClosable: true,
                          });
                        }
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
        <div className={styles.footer}>
          <div>
            <button className={styles.btn} type="button" onClick={handleOpen}>
              Add Project
            </button>
          </div>
        </div>
        <div className={styles.modalContainer}>
          <ProjectModal
            isOpen={open}
            onClose={handleClose}
            refreshModule={refreshModule}
          />
          <Modal
            isOpen={_open}
            onClose={handleClose_}
            projectName={tempData && tempData.projectID}
            projectLocation={tempData && tempData.location}
          />
        </div>
      </div>
    );
  } else {
    navigator("/");
  }
}
