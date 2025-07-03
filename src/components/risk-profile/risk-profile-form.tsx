
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/auth-context";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const formSchema = z.object({
  age: z.string({ required_error: "Please select an age group." }),
  horizon: z.string({ required_error: "Please select your investment horizon." }),
  tolerance: z.string({ required_error: "Please select your risk tolerance." }),
  experience: z.string({ required_error: "Please select your financial experience." }),
  income: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function RiskProfileForm() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [resultProfile, setResultProfile] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const calculateProfile = (values: FormValues): string => {
    let score = 0;
    // Age
    if (values.age === "18-25") score += 4;
    else if (values.age === "26-40") score += 3;
    else if (values.age === "41-60") score += 2;
    else if (values.age === "60+") score += 1;
    // Horizon
    if (values.horizon === "long-term") score += 3;
    if (values.horizon === "medium-term") score += 2;
    if (values.horizon === "short-term") score += 1;
    // Tolerance
    if (values.tolerance === "high") score += 3;
    if (values.tolerance === "medium") score += 2;
    if (values.tolerance === "low") score += 1;
    // Experience
    if (values.experience === "advanced") score += 3;
    if (values.experience === "some") score += 2;
    if (values.experience === "none") score += 1;

    if (score <= 6) return "Conservative";
    if (score <= 10) return "Moderate";
    return "Aggressive";
  };

  async function onSubmit(values: FormValues) {
    if (!user || !db) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in and Firebase must be configured to save your profile.",
      });
      return;
    }
    setIsLoading(true);
    const profile = calculateProfile(values);
    try {
      await setDoc(doc(db, "users", user.uid), { riskProfile: profile }, { merge: true });
      setResultProfile(profile);
    } catch (error: any) {
      console.error("Error saving risk profile:", error);
      toast({
        variant: "destructive",
        title: "Failed to save profile",
        description: "Could not save your profile. This might be due to network issues or incorrect Firestore security rules.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age Group</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your age group" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="18-25">18–25</SelectItem>
                      <SelectItem value="26-40">26–40</SelectItem>
                      <SelectItem value="41-60">41–60</SelectItem>
                      <SelectItem value="60+">60+</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="horizon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investment Horizon</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your investment horizon" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="short-term">Short-Term (&lt; 2 years)</SelectItem>
                      <SelectItem value="medium-term">Medium-Term (2-5 years)</SelectItem>
                      <SelectItem value="long-term">Long-Term (5+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Financial Experience</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your financial experience" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="some">Some</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="income"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual Income (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your annual income" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="<50k">Under $50,000</SelectItem>
                      <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                      <SelectItem value="100k-150k">$100,000 - $150,000</SelectItem>
                      <SelectItem value=">150k">Over $150,000</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="tolerance"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Risk Tolerance</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-2"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent/50 transition-colors">
                      <FormControl>
                        <RadioGroupItem value="low" />
                      </FormControl>
                      <FormLabel className="font-normal flex-1 cursor-pointer">
                        <span className="font-semibold block">Low</span>
                        I prioritize capital safety and prefer to avoid risk.
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent/50 transition-colors">
                      <FormControl>
                        <RadioGroupItem value="medium" />
                      </FormControl>
                      <FormLabel className="font-normal flex-1 cursor-pointer">
                        <span className="font-semibold block">Medium</span>
                        I'm willing to take moderate risks for balanced returns.
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent/50 transition-colors">
                      <FormControl>
                        <RadioGroupItem value="high" />
                      </FormControl>
                      <FormLabel className="font-normal flex-1 cursor-pointer">
                        <span className="font-semibold block">High</span>
                        I'm willing to take significant risks for potentially high returns.
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className="w-full text-lg py-6">
            {isLoading ? <Loader2 className="animate-spin" /> : "Calculate My Profile"}
          </Button>
        </form>
      </Form>

      <AlertDialog open={!!resultProfile} onOpenChange={() => setResultProfile(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Your Investor Profile is: {resultProfile}</AlertDialogTitle>
            <AlertDialogDescription>
              We've saved your profile. You can now see personalized tips on your dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => router.push('/dashboard')}>Go to Dashboard</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
