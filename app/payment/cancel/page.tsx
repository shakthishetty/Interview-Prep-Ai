"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const PaymentCancel = () => {
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
            <div className="text-6xl">😔</div>
            <h1 className="text-2xl font-bold text-orange-600">Payment Cancelled</h1>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600">
              Your payment was cancelled. No charges have been made.
            </p>
            <p className="text-sm text-gray-500">
              You can try again anytime to unlock lifetime access to InterviewPrep.
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/payment">
              <Button className="btn w-full h-12 text-lg">
                Try Payment Again
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline" className="w-full h-12">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
