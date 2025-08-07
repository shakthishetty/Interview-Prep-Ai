"use client";

import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

interface SavedMessage{
    role: 'user' | 'system' | 'assistant';
    content: string;
}

const Agent = ({ userName ,userId,type, questions,interviewId}:AgentProps) => {
    const router = useRouter();

    // Validate required props
    if (!userName) {
        console.error("Agent: userName is required");
        return <div>Error: User name is required</div>;
    }

    if (!process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN) {
        console.error("Agent: VAPI Web Token is not configured");
        return <div>Error: VAPI is not configured. Please check your environment variables.</div>;
    }

    if (type === "interview" && (!questions || questions.length === 0)) {
        console.error("Agent: questions are required for interview type");
        return <div>Error: Interview questions are required</div>;
    }

    const [isSpeaking, setIsSpeaking] = useState(false);
     
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [messages, setMessages] = useState<SavedMessage[]>([]);

    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
        const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
        const onMessage = (message: Message)=>{
            if(message.type === 'transcript' && message.transcriptType === 'final') 
                {
                    const newMessage = {
                        role: message.role,
                        content: message.transcript,
                    }

                    setMessages((prev) => [...prev, newMessage]);
        }
    }
        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);
        const onError = (error: any) => {
            console.error("Error in Agent component:", error);
            console.error("Error type:", typeof error);
            console.error("Error details:", JSON.stringify(error, null, 2));
            
            // Reset call status on error
            setCallStatus(CallStatus.INACTIVE);
        }

        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('message', onMessage);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);
        vapi.on('error', onError);

        return () => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('message', onMessage);
            vapi.off('speech-start', onSpeechStart);
            vapi.off('speech-end', onSpeechEnd);
            vapi.off('error', onError);
        }
    }, []);

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
          console.log("Generating feedback with messages:", messages);
          console.log("Messages length:", messages.length);
          console.log("InterviewId:", interviewId);
          console.log("UserId:", userId);
          
          if (!interviewId || !userId) {
            console.error("Missing interviewId or userId for feedback generation");
            console.error("InterviewId:", interviewId, "UserId:", userId);
            router.push("/");
            return;
          }

          if (messages.length === 0) {
            console.error("No messages available for feedback generation");
            router.push("/");
            return;
          }

          try {
            console.log("Calling createFeedback with:", {
              interviewId,
              userId,
              transcriptLength: messages.length
            });

            const {success, feedbackId, error} = await createFeedback({
              interviewId: interviewId!,
              userId: userId!,
              transcript: messages,
            });

            console.log("createFeedback result:", {success, feedbackId, error});

            if(success && feedbackId){
              console.log("Feedback generated successfully:", feedbackId);
              router.push(`/interview/${interviewId}/feedback`);
            } else {
              console.error("Failed to generate feedback:", error || "Unknown error");
              router.push("/");
            }
          } catch (error) {
            console.error("Error generating feedback:", error);
            console.error("Error type:", typeof error);
            console.error("Error message:", error instanceof Error ? error.message : "Unknown error");
            router.push("/");
          }
    }

    useEffect(() => {
        if(callStatus === CallStatus.FINISHED) {
           if(type === "generate"){
              router.push("/")
           } else {
               handleGenerateFeedback(messages);
           }
        }
    },[callStatus,messages,type,interviewId])

  const handleDisconnect = () => {
    vapi.stop();
    setCallStatus(CallStatus.FINISHED);
  };

  const handleCall = async () => {
    try {
      setCallStatus(CallStatus.CONNECTING);

      if (type === "generate") {
        const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;
        if (!workflowId) {
          throw new Error("VAPI Workflow ID is not configured");
        }

        console.log("Starting VAPI call for generation with:", {
          userName,
          userId,
          workflowId
        });

        await vapi.start(
          undefined,
          undefined,
          undefined,
          workflowId,
          {
            variableValues: {
              username: userName,
              userid: userId,
            },
          }
        );
      } else {
        let formattedQuestions = "";
        if (questions && questions.length > 0) {
          formattedQuestions = questions
            .map((question) => `- ${question}`)
            .join("\n");
        }

        if (!formattedQuestions) {
          throw new Error("No questions available for the interview");
        }

        console.log("Starting VAPI call for interview with questions:", formattedQuestions);

        await vapi.start(interviewer, {
          variableValues: {
            questions: formattedQuestions,
          },
        });
      }
    } catch (error: any) {
      console.error("Error starting VAPI call:", error);
      console.error("Error type:", typeof error);
      console.error("Error message:", error?.message || "Unknown error");
      console.error("Error stack:", error?.stack || "No stack trace");
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const lastMessage = messages[messages.length - 1]?.content || '';


  const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;
  return (
    <>
    <div className="call-view">
        <div className="card-interviewer">
        <div className="avatar">
            <Image src="/ai-avatar.png" alt="vapi-avatar"
             width={65}
              height={54}
              className="object-cover"
               />
               {isSpeaking && <span className="animate-speak"></span>}
        </div>
        <h3>AI Interviewer</h3>
        </div>

        <div className="card-border">
                    <div className="card-content">
                   <Image src="/user-avatar.png" alt="user-avatar"
                    width={540}
                    height={540}
                    className="rounded-full object-cover size-[120px]"
                    />
                    <h3>{userName}</h3>
                    </div>
        </div>
    </div>

    {messages.length > 0 && (
        <div className="transcript-border">
            <div className="transcript">
                <p key={lastMessage} className={cn('transition-opacity duration-500 opacity-0','animate-fadeIn opacity-100')}>{lastMessage}</p>
            </div>
        </div>
        )}

    <div className="w-full flex justify-center">
    {callStatus !== 'ACTIVE' ? (
         <button className="relative btn-call" onClick={handleCall}>
            <span className={cn('absolute animate-ping rounded-full opacity-75',callStatus !== 'CONNECTING' && 'hidden')} />
                
           

            <span>
{isCallInactiveOrFinished ? "Call" : '. . .'}
            </span>
         </button>
    ):(
        <button className="btn-disconnect" onClick={handleDisconnect}>
            End
        </button>
    )}
    </div>
    </>
  )
}

export default Agent