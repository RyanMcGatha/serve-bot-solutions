import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-09-30.acacia",
});

export async function POST(req: NextRequest) {
  try {
    const { email, paymentMethodId, priceId } = await req.json();
    if (!priceId) throw new Error("Price ID is required");

    // Check if customer already exists
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    });
    let customer = existingCustomers.data[0];

    if (!customer) {
      // Create a new customer if one doesn't exist
      customer = await stripe.customers.create({
        email,
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
    }

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      expand: ["latest_invoice.payment_intent"],
    });

    // Check payment status
    const latestInvoice = subscription.latest_invoice;

    if (
      typeof latestInvoice !== "string" &&
      latestInvoice?.payment_intent &&
      typeof latestInvoice.payment_intent !== "string" &&
      latestInvoice.payment_intent.status === "succeeded"
    ) {
      return NextResponse.json(
        { success: true, subscription },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Payment failed", subscription },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error creating subscription:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
