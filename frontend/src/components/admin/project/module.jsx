/* eslint-disable react/prop-types */
import { useState } from "react";
import Map from "./maps";
import styles from "./projectModel.module.css";
import { useToast } from "@chakra-ui/react";
import closeBtn from "../../../assets/close_FILL0_wght400_GRAD0_opsz24.svg";

const Modal = ({
  isOpen,
  onClose,
  refreshModule,
  projectName,
  projectLocation,
}) => {
  const [formData, setFormData] = useState({
    projectName: projectName,
    projectLocation: projectLocation,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("email");
    const projectLocation = localStorage.getItem("location");
    localStorage.removeItem("location");

    // You can add your logic here to handle the submitted data
    const response = await fetch("http://localhost:8080/project/editProject", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formData, email, projectLocation }),
    });
    const response_data = await response.json();
    if (response.ok) {
      toast({
        title: "Successfully Add Project ",
        description: response_data.message,
        status: "success",
        duration: 500,
        position: "top-right",
        isClosable: true,
      });

      onClose(); // Close the modal after submission
      refreshModule();
    } else {
      toast({
        title: "Error",
        description: response_data.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={isOpen ? styles.modal_is_active : styles.modal_close}>
        <div
          className={styles.closeBtn}
          onClick={() => {
            onClose();
          }}
        >
          <img src={closeBtn} alt="Close" />
        </div>
        <h2 className={styles.btn}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            fill="currentColor"
            className="bi bi-person-circle"
            viewBox="0 0 16 16"
          >
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
            <path
              fillRule="evenodd"
              d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
            />
          </svg>
        </h2>

        <div className={styles.field}>
          <input
            type="text"
            placeholder="Project Name"
            className={styles.input}
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.field}>
          <Map position={formData.projectLocation || "23.0225 72.5714"} />
        </div>

        <div className={styles.control}>
          <button type="submit" className={styles.controlBtn}>
            Edit Project
          </button>
        </div>
      </div>
    </form>
  );
};

export default Modal;
