"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import Link from "next/link";
import { SquareActivity } from "lucide-react";
import { supabase } from "@/lib/supabase"

const magicLinkSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function MagicLinkPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const form = useForm<z.infer<typeof magicLinkSchema>>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof magicLinkSchema>) {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: values.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      setIsEmailSent(true);
      toast.success("Magic link sent to your email!");
    } catch (error) {
      console.error("Magic link error:", error);
      toast.error("Failed to send magic link. Please try again.");
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
            <CardTitle className="text-xl">Magic Link Login</CardTitle>
            <CardDescription>
              {isEmailSent
                ? "Check your email for the magic link"
                : "Enter your email to receive a magic link for passwordless login"}
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
                          <Input placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Magic Link"}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  We&apos;ve sent a magic link to {form.getValues("email")}. Click the link in the email to log in.
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
              </div>
            )}
          </CardContent>
          <CardFooter>
            <div className="text-sm text-muted-foreground w-full text-center">
              Remember your password?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Login with password
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 