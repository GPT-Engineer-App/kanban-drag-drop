import KanbanBoard from "@/components/KanbanBoard";

const Index = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Kanban Board</h1>
      <KanbanBoard />
    </div>
  );
};

export default Index;