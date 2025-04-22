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
import { updateProfile } from "@/lib/actions/profile"
import { useProfileContext } from "@/contexts/profile-context"
import { supabase } from "@/lib/supabase"

// Sample user data structure
// Export the UserProfile type
export interface UserProfile {
  email: string
  firstName: string
  lastName: string
  dob?: Date
  avatarUrl?: string
  userId: string
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
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const { refetch } = useProfileContext();

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

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files[0]) {
      const file = files[0]
      
      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB')
        event.target.value = ""
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file')
        event.target.value = ""
        return
      }
      
      // Show preview immediately
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      try {
        // Create a unique file path using user ID and timestamp
        const fileExt = file.name.split('.').pop()
        const filePath = `${userData?.userId}/avatar.${fileExt}`

        // Upload directly to Supabase storage
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          })

        if (uploadError) {
          toast.error("Error uploading avatar. Please try again.")
          return
        }

        // Get the public URL of the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath)

        // Update the user's profile with the new avatar URL
        const result = await updateProfile({
          first_name: form.getValues('firstName'),
          last_name: form.getValues('lastName'),
          dob: form.getValues('dob')?.toISOString() || null,
          avatar: publicUrl,
        })

        if (result.error) {
          toast.error(result.error)
          return
        }

        setAvatarPreview(publicUrl)
        refetch()
        toast.success('Avatar updated successfully')
      } catch (error) {
        console.error('Upload error:', error)
        toast.error("Failed to upload avatar")
        // Reset preview on error
        setAvatarPreview(userData?.avatarUrl || null)
      }
    } else {
      event.target.value = "";
      if (!files || files.length === 0) {
        setAvatarPreview(userData?.avatarUrl || null);
      }
      form.setValue("avatar", undefined, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true)
    try {
      const result = await updateProfile({
        first_name: data.firstName,
        last_name: data.lastName,
        dob: data.dob?.toISOString() || null,
        avatar: avatarPreview || null,
      })

      if (result.error) {
        toast.error(result.error)
        return
      }

      // Refresh the profile context
      refetch()
      
      toast.success("Profile updated successfully!")
      form.reset({ ...data, avatar: undefined });
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    } catch (error) {
      console.error('=> onSubmit error:', error)
      toast.error("Failed to update profile.")
    } finally {
      setIsSubmitting(false)
    }
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
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarPreview || undefined} alt="User avatar" />
                  <AvatarFallback>{userData?.firstName?.[0]}{userData?.lastName?.[0]}</AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute -bottom-0.5 -right-0.5 h-9 w-9 cursor-pointer border-3 border-white rounded-full hover:shadow-md transition-all duration-300 bg-primary hover:bg-primary hover:scale-110"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  <Pencil className="h-4 w-4 text-white" />
                </Button>
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={avatarInputRef}
                  onChange={(e) => {
                    field.onChange(e.target.files);
                    handleAvatarChange(e);
                  }}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* First Name & Last Name Row */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormDescription>
                Your email address cannot be changed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date of Birth Field */}
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth (Optional)</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                />
              </FormControl>
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