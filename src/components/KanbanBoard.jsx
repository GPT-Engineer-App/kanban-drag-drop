import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialData = {
  columns: {
    "column-1": {
      id: "column-1",
      title: "To Do",
      cardIds: ["card-1", "card-2"],
    },
    "column-2": {
      id: "column-2",
      title: "In Progress",
      cardIds: ["card-3"],
    },
    "column-3": {
      id: "column-3",
      title: "Done",
      cardIds: [],
    },
  },
  cards: {
    "card-1": { id: "card-1", content: "Task 1" },
    "card-2": { id: "card-2", content: "Task 2" },
    "card-3": { id: "card-3", content: "Task 3" },
  },
  columnOrder: ["column-1", "column-2", "column-3"],
};

const KanbanBoard = () => {
  const [data, setData] = useState(initialData);
  const [newCardContents, setNewCardContents] = useState({
    "column-1": "",
    "column-2": "",
    "column-3": "",
  });

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newCardIds = Array.from(start.cardIds);
      newCardIds.splice(source.index, 1);
      newCardIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        cardIds: newCardIds,
      };

      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };

      setData(newState);
      return;
    }

    const startCardIds = Array.from(start.cardIds);
    startCardIds.splice(source.index, 1);
    const newStart = {
      ...start,
      cardIds: startCardIds,
    };

    const finishCardIds = Array.from(finish.cardIds);
    finishCardIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      cardIds: finishCardIds,
    };

    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    setData(newState);
  };

  const addNewCard = (columnId) => {
    const newCardId = `card-${Object.keys(data.cards).length + 1}`;
    const newCard = { id: newCardId, content: newCardContents[columnId] };

    const newState = {
      ...data,
      cards: {
        ...data.cards,
        [newCardId]: newCard,
      },
      columns: {
        ...data.columns,
        [columnId]: {
          ...data.columns[columnId],
          cardIds: [...data.columns[columnId].cardIds, newCardId],
        },
      },
    };

    setData(newState);
    setNewCardContents((prevContents) => ({
      ...prevContents,
      [columnId]: "",
    }));
  };

  const handleCardContentChange = (columnId, content) => {
    setNewCardContents((prevContents) => ({
      ...prevContents,
      [columnId]: content,
    }));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4">
        {data.columnOrder.map((columnId) => {
          const column = data.columns[columnId];
          const cards = column.cardIds.map((cardId) => data.cards[cardId]);

          return (
            <Column
              key={column.id}
              column={column}
              cards={cards}
              addNewCard={addNewCard}
              newCardContent={newCardContents[columnId]}
              setNewCardContent={handleCardContentChange}
            />
          );
        })}
      </div>
    </DragDropContext>
  );
};

const Column = ({ column, cards, addNewCard, newCardContent, setNewCardContent }) => {
  return (
    <div className="flex flex-col w-64">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">{column.title}</h2>
        </CardHeader>
        <CardContent>
          <Droppable droppableId={column.id}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {cards.map((card, index) => (
                  <Draggable key={card.id} draggableId={card.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`p-4 bg-white rounded shadow ${
                          snapshot.isDragging ? "opacity-50" : ""
                        }`}
                      >
                        {card.content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <div className="mt-4">
            <Input
              value={newCardContent}
              onChange={(e) => setNewCardContent(column.id, e.target.value)}
              placeholder="New card content"
              className="mb-2"
            />
            <Button onClick={() => addNewCard(column.id)}>Add Card</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KanbanBoard;