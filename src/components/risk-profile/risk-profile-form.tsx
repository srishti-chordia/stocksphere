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
  age: z.string({ required_error: "Please select an age range." }),
  goal: z.string({ required_error: "Please select an investment goal." }),
  tolerance: z.string({ required_error: "Please select your risk tolerance." }),
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
    if (values.age === "18-30") score += 3;
    if (values.age === "31-50") score += 2;
    if (values.age === "51+") score += 1;
    // Goal
    if (values.goal === "long-term") score += 3;
    if (values.goal === "medium-term") score += 2;
    if (values.goal === "short-term") score += 1;
    // Tolerance
    if (values.tolerance === "high") score += 3;
    if (values.tolerance === "medium") score += 2;
    if (values.tolerance === "low") score += 1;

    if (score <= 4) return "Conservative";
    if (score <= 7) return "Moderate";
    return "Aggressive";
  };

  async function onSubmit(values: FormValues) {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "You must be logged in to save your profile."
        });
        return;
    }
    setIsLoading(true);
    const profile = calculateProfile(values);
    try {
        await setDoc(doc(db, "riskProfiles", user.uid), { profile });
        setResultProfile(profile);
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Failed to save profile",
            description: "An unexpected error occurred.",
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base">What is your age range?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="18-30" />
                      </FormControl>
                      <FormLabel className="font-normal">18-30</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="31-50" />
                      </FormControl>
                      <FormLabel className="font-normal">31-50</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="51+" />
                      </FormControl>
                      <FormLabel className="font-normal">51+</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="goal"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base">What is your primary investment goal?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="long-term" />
                      </FormControl>
                      <FormLabel className="font-normal">Long-term Growth (5+ years)</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="medium-term" />
                      </FormControl>
                      <FormLabel className="font-normal">Medium-term Balance (2-5 years)</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="short-term" />
                      </FormControl>
                      <FormLabel className="font-normal">Short-term Capital Preservation (&lt;2 years)</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tolerance"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base">How would you describe your risk tolerance?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="high" />
                      </FormControl>
                      <FormLabel className="font-normal">High - I'm willing to take significant risks for high returns.</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="medium" />
                      </FormControl>
                      <FormLabel className="font-normal">Medium - I'm willing to take moderate risks for balanced returns.</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="low" />
                      </FormControl>
                      <FormLabel className="font-normal">Low - I prefer to avoid risk and prioritize capital safety.</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
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
