import PaymentPage from "@/components/PaymentPage";
import { checkUserPaymentStatus } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";

const Payment = async () => {
  const { needsPayment, user } = await checkUserPaymentStatus();

  if (!user) {
    redirect('/sign-in');
  }

  // If user has already paid, redirect to home
  if (!needsPayment) {
    redirect('/');
  }

  return (
    <PaymentPage 
      userId={user.id}
      userEmail={user.email}
      userName={user.name}
    />
  );
};

export default Payment;
