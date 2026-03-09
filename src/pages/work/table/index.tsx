import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableTable from "./draggableTable";

function Index() {
  return (
    <DndProvider backend={HTML5Backend}>
      <DraggableTable />
    </DndProvider>
  );
}

export default Index;
