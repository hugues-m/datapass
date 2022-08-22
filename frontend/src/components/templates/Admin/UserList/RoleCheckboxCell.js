import React, { useEffect, useState } from 'react';
import { useUsers } from '../../../../services/users';

const RoleCheckboxCell = ({
  value: initialValue,
  row: { index, original },
  column: { id },
  updateData,
}) => {
  const [value, setValue] = useState(initialValue);
  const { updateUser } = useUsers();

  const onChange = async (e) => {
    const newValue = e.target.checked;
    const newRoles = newValue
      ? [...original.roles, id]
      : original.roles.filter((e) => e !== id);

    try {
      await updateUser({ id: original.id, roles: newRoles });
      setValue(newValue);
      updateData(index, id, newValue);
    } catch (e) {
      setValue(!newValue);
      updateData(index, id, !newValue);
    }
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return <input type="checkbox" checked={value} onChange={onChange} />;
};

export default RoleCheckboxCell;
