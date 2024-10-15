import styles from "./dashboard.module.css";
import Menu from "../menu/menu";

import Project from "../project/project";
import { useState } from "react";
import User from "../users/users";
function Dashboard() {
  const [module, setModule] = useState(1);
  function ManageRouter(currentRoute) {
    console.log(currentRoute);
    setModule(currentRoute);
  }
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.logo}>LifeCare</div>
      </header>
      <main className={styles.main}>
        <Menu setModule={ManageRouter} />
        {module == 1 ? <Project /> : <User />}

        {/* <div className={styles.content}>
          <div className={styles.cards}>
            <div className={styles.card}>
              <h3>Supervisor</h3>
              <p>856</p>
            </div>
            <div className={styles.card}>
              <h3>Projects</h3>
              <p>2,564</p>
            </div>
          </div>
        </div> */}
      </main>
    </div>
  );
}

export default Dashboard;
