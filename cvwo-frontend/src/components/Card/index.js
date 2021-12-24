import React, { useState } from "react";
import { colors } from "../../constants";
import { EditTaskPopup } from "../../modals/EditTask";
import styles from "./styles.module.css";

export const Card = ({ taskObj, index, deleteTask, updateListArray }) => {
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
  };

  const updateTask = (obj) => {
    updateListArray(obj);
    setModal(false);
  };

  const handleDelete = () => {
    deleteTask(index);
  };

  return (
    <div className={`${styles.card_wrapper} me-5`}>
      <div
        className={styles.card_top}
        style={{
          backgroundColor: colors[index % colors.length].primaryColor,
        }}
      ></div>
      <div className={styles.task_holder}>
        <span
          className={styles.card_header}
          style={{
            backgroundColor: colors[index % colors.length].secondaryColor,
            borderRadius: "10px",
          }}
        >
          {taskObj.taskName}
        </span>
        <p className={`${styles.card_content} mt-2 ms-2`}>
          {taskObj.description}
        </p>

        <div style={{ position: "absolute", right: "20px", bottom: "20px" }}>
          <span
            className="card-header me-3"
            style={{
              backgroundColor: colors[index % colors.length].secondaryColor,
              borderRadius: "5px",
            }}
          >
            {taskObj.category}
          </span>
          <i
            className="far fa-edit me-3"
            style={{
              color: colors[index % colors.length].primaryColor,
              cursor: "pointer",
            }}
            onClick={() => setModal(true)}
          ></i>
          <i
            className="fas fa-trash-alt"
            style={{
              color: colors[index % colors.length].primaryColor,
              cursor: "pointer",
            }}
            onClick={handleDelete}
          ></i>
        </div>
      </div>
      <EditTaskPopup
        modal={modal}
        toggle={toggle}
        updateTask={updateTask}
        taskObj={taskObj}
        index={index}
      />
    </div>
  );
};
