import { getClient } from "@/lib/rpc/server";
import { Card, CardContent } from "@/components/ui/card";

import { TaskCard } from "@/modules/tasks/components/task-card";

export default async function Home() {
  const client = await getClient();

  const res = await client.api.tasks.$get({ query: { page: "1" } });

  if (!res.ok) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <p className="text-red-500">Failed to load tasks.</p>
      </div>
    );
  }

  const tasks = await res.json();

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      {tasks.meta.totalCount === 0 ? (
        <Card>
          <CardContent className="pt-6 pb-6 flex justify-center">
            <p className="text-muted-foreground">
              No tasks found. Create one to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tasks.data.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
