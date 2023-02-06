import React from 'react';

const useToggle = (state = false) => {
  const [isActive, setIsActive] = React.useState(state);

  const toggle = (action) => {
    if (action) {
      return setIsActive(action);
    }
    if (action === false) {
      return setIsActive(action);
    }

    return setIsActive(!isActive);
  };

  return { isActive, toggle };
};

export default useToggle;
