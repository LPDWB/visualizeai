'use client';

import { useStore } from '@/store/useStore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function DashboardPage() {
  const { fileHistory } = useStore();

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-4xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Files</CardTitle>
            <CardDescription>Your last uploaded files</CardDescription>
          </CardHeader>
          <CardContent>
            {fileHistory.length === 0 ? (
              <p className="text-muted-foreground">No files uploaded yet</p>
            ) : (
              <ul className="space-y-2">
                {fileHistory.map((file) => (
                  <li
                    key={file.timestamp}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <span className="font-medium">{file.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(file.timestamp).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Upload New File
              </button>
              <button className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                View Archive
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>Overview of your data</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-3">
                <dt className="text-sm font-medium text-muted-foreground">
                  Total Files
                </dt>
                <dd className="mt-1 text-2xl font-semibold">
                  {fileHistory.length}
                </dd>
              </div>
              <div className="rounded-lg border p-3">
                <dt className="text-sm font-medium text-muted-foreground">
                  Last Upload
                </dt>
                <dd className="mt-1 text-2xl font-semibold">
                  {fileHistory[0]
                    ? new Date(fileHistory[0].timestamp).toLocaleDateString()
                    : 'Never'}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 