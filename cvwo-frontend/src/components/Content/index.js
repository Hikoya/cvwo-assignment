import React, { useEffect, useState } from "react";
import { addTasks, getTasks, deleteTasks, updateTasks } from "../../api/tasks";
import { CreateTaskPopup } from "../../modals/CreateTask";
import { Card } from "../Card";
import { DropdownComponent } from "../DropdownComponent";
import styles from "./styles.module.css";
import { checkAuth } from "../../api/users";
import { useNavigate } from "react-router-dom";

export const ContentComponent = () => {
  const navigate = useNavigate();

  const [modal, setModal] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [previousList, setPreviousList] = useState([]);
  const [userID, setUserID] = useState(0);
  const [email, setEmail] = useState("");
  const [taskList, setTaskList] = useState([]);

  const toggle = () => {
    setModal(!modal);
  };

  const saveTask = (taskObj) => {
    if (userID === 0) {
      window.location.reload();
    } else {
      taskObj["userID"] = userID;
      addTasks(taskObj);

      setModal(false);
      window.location.reload();
    }
  };

  const deleteTask = (index) => {
    deleteTasks(index);
    window.location.reload();
  };

  const updateTask = (taskObj) => {
    updateTasks(taskObj);
    window.location.reload();
  };

  const populateCategoryList = (data) => {
    let arr = ["ALL"];
    data.map((obj) => arr.push(obj.category));

    if (arr) {
      let temp = arr.map((x) => (typeof x === "string" ? x.toUpperCase() : x));
      let result = Array.from(new Set(temp));

      setCategoryList(result);
    }
  };

  const selectedItem = (selected) => {
    if (selected === "ALL") {
      setTaskList(previousList);
    } else {
      let temp = [];
      previousList.forEach((obj) => {
        if (obj.category.toUpperCase() === selected.toUpperCase()) {
          temp.push(obj);
        }
      });

      setTaskList(temp);
    }
  };

  useEffect(() => {
    const check = () => {
      checkAuth().then((data) => {
        if (data.data) {
          let res = JSON.parse(data.data);
          let success = res.result;

          if (success === "success") {
            setEmail(res.email);
            setUserID(res.userID);

            let sent_obj = {};
            sent_obj["userID"] = res.userID;

            getTasks(sent_obj).then((data) => {
              if (data.data) {
                setTaskList(data.data);
                setPreviousList(data.data);
                populateCategoryList(data.data);
              }
            });
          } else {
            navigate("/login");
          }
        }
      });
    };

    check();
  }, [navigate]);

  return (
    <div>
      <div className={styles.header}>
        <h3>Get your stuff done, {email}</h3>
        <div className={styles.column_child}>
          <button
            className="btn btn-primary mt-2"
            onClick={() => setModal(true)}
          >
            Create Task
          </button>
        </div>
        <div className={styles.column_child}>
          <DropdownComponent data={categoryList} selected={selectedItem} />
        </div>
      </div>
      <div className={styles.task_container}>
        {taskList.map((obj) => (
          <Card
            key={obj.id}
            taskObj={obj}
            index={obj.id}
            deleteTask={deleteTask}
            updateListArray={updateTask}
          />
        ))}
      </div>
      <CreateTaskPopup toggle={toggle} modal={modal} save={saveTask} />
    </div>
  );
};
