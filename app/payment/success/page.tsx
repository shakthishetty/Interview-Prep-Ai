"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";

const PaymentSuccess = () => {
  useEffect(() => {
    toast.success("Payment successful! Welcome to InterviewPrep!");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card-border">
        <div className="flex flex-col gap-8 card py-14 px-10 max-w-lg text-center">
          {/* Logo and Title */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-row justify-center gap-2">
              <Image 
                src="/logo.svg"
                alt="Logo"
                width={38}
                height={32}
              />
              <h2 className="text-primary-100">InterviewPrep</h2>
            </div>
            <div className="text-6xl">🎉</div>
            <h1 className="text-2xl font-bold text-green-600">Payment Successful!</h1>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600">
              Congratulations! You now have lifetime access to InterviewPrep.
            </p>
            <p className="text-sm text-gray-500">
              Start practicing with unlimited AI interviews and get detailed feedback to ace your next job interview.
            </p>
          </div>

          <Link href="/">
            <Button className="btn w-full h-12 text-lg">
              Start Your First Interview
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
