"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { submitFeedback } from "@/app/actions/feedback"

// Comment out attachment-related constants
// const MAX_FILE_SIZE = 4 * 1024 * 1024 // 4MB
// const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"]
// const ACCEPTED_EXTENSIONS_STRING = ".jpg, .jpeg, .png, .webp, .pdf"

// Comment out utility function
// const formatBytes = (bytes: number, decimals = 2) => {
//   if (bytes === 0) return "0 Bytes"
//   const k = 1024
//   const dm = decimals < 0 ? 0 : decimals
//   const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
//   const i = Math.floor(Math.log(bytes) / Math.log(k))
//   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
// }

// Update Zod schema to add max length
const feedbackSchema = z.object({
  subject: z.string()
  .min(10, { message: "Subject must be at least 10 characters." })
  .max(100, { message: "Subject must not exceed 100 characters." }),
  message: z.string()
    .min(10, { message: "Message must be at least 10 characters." })
    .max(500, { message: "Message must not exceed 500 characters." }),
  // attachment: z
  //   .custom<FileList>()
  //   .refine(
  //     (files) => !files || files.length === 0 || files[0].size <= MAX_FILE_SIZE,
  //     `Max file size is ${formatBytes(MAX_FILE_SIZE)}.`
  //   )
  //   .refine(
  //     (files) => !files || files.length === 0 || ACCEPTED_MIME_TYPES.includes(files[0].type),
  //     `Only ${ACCEPTED_EXTENSIONS_STRING} files are accepted.`
  //   )
  //   .optional(),
})

type FeedbackFormValues = z.infer<typeof feedbackSchema>

// Props interface
interface FeedbackModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

// The FeedbackModal Component
export function FeedbackModal({ isOpen, onOpenChange }: FeedbackModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Comment out file preview state
  // const [filePreview, setFilePreview] = useState<FilePreview | null>(null)
  // const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      subject: "",
      message: "",
      // attachment: undefined,
    },
  })

  // Reset state when modal closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset()
      // setFilePreview(null)
      // if (fileInputRef.current) {
      //   fileInputRef.current.value = ""
      // }
    }
    onOpenChange(open)
  }

  // Comment out file handling functions
  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   // ... existing code ...
  // }

  // const removeFile = () => {
  //   // ... existing code ...
  // }

  // Handle form submission
  const onSubmit = async (data: FeedbackFormValues) => {
    setIsSubmitting(true)
    try {
      const result = await submitFeedback({
        subject: data.subject,
        message: data.message
      })

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success("Feedback submitted successfully!")
      handleOpenChange(false)
    } catch (error) {
      console.error('Error submitting feedback:', error)
      toast.error("Failed to submit feedback. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* Added backdrop blur for nicer effect */}
      <DialogContent className="sm:max-w-[550px] p-0 backdrop-blur-sm">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Submit Feedback</DialogTitle>
          <DialogDescription>
            Help us improve Trade Pulse. Your input is valuable.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-5 px-6 pb-6 max-h-[calc(90vh-180px)] overflow-y-auto">
            {/* Subject Field */}
            <div className="grid gap-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="e.g., Issue with chart loading"
                {...form.register("subject")}
                className={cn(
                  form.formState.errors.subject && form.formState.touchedFields.subject && "border-destructive focus-visible:ring-destructive"
                )}
              />
              {form.formState.errors.subject && form.formState.touchedFields.subject && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.subject.message}
                </p>
              )}
            </div>

            {/* Message Field */}
            <div className="grid gap-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Please provide as much detail as possible..."
                rows={5}
                {...form.register("message")}
                className={cn(
                  "resize-none",
                  form.formState.errors.message && form.formState.touchedFields.message && "border-destructive focus-visible:ring-destructive"
                )}
              />
              <div className="flex justify-between items-center">
                {form.formState.errors.message && form.formState.touchedFields.message && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.message.message}
                  </p>
                )}
                <p className={cn(
                  "text-xs ml-auto",
                  form.watch("message")?.length > 450 ? "text-yellow-500" : "text-muted-foreground",
                  form.watch("message")?.length > 490 ? "text-destructive" : ""
                )}>
                  {form.watch("message")?.length || 0}/500 characters
                </p>
              </div>
            </div>

            {/* Comment out attachment section */}
            {/* <div className="grid gap-3">
              ... existing attachment code ...
            </div> */}
          </div>

          {/* Footer with buttons */}
          <DialogFooter className="px-6 pb-6 mt-auto">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
              Submit Feedback
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 