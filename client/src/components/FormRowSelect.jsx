const FormRowSelect = ({
  name,
  labelText,
  list,
  defaultValue,
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="m-2 text-lg">
        {labelText || name}
      </label>
      <select
        name={name}
        id={name}
        className="2xl:w-96 py-2 px-4 -mt-2 text-lg"
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
      >
        <option value="">-- select --</option> {/* Add this line */}
        {list.map((itemValue) => (
          <option key={itemValue} value={itemValue}>
            {itemValue}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormRowSelect;
