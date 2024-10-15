import styles from "./users.module.css";
import Modal from "./model";
import proxy from "../../../../proxy";
import { useEffect, useState } from "react";
export default function User() {
  const [open, setOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    (async function () {
      const response = await fetch(proxy + "/user/getUser");
      if (response.ok) {
        const response_data = await response.json();
        console.log(response_data);
        setUserInfo(response_data.data);
      } else {
        console.log("Error");
      }
    })();
  }, []);
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  console.log(userInfo);
  return (
    <div className={styles.container}>
      <h1>User </h1>
      <div className={styles.subContainer}>
        {userInfo &&
          userInfo.map((el, index) => {
            return (
              <div className={styles.card} key={index}>
                <h4>{el.name}</h4>
                <h5>{el.typeOfRole}</h5>
                <div className={styles.icon}></div>
              </div>
            );
          })}
      </div>
      <div className={styles.footer}>
        <button className={styles.btn} type="button" onClick={handleOpen}>
          Add User
        </button>
      </div>
      <div className={styles.modalContainer}>
        <Modal isOpen={open} onClose={handleClose} />
      </div>
    </div>
  );
}
