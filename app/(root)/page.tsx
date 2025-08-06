import InterviewCard from "@/components/InterviewCard"
import { Button } from "@/components/ui/button"
import { dummyInterviews } from "@/constants"
import Image from "next/image"

const page = () => {
  return (
    <>
      <section className="card-cta">
       <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">Practice coding interviews with AI-generated questions, receive instant feedback, and track your progress.</p>
          <Button className="btn-primary max-sm:w-full">Start Your Interview</Button>
       </div>
       <Image 
        src="/robot.png"
        alt="robotimage"
        width={400}
        height={400}
        className="max-sm:hidden"
        />
      </section>

      <section className="flex flex-col gap-6 mt-8">
          <h2>Your Interviews</h2>
          <div className="interviews-section">
              {dummyInterviews.map((interview)=>(
                  <InterviewCard  key={interview.id} {...interview}/>
              ))}
          </div>
      </section>

       <section className="flex flex-col gap-6 mt-8">
          <h2>Take an Interview</h2>
          <div className="interviews-section">
              {dummyInterviews.map((interview)=>(
                  <InterviewCard  key={interview.id} {...interview}/>
              ))}
          </div>
      </section>
      </>
  )
}

export default page