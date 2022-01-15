import React, { useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";

type Props = {
  data: any;
  selected: any;
};

export const DropdownComponent = ({ data, selected }: Props) => {
  const [dropdown, setDropdown] = useState(false);
  const toggleDropdown = () => {
    setDropdown(!dropdown);
  };

  //I am so sorry for using any here
  const handleClick = (e: any) => {
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
