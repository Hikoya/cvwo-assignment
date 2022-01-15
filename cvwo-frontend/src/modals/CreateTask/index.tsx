import React, { MouseEventHandler, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

type Props = {
  modal: boolean;
  toggle: MouseEventHandler<any> | undefined;
  save: MouseEventHandler<any>;
};

export const CreateTaskPopup = ({ modal, toggle, save }: Props) => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (name === "taskName") {
      setTaskName(value);
    } else if (name === "description") {
      setDescription(value);
    } else {
      setCategory(value);
    }
  };

  const onClickEvent = (taskObj: any) => {
    save(taskObj);
  };

  const handleSave = (e: any) => {
    e.preventDefault();

    if (taskName === "" || description === "" || category === ""){
      alert("Please fill in all required fields");
    }
    else{
      let taskObj = {};
      taskObj["taskName"] = taskName;
      taskObj["description"] = description;
      taskObj["category"] = category;
      onClickEvent(taskObj);
  
      setTaskName("");
      setDescription("");
      setCategory("");
    }
  };

  return (
    <Modal isOpen={modal} toggle={toggle}>
      <ModalHeader toggle={toggle}>Create Task</ModalHeader>
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
              required
            ></input>
          </div>
          <br />
          <div className="form-group">
            <label>Description</label>
            <textarea
              rows={4}
              className="form-control"
              value={description}
              onChange={handleChange}
              name="description"
              required
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
              required
            ></input>
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSave}>
          Create
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};
