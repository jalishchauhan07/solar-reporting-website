import { useState } from "react";
import styles from "./users.module.css";
import { useToast } from "@chakra-ui/react";
import proxy from "../../../../proxy";
import closeBtn from "../../../assets/close_FILL0_wght400_GRAD0_opsz24.svg";
// eslint-disable-next-line react/prop-types
const UserDataModal = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    address: "",
    typeOfUser: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(Object.assign({}, formData, { [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // You can add your logic here to handle the submitted data

    console.log("Submitted Data:", formData);
    const response = await fetch(proxy + "/user/createUser", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const response_data = await response.json();
    console.log(response_data);
    if (response.ok) {
      toast({
        title: "Successfully Add user ",
        description: response_data.message,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      onClose(); // Close the modal after submission
    } else {
      toast({
        title: "Error",
        description: response_data.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    onClose(); // Close the modal after submission
  };

  return (
    <div className={isOpen ? styles.modal_is_active : styles.modal_close}>
      <div
        className={styles.closeBtn}
        onClick={() => {
          onClose();
        }}
      >
        <img src={closeBtn} />
      </div>
      <h2 className={styles.commoneElement}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="76"
          height="76"
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
      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className="label">Name</label>
          <div className="control">
            <input
              type="text"
              className="input"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className="label">Email</label>
          <div className="control">
            <input
              type="email"
              className="input"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className="label">Password</label>
          <div className="control">
            <input
              type="password"
              className="input"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className="label">Phone Number</label>
          <div className="control">
            <input
              type="tel"
              className="input"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className="label">Gender</label>
          <div className="control">
            <select
              className="select"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className={styles.field}>
          <label className="label">Select Role</label>
          <div className="control">
            <select
              className="select"
              name="typeOfUser"
              value={formData.typeOfUser}
              onChange={handleChange}
              required
            >
              <option value="">Select Role </option>
              <option value="Admin">Admin</option>
              <option value="Supervisor">Supervisor</option>
            </select>
          </div>
        </div>

        <div className={styles.field}>
          <label className="label">Address</label>
          <div className="control">
            <input
              type="textarea"
              className="input"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.control}>
          <button type="submit" className={styles.btn}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserDataModal;
