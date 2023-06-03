import { ModeToggle } from "./mode-toggle";

export function PageLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex justify-center">
        <div className="w-full px-6 lg:max-w-7xl relative">
          <div className="absolute right-4 top-4 md:right-8 md:top-8">
            <ModeToggle />
          </div>
          {props.children}
        </div>
      </div>
    </>
  );
}
