import React, { useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";

export const DropdownComponent = ({ data, selected }) => {
  const [dropdown, setDropdown] = useState(false);
  const toggleDropdown = () => {
    setDropdown(!dropdown);
  };

  const handleClick = (e) => {
    selected(e.target.innerHTML);
  };

  return (
    <Dropdown isOpen={dropdown} toggle={toggleDropdown}>
      <DropdownToggle caret>Search by Categories</DropdownToggle>
      <DropdownMenu end>
        {data.map((obj) => (
          <DropdownItem key={obj} onClick={handleClick}>
            {obj}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};
