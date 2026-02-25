import React, { Suspense } from "react";
import { headers } from "next/headers";

import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { SignoutButton } from "@/modules/auth/components/signout-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
};

export default async function TasksLayout({ children }: Props) {
  const { data: sessionData } = await authClient.getSession({
    fetchOptions: {
      headers: await headers()
    }
  });

  return (
    <div className="bg-secondary/40 min-h-screen">
      <div className="w-full max-w-xl mx-auto py-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-bold font-heading">All Tasks</h1>
            <p className="text-sm text-muted-foreground">
              Bunplace demo tasks API for demonstrations
            </p>
          </div>

          {sessionData ? (
            <div className="space-y-1 flex flex-col items-end">
              <div className="text-xs text-muted-foreground">
                Signed in as{" "}
                <span className="font-medium">{sessionData.user.email}</span>
              </div>


              <Suspense><SignoutButton /></Suspense>
              
            </div>
          ) : (
            <Button asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
          )}
        </div>

        <Separator className="my-3" />

        <div className="">{children}</div>
      </div>
    </div>
  );
}
