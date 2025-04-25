import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Freelancer",
    monthlyPrice: "$19",
    annualPrice: "$190",
    description: "The essentials to provide your best work for clients.",
    features: [
      "5 products",
      "Up to 1,000 subscribers",
      "Basic analytics",
      "48-hour support response time"
    ],
    current: false
  },
  {
    name: "Startup",
    monthlyPrice: "$29",
    annualPrice: "$290",
    description: "A plan that scales with your rapidly growing business.",
    features: [
      "25 products",
      "Up to 10,000 subscribers",
      "Advanced analytics",
      "24-hour support response time",
      "Marketing automations"
    ],
    popular: true,
    current: true
  },
  {
    name: "Enterprise",
    monthlyPrice: "$59",
    annualPrice: "$590",
    description: "Dedicated support and infrastructure for your company.",
    features: [
      "Unlimited products",
      "Unlimited subscribers",
      "Advanced analytics",
      "1-hour, dedicated support response time",
      "Marketing automations",
      "Custom reporting tools"
    ],
    current: false
  }
]

export function BillingSettingsView() {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annually'>('monthly')

  return (
    <div className="space-y-8">
      {/* Billing Interval Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex items-center rounded-full border p-1 bg-muted/50">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-full px-4 cursor-pointer",
              billingInterval === "monthly" && "bg-background shadow-sm"
            )}
            onClick={() => setBillingInterval("monthly")}
          >
            Monthly
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-full px-4 cursor-pointer",
              billingInterval === "annually" && "bg-background shadow-sm"
            )}
            onClick={() => setBillingInterval("annually")}
          >
            Annually
          </Button>
        </div>
      </div>

      {/* Available Plans Section */}
      <div className="grid gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className="overflow-hidden rounded-3xl hover:border-primary/50 transition-all duration-200 cursor-pointer hover:scale-102 hover:shadow-lg"
          >
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl flex items-center justify-between">{plan.name}
                {plan.popular && (
                  <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                    Popular
                  </span>
                )}
              </CardTitle>
              <CardDescription className="min-h-[50px] text-sm">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <span className="text-4xl font-bold">
                  {billingInterval === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                </span>
                <span className="text-muted-foreground ml-2">/{billingInterval === 'monthly' ? 'month' : 'year'}</span>
              </div>
              <Button 
                variant="default"
                className="w-full rounded-full h-10 text-base cursor-pointer"
              >
                Buy plan
              </Button>
              <div className="space-y-3 pt-4">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 