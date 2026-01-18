"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!
);

function PagoForm({
  onClose,
}: {
  onClose: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/success`,
      },
    });

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="mt-4 w-full bg-[#72eb15] text-[#365314] font-semibold py-2 rounded-lg"
      >
        {loading ? "Procesando..." : "Pagar"}
      </button>
      <button
        type="button"
        onClick={onClose}
        className="mt-3 text-sm text-gray-500 w-full"
      >
        Cancelar
      </button>
    </form>
  );
}

export default function ModalPago({
  clientSecret,
  onClose,
}: {
  clientSecret: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white w-full max-w-md rounded-xl p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">Completar pago</h3>

        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PagoForm onClose={onClose} />
        </Elements>
      </div>
    </div>
  );
}
