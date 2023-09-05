import { signIn, signOut, useSession } from "next-auth/react";
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
import { toast } from "./ui/use-toast";

export function PageLayout(props: { children: React.ReactNode; id: string }) {
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
                  <DropdownMenuItem
                    onClick={() => {
                      navigator.clipboard
                        .writeText(`${window.location.origin}/${props.id}`)
                        .then(() => {
                          toast({
                            description: "Link successfully copied!",
                          });
                        })
                        .catch((error) => console.error(error));
                    }}
                  >
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => void signOut({ callbackUrl: "/" })}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {!sessionData && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Menu</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => void signIn()}>
                    Login
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
