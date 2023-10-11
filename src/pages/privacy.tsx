import { PageLayout } from "~/components/layout";

const Privacy = () => {
  return (
    <>
      <PageLayout id="">
        <div className="flex pt-20">
          <div className="flex flex-col gap-8">
            <h1 className="text-4xl font-bold leading-tight tracking-tighter lg:leading-[1.1]">
              Privacy Policy
            </h1>
            <p className="max-w-lg text-lg text-muted-foreground sm:text-xl">
              Statify is an open-source application powered by the Spotify Web
              API. By opting to utilize this application, you are consenting to
              the utilization of your Spotify account username and data for the
              purpose of generating statistics related to your top artists and
              tracks.
            </p>
            <p className="max-w-lg text-lg text-muted-foreground sm:text-xl">
              We are committed to safeguarding your data and ensuring its
              responsible usage. It is important to note that none of the data
              accessed and utilized by Statify is retained or collected in any
              manner, and it is not shared with any third parties. All
              information is employed exclusively for the presentation of your
              Spotify statistics. Your data is not stored or utilized for
              malicious purposes in any way.
            </p>
            <p className="max-w-lg text-lg text-muted-foreground sm:text-xl">
              In the event that you wish to revoke Statify&apos;s permissions or
              have any concerns about your data&apos;s usage, you have the
              option to manage your permissions by visiting{" "}
              <a
                href="https://www.spotify.com/us/account/apps/"
                target="_blank"
              >
                <span className="text-primary hover:text-white">this page</span>
              </a>{" "}
              and click &quot;Remove Access&quot; on Statify.
            </p>
            <p className="max-w-lg text-lg text-muted-foreground sm:text-xl">
              By opting to use Statify, you acknowledge that you have read and
              understood this Privacy Agreement and consent to the utilization
              of your Spotify account data in accordance with the terms
              described herein. We appreciate your trust in Statify&apos;s
              commitment to privacy and data security. Thank you for choosing
              Statify!
            </p>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default Privacy;
