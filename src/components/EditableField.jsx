import React, { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";

const EditableField = ({ onItemizedItemEdit, cellData }) => {
  const [value, setValue] = useState(cellData.value);

  const handleChange = (e) => {
    setValue(e.target.value);
    onItemizedItemEdit({
      target: {
        name: cellData.name,
        value: e.target.value,
        id: cellData.id,
      },
    });
  };

  return (
    <InputGroup className="my-1 flex-nowrap">
      {cellData.leading != null && (
        <InputGroup.Text className="border-0 text-secondary px-2 fw-bold bg-light">
          <span
            className="border border-2 border-secondary rounded-circle d-flex justify-content-center align-items-center small"
            style={{ width: "1.5rem", height: "1.5rem" }}
          >
            {cellData.leading}
          </span>
        </InputGroup.Text>
      )}
      <Form.Control
        className={cellData.textAlign}
        type={cellData.type}
        placeholder={cellData.placeholder}
        min={cellData.min}
        name={cellData.name}
        id={cellData.id}
        value={value} // Use local state value here
        step={cellData.step}
        precision={cellData.precision}
        aria-label={cellData.name}
        onChange={handleChange} // Call local handleChange function
        required
      />
    </InputGroup>
  );
};

export default EditableField;
