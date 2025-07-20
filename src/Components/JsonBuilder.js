import React, { useState } from "react";
import { ImCross } from "react-icons/im";

const Field = ({ field, onChange, onDelete }) => {
  const handleKeyChange = (e) => {
    onChange({ ...field, key: e.target.value });
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    const updatedField = {
      ...field,
      type: newType,
      children: newType === "Nested" ? [] : undefined,
    };
    onChange(updatedField);
  };

  const handleAddChild = () => {
    const newChild = { key: "", type: "String" };
    onChange({
      ...field,
      children: [...(field.children || []), newChild],
    });
  };

  const handleChildChange = (index, updatedChild) => {
    const updatedChildren = [...field.children];
    updatedChildren[index] = updatedChild;
    onChange({ ...field, children: updatedChildren });
  };

  const handleDeleteChild = (index) => {
    const updatedChildren = [...field.children];
    updatedChildren.splice(index, 1);
    onChange({ ...field, children: updatedChildren });
  };

  return (
    <div className="border p-4 my-2 rounded-lg shadow bg-white">
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={field.key}
          onChange={handleKeyChange}
          placeholder="Field Key"
          className="border p-2 rounded w-1/3"
        />
        <select
          value={field.type}
          onChange={handleTypeChange}
          className="border p-2 rounded"
        >
          <option value="String">String</option>
          <option value="Number">Number</option>
          <option value="Nested">Nested</option>
          <option value="String">ObjectId</option>
          <option value="Number">Float</option>
          <option value="Nested">Boolean</option>
          <option value="Nested">Array</option>
        </select>
        <button
          onClick={onDelete}
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        >
          <ImCross/>
        </button>
      </div>

      {field.type === "Nested" && (
        <div className="ml-6 mt-4">
          {field.children?.map((child, index) => (
            <Field
              key={index}
              field={child}
              onChange={(updatedChild) =>
                handleChildChange(index, updatedChild)
              }
              onDelete={() => handleDeleteChild(index)}
            />
          ))}
          <button
            onClick={handleAddChild}
            className="mt-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
          >
            + Add Nested Field
          </button>
        </div>
      )}
    </div>
  );
};

const JsonBuilder = () => {
  const [fields, setFields] = useState([]);

  const handleAddField = () => {
    setFields([...fields, { key: "", type: "String" }]);
  };

  const handleFieldChange = (index, updatedField) => {
    const newFields = [...fields];
    newFields[index] = updatedField;
    setFields(newFields);
  };

  const handleDeleteField = (index) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  const buildSchema = (fields) => {
    return fields.reduce((acc, field) => {
      if (!field.key) return acc;
      if (field.type === "Nested") {
        acc[field.key] = buildSchema(field.children || []);
      } else {
        acc[field.key] = field.type;
      }
      return acc;
    }, {});
  };

  const liveSchema = buildSchema(fields);

  return (
    <div className="flex flex-col md:flex-row p-6 gap-6">
      {/* Builder Area */}
      <div className="w-full md:w-1/2">
        <h1 className="text-2xl font-bold mb-4">Project by Ankit Kumar Choudhary</h1>
        {fields.map((field, index) => (
          <Field
            key={index}
            field={field}
            onChange={(updatedField) => handleFieldChange(index, updatedField)}
            onDelete={() => handleDeleteField(index)}
          />
        ))}
        <button
          onClick={handleAddField}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + Add Field
        </button>
      </div>

      {/* JSON Preview Area */}
      <div className="w-full md:w-1/2">
        <h2 className="text-xl font-semibold mb-2">JSON Schema</h2>
        <pre className="bg-gray-100 border rounded p-4 h-full max-h-[600px] overflow-auto">
          {JSON.stringify(liveSchema, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default JsonBuilder;
