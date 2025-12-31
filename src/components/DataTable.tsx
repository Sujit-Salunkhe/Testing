const TextInput = ({ label, ...props }) => (
  <div>
    <label>{label}</label>
    <input type="text" {...props} />
  </div>
);
const PasswordInput = ({ label, ...props }) => (
  <div>
    <label>{label}</label>
    <input type="password" {...props} />
  </div>
);
const NumberInput = ({ label, ...props }) => (
  <div>
    <label>{label}</label>
    <input type="number" {...props} />
  </div>
);
const DateInput = ({ label, ...props }) => (
  <div>
    <label>{label}</label>
    <input type="date" {...props} />
  </div>
);
const RadioInput = ({ label, options = [], name, onChange }) => (
  <div>
    <label>{label}</label>
    {options.map(opt => (
      <label key={opt.value} style={{ marginLeft: "8px" }}>
        <input
          type="radio"
          name={name}
          value={opt.value}
          onChange={onChange}
        />
        {opt.label}
      </label>
    ))}
  </div>
);

export const getInputComponent = (typeId, props) => {
  switch (typeId) {
    case "text":
      return <TextInput {...props} />;
    case "password":
      return <PasswordInput {...props} />;
    case "number":
      return <NumberInput {...props} />;
    case "dob":
      return <DateInput {...props} />;
    case "radio":
      return <RadioInput {...props} />;
    default:
      return null; // or fallback component
  }
};

const formConfig = [
  { id: "user_id", typeId: "text", label: "User ID" },
  { id: "password", typeId: "password", label: "Password" },
  { id: "age", typeId: "number", label: "Age" },
  {
    id: "gender",
    typeId: "radio",
    label: "Gender",
    options: [
      { label: "Male", value: "M" },
      { label: "Female", value: "F" }
    ]
  },
  { id: "dob", typeId: "dob", label: "Date of Birth" }
];
const DynamicForm = () => {
  const handleChange = e => {
    console.log(e.target.name, e.target.value);
  };
  return (
    <>
      {formConfig.map(field =>
        getInputComponent(field.typeId, {
          key: field.id,
          name: field.id,
          label: field.label,
          options: field.options,
          onChange: handleChange
        })
      )}
    </>
  );
};