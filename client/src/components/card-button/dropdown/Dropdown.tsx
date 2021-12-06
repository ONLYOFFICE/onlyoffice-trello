import React, { useState } from "react";
import Select, { components } from "react-select";
import { useStore } from "../../../context";
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
  const store = useStore();

  const [selected, setSelected] = useState<null | "ASC" | "DESC">(() => {
    return store.filters.sortOrder || null;
  });

  const handleSortOrder = (order: "ASC" | "DESC") => {
    store.filters.sortOrder = order;
    setSelected(order);
  };

  return (
    <>
      <components.Menu {...props}>
        <div>
          <div>{props.children}</div>
          <hr />
          <div>
            <button
              onClick={() => handleSortOrder("ASC")}
              className="dropdown-button"
            >
              Ascending
              <div style={{ width: "10%" }}>
                {selected == "ASC" && <CheckIcon />}
              </div>
            </button>
            <button
              onClick={() => handleSortOrder("DESC")}
              className="dropdown-button"
            >
              Descending
              <div style={{ width: "10%" }}>
                {selected == "DESC" && <CheckIcon />}
              </div>
            </button>
          </div>
        </div>
      </components.Menu>
    </>
  );
};

export const Dropdown = () => {
  const store = useStore();

  const [selected, setSelected] = useState<{
    value: string;
    label: string;
  } | null>(() => {
    return tOptions.find((opt) => opt.value === store.filters.sortBy) || null;
  });

  const handleSortType = (type: { value: string; label: string } | null) => {
    setSelected(type);
    if (type?.value) {
      store.filters.sortBy = type.value as "name" | "size" | "type" | "modified" | undefined;
    }
  };
  return (
    <div style={{ display: "flex" }}>
      <Select
        placeholder={"Select"}
        styles={{
          control: (css) => {
            return {
              ...css,
              width: "10rem",
            };
          },
        }}
        options={tOptions}
        defaultValue={selected}
        isSearchable={false}
        onChange={handleSortType}
        components={{ Menu }}
      />
    </div>
  );
};
