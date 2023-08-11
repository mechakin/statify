import { signOut, useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ModeToggle } from "./mode-toggle";

export function PageLayout(props: { children: React.ReactNode }) {
  const { data: sessionData } = useSession();

  return (
    <>
      <div className="flex justify-center overflow-hidden">
        <div className="relative w-full px-6 lg:max-w-7xl">
          <div className="absolute right-4 top-4 flex items-center space-x-4 md:right-8 md:top-8">
            {sessionData && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Menu</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>{sessionData.user.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Share</DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => void signOut({ callbackUrl: "/" })}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <ModeToggle />
          </div>
          {props.children}
        </div>
      </div>
    </>
  );
}
