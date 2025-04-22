"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Pencil } from "lucide-react"
import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// Sample user data structure
// Export the UserProfile type
export interface UserProfile {
  email: string
  firstName: string
  lastName: string
  dob?: Date
  avatarUrl?: string
}

// Zod schema for validation
const profileFormSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  dob: z.date().optional(),
  avatar: z.custom<FileList>().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface ProfileSettingsFormProps {
  userData?: UserProfile
}

export function ProfileSettingsForm({ userData }: ProfileSettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(userData?.avatarUrl || null);
  const avatarInputRef = useRef<HTMLInputElement>(null); // Ref for avatar input

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      email: userData?.email || "",
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      dob: userData?.dob,
      avatar: undefined,
    },
  })

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files[0] && files[0].type.startsWith("image/")) {
      const file = files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      // RHF's field.onChange already handles setting the FileList value
    } else {
      // If invalid file or selection cancelled
      event.target.value = ""; // Clear the file input
      // Revert preview only if they cancelled selection, not if invalid type was just chosen
      if (!files || files.length === 0) {
         setAvatarPreview(userData?.avatarUrl || null);
      }
       // Optionally clear the RHF state if needed, though zod validation might handle it
      form.setValue("avatar", undefined, { shouldValidate: true });
      if (files && files.length > 0) {
          toast.error("Please select a valid image file.");
      }
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true)
    const updateData = {
      firstName: data.firstName,
      lastName: data.lastName,
      dob: data.dob,
      avatarFile: data.avatar?.[0], // Get the actual File object
    }
    console.log("Updating profile with:", updateData)

    // Simulate API call - use FormData if sending avatarFile
    // const formData = new FormData();
    // Object.entries(updateData).forEach(([key, value]) => {
    //   if (value !== undefined && value !== null) {
    //     formData.append(key, value as any);
    //   }
    // });

    await new Promise((resolve) => setTimeout(resolve, 1500))
    const success = Math.random() > 0.3

    if (success) {
      toast.success("Profile updated successfully!")
      // If API returns a new URL after upload, update the preview:
      // const newAvatarUrlFromApi = "/path/to/new/avatar.jpg";
      // setAvatarPreview(newAvatarUrlFromApi);
      // Reset the file input in the form state after successful upload
      form.reset({ ...data, avatar: undefined }); // Reset form but keep successful data, clear file input
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    } else {
      toast.error("Failed to update profile.")
    }
    setIsSubmitting(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

         {/* Avatar Upload - Centered with Bottom-Right Edit Button */}
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
             <FormItem className="flex flex-col items-center space-y-2">
                 {/* Relative container for avatar and button */}
                 <div className="relative">
                     <Avatar className="h-24 w-24"> {/* Avatar no longer clickable */}
                        <AvatarImage src={avatarPreview || undefined} alt="User avatar" />
                        <AvatarFallback>{userData?.firstName?.[0]}{userData?.lastName?.[0]}</AvatarFallback>
                    </Avatar>
                    {/* Edit Button - Positioned bottom-right */}
                     <Button 
                        type="button"
                        variant="secondary" // Use secondary or adjust as needed
                        size="icon"
                        className="absolute -bottom-0.5 -right-0.5 h-9 w-9 cursor-pointer border-3 border-white rounded-full hover:shadow-md transition-all duration-300 bg-primary hover:bg-primary hover:scale-110"
                        onClick={() => avatarInputRef.current?.click()}
                      >
                         <Pencil className="h-4 w-4 text-white" />
                     </Button>
                     {/* Hidden File Input */}
                      <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={avatarInputRef} // Ref for programmatic click
                          onChange={(e) => {
                              field.onChange(e.target.files); // Update RHF state
                              handleAvatarChange(e); // Update preview
                          }}
                      />
                  </div>
                <FormMessage />
            </FormItem>
          )}
        />

        {/* First Name & Last Name Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Email (Disabled) - Moved Below Name Row */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Your email address" {...field} disabled />
              </FormControl>
              {/* Removed FormDescription */}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date of Birth */}
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth (Optional)</FormLabel>
              <DatePicker
                date={field.value}
                setDate={field.onChange}
                placeholder="Select your date of birth"
              />
              <FormDescription>
                Your date of birth is used to personalize your experience.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update profile
        </Button>
      </form>
    </Form>
  )
} 