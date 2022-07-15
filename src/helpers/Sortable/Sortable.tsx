import React, { useState } from "react";
import { ReactSortable } from "react-sortablejs";

interface ItemType {
  id: number;
  name: string;
}

const Sortable = (props:{}) => {
  const [state, setState] = useState<ItemType[]>([
    { id: 1, name: "shrek" },
    { id: 2, name: "fiona" },
  ]);

  return (
    <ReactSortable list={state} setList={setState}>
      {state.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </ReactSortable>
  );
};

export { Sortable }