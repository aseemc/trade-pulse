"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import Link from "next/link";
import { SquareActivity, Loader2 } from "lucide-react";
import { resetPassword } from "@/lib/actions/auth";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    setIsLoading(true);
    try {
      const result = await resetPassword(values);
      if (result?.error) {
        toast.error(result.error);
      } else {
        setIsEmailSent(true);
        toast.success("Password reset instructions sent to your email!");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/auth/login" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <SquareActivity className="size-4" />
          </div>
          Trade Pulse
        </Link>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Reset Password</CardTitle>
            <CardDescription>
              {isEmailSent
                ? "Check your email for password reset instructions"
                : "Enter your email address and we'll send you instructions to reset your password"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isEmailSent ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending
                      </>
                    ) : (
                      "Send Reset Instructions"
                    )}
                  </Button>
                  <div className="text-center text-sm">
                    Remember your password?{" "}
                    <Link href="/auth/login" className="underline underline-offset-4">
                      Login
                    </Link>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="grid gap-6">
                <p className="text-sm text-muted-foreground text-center">
                  If an account exists for {form.getValues("email")}, you will receive password reset
                  instructions.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setIsEmailSent(false);
                    form.reset();
                  }}
                >
                  Try another email
                </Button>
                <div className="text-center text-sm">
                  Remember your password?{" "}
                  <Link href="/auth/login" className="underline underline-offset-4">
                    Login
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our <Link href="#">Terms of Service</Link>{" "}
          and <Link href="#">Privacy Policy</Link>.
        </div>
      </div>
    </div>
  );
} 