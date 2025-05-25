import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/app/lib/actions/auth.actions";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/app/lib/actions/general.actions";
import Image from "next/image";
import Link from "next/link";

const Home = async () => {
  const user = await getCurrentUser();
  const [userInterviews, latestInterviews] = await Promise.all([
    await getInterviewsByUserId(user?.id!),
    await getLatestInterviews({ userId: user?.id! }),
  ]);
  const hasPastInterviews = userInterviews?.length > 0;
  const hasUpcominInterviews = latestInterviews?.length > 0;

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-powered Practise & Feedback</h2>
          <p className="text-lg">
            Practise on real interview questions and get instant Feedback
          </p>
          <Button asChild className="btn-primary">
            <Link href={"/interview"}>Start an Interview</Link>
          </Button>
        </div>

        <Image
          src={"/robot.png"}
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>
        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews.map((interview, index) => (
              <InterviewCard {...interview} key={index} />
            ))
          ) : (
            <p>You have not taken any interview yet.</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Take an Interview</h2>
        <div className="interviews-section">
          {hasUpcominInterviews ? (
            latestInterviews.map((interview, index) => (
              <InterviewCard {...interview} key={index} />
            ))
          ) : (
            <p>There are no new interview available.</p>
          )}
        </div>
      </section>
    </>
  );
};
export default Home;
