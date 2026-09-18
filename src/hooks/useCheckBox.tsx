import React from "react";

export default function useCheckBox() {
  const [checkedItems, setCheckedItems] = React.useState<(string | number)[]>(
    [],
  );

  const handleCheck = (selected: string | number) => {
    setCheckedItems((prev) => {
      const index: number = prev.indexOf(selected);

      const value =
        index === -1
          ? [...prev, selected]
          : [...prev.slice(0, index), ...prev.slice(index + 1)];

      return value;
    });
  };

  const prefillCheckedItems = React.useCallback((data: (string | number)[]) => {
    setCheckedItems(data);
  }, []);

  return {
    checkedItems,
    handleCheck,
    prefillCheckedItems,
  };
}
