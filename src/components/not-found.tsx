import Head from "next/head";
import Link from "next/link";
import { PageLayout } from "~/components/layout";
import { Icons } from "./icons";
import { Button } from "./ui/button";

export default function NotFound() {
  return (
    <PageLayout>
      <Head>
        <title>Page not found</title>
      </Head>
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="pb-4 text-2xl">Page not found.</h1>
        <Button>
          <Link href={"/"} className="flex items-center">
            <Icons.arrowLeft className="mr-2" />
            Back
          </Link>
        </Button>
      </div>
    </PageLayout>
  );
}
