import { Button } from "@/components/ui/button";

interface DashboardErrorProps {
  error: Error | null;
}

export function DashboardError({ error }: DashboardErrorProps) {
  return (
    <div className="container mx-auto p-4">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
          <h3 className="font-medium">Error loading tasks</h3>
          <p className="text-sm">
            {error?.message || "Failed to load your tasks. Please try again later."}
          </p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    </div>
  );
}
