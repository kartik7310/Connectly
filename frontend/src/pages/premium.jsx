import { Check, CreditCard, Shield } from "lucide-react";
import { useSelector } from "react-redux";
import subscriptionService from "../services/subscription";
import { isUserPremium } from "../utils/constants";

const PricingPage = () => {
  const user = useSelector((store) => store.user?.user);
  console.log("user in premium", user);

  const plans = [
    {
      id: "FREE",
      name: "Free Plan",
      description: "Free plan for new users.",
      price: 0,
      features: [
        "5 Connections per day",
        "10 chats per day",
        "3 Blogs per day",
        "No chat with AI",

      ],
      highlight: false,
    },
    {
      id: "PREMIUM",
      name: "Premium Plan",
      description: "Best value for users.",
      price: 199,
      features: [
        "Everything in Free Plan",
        "Unlimited Connections",
        "Unlimited Chats",
        "Unlimited Blogs",
        "Chat with AI",
      ],
      highlight: true,
    },
  ];

  const handlePlan = async (planId) => {
    if (planId === "FREE") return;

    try {
      const data = await subscriptionService.createOrder(planId);

      if (data && data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to get checkout URL");
      }
    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container mx-auto py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Upgrade Your Plan</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Unlock the full potential of your financial tracking with our premium
          membership.
        </p>
        {user && (
          <div className="mt-4">
            <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">Current Plan:</span>
            <span className={`ml-2 px-4 py-1 rounded-full text-xs font-bold ${isUserPremium(user) ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'}`}>
              {isUserPremium(user) ? 'PREMIUM' : 'FREE'}
            </span>
          </div>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`card bg-base-100 border ${plan.highlight
                ? "border-primary shadow-xl scale-105"
                : "border-base-300 shadow"
              } transition-all`}
          >
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="card-title text-2xl">{plan.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {plan.description}
                  </p>
                </div>
                {plan.highlight && (
                  <span className="badge badge-primary">Best Value</span>
                )}
              </div>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold">₹{plan.price}</span>
                {plan.price !== 0 && (
                  <span className="text-gray-500">/month</span>
                )}
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-primary mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="card-actions mt-8">
                <button
                  className={`btn w-full ${plan.highlight ? "btn-primary" : "btn-outline"
                    }`}
                  disabled={plan.id === "FREE" || (plan.id === "PREMIUM" && isUserPremium(user))}
                  onClick={() => handlePlan(plan.id)}
                >
                  {plan.id === "FREE"
                    ? "Current Plan"
                    : (isUserPremium(user) && plan.id === "PREMIUM" ? "Current Plan" : "Upgrade to Premium")}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Section */}
      <div className="grid md:grid-cols-3 gap-6 pt-10 text-center">
        <div className="flex flex-col items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <h3 className="font-semibold">Secure Payments</h3>
          <p className="text-sm text-gray-500">Powered by Stripe</p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <CreditCard className="h-8 w-8 text-primary" />
          <h3 className="font-semibold">Cancel Anytime</h3>
          <p className="text-sm text-gray-500">No long-term commitments</p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Check className="h-8 w-8 text-primary" />
          <h3 className="font-semibold">Instant Activation</h3>
          <p className="text-sm text-gray-500">
            Access after successful payment
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
