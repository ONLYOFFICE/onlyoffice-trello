import React, { useState } from "react";
import Select, { components } from "react-select";
import "./styles.css";

const tOptions = [
  { value: "name", label: "Name" },
  { value: "size", label: "Size" },
  { value: "type", label: "Type" },
  { value: "modified", label: "Last Modified" },
];

const CheckIcon = () => {
  return (
    <span className="checkicon">
      <div className="checkicon_tip"></div>
      <div className="checkicon_base"></div>
    </span>
  );
};

const Menu = (props: any) => {
  const [selected, setSelected] = useState<0 | 1 | 2>(0);
  return (
    <>
      <components.Menu {...props}>
        <div>
          <div>{props.children}</div>
          <hr />
          <div>
            <button onClick={() => setSelected(1)} className="dropdown-button">
              Ascending
              <div style={{width: '10%'}}>
                {selected == 1 && <CheckIcon />}
              </div>
            </button>
            <button onClick={() => setSelected(2)} className="dropdown-button">
              Descending
              <div style={{width: '10%'}}>
                {selected == 2 && <CheckIcon />}
              </div>
            </button>
          </div>
        </div>
      </components.Menu>
    </>
  );
};

export const Dropdown = () => {
  const [selected, setSelected] = useState<{
    value: string;
    label: string;
  } | null>(null);
  return (
    <div style={{ display: "flex" }}>
      <Select
        placeholder={"Select"}
        styles={{
          control: (css) => {
            return {
              ...css,
              width: '10rem',
            }
          }
        }}
        options={tOptions}
        defaultValue={selected}
        isSearchable={false}
        onChange={setSelected}
        components={{ Menu }}
      />
    </div>
  );
};
