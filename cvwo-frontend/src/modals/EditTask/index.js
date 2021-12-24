import React, { useEffect, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

export const EditTaskPopup = ({
  modal,
  toggle,
  updateTask,
  taskObj,
  index,
}) => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "taskName") {
      setTaskName(value);
    } else if (name === "description") {
      setDescription(value);
    } else {
      setCategory(value);
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    let tempObj = {};
    tempObj["id"] = index;
    tempObj["taskName"] = taskName;
    tempObj["description"] = description;
    tempObj["category"] = category;

    updateTask(tempObj);
  };

  useEffect(() => {
    setTaskName(taskObj.taskName);
    setDescription(taskObj.description);
    setCategory(taskObj.category);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Modal isOpen={modal} toggle={toggle}>
      <ModalHeader toggle={toggle}>Edit Task</ModalHeader>
      <ModalBody>
        <form>
          <div className="form-group">
            <label>Task Name</label>
            <input
              type="text"
              className="form-control"
              value={taskName}
              onChange={handleChange}
              name="taskName"
            ></input>
          </div>
          <br />
          <div className="form-group">
            <label>Description</label>
            <textarea
              rows="4"
              className="form-control"
              value={description}
              onChange={handleChange}
              name="description"
            ></textarea>
          </div>
          <br />
          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              className="form-control"
              value={category}
              onChange={handleChange}
              name="category"
            ></input>
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleUpdate}>
          Update
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};
