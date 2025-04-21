"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { FileText, Loader2, Paperclip, X } from "lucide-react"
import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import Image from "next/image"

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

const MAX_FILE_SIZE = 4 * 1024 * 1024 // 4MB
const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"]
const ACCEPTED_EXTENSIONS_STRING = ".jpg, .jpeg, .png, .webp, .pdf"

// Utility function to format bytes
const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

// Zod schema for validation
const feedbackSchema = z.object({
  subject: z.string().min(10, { message: "Subject must be at least 10 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
  attachment: z
    .custom<FileList>()
    .refine(
      (files) => !files || files.length === 0 || files[0].size <= MAX_FILE_SIZE,
      `Max file size is ${formatBytes(MAX_FILE_SIZE)}.`
    )
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_MIME_TYPES.includes(files[0].type),
      `Only ${ACCEPTED_EXTENSIONS_STRING} files are accepted.`
    )
    .optional(),
})

type FeedbackFormValues = z.infer<typeof feedbackSchema>

// Props interface
interface FeedbackModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

interface FilePreview {
  name: string
  type: string
  size: number
  previewUrl: string | null // Data URL for images, null for others
}

// The FeedbackModal Component
export function FeedbackModal({ isOpen, onOpenChange }: FeedbackModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filePreview, setFilePreview] = useState<FilePreview | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null) // Ref for the file input

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      subject: "",
      message: "",
      attachment: undefined,
    },
  })

  // Reset state when modal closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset()
      setFilePreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear native input
      }
    }
    onOpenChange(open)
  }

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) {
        form.setValue("attachment", undefined, { shouldValidate: true });
        setFilePreview(null)
        return;
    }
    
    const file = files[0];
    
    // Trigger validation using zod schema
    const validationResult = feedbackSchema.shape.attachment.safeParse(files);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0]?.message || "Invalid file";
      toast.error(`Attachment Error: ${errorMessage}`, { duration: 4000 });
      form.setValue("attachment", undefined, { shouldValidate: true }); // Clear and validate
      setFilePreview(null);
      if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset input visually
      }
      return;
    } else {
       // Manually clear errors if validation passes now
       form.clearErrors("attachment");
    }

    // Generate preview
    const previewData: FilePreview = {
      name: file.name,
      type: file.type,
      size: file.size,
      previewUrl: null,
    }

    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onloadend = () => {
        previewData.previewUrl = reader.result as string
        setFilePreview(previewData)
      }
      reader.readAsDataURL(file)
    } else {
      setFilePreview(previewData)
    }
    // Ensure the form value is set (validation already passed)
    form.setValue("attachment", files, { shouldValidate: true }); 
  }

  // Remove selected file
  const removeFile = () => {
    setFilePreview(null)
    form.setValue("attachment", undefined, { shouldValidate: true })
     if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear native input
     }
  }

  // Handle form submission
  const onSubmit = async (data: FeedbackFormValues) => {
    setIsSubmitting(true)
    console.log("Submitting feedback:", {
        subject: data.subject,
        message: data.message,
        attachment: data.attachment ? data.attachment[0] : undefined
    });

    // Simulate API call (using FormData if sending file)
    // const formData = new FormData();
    // formData.append("subject", data.subject);
    // formData.append("message", data.message);
    // if (data.attachment && data.attachment[0]) {
    //   formData.append("attachment", data.attachment[0]);
    // }
    // Replace with your actual API call: await fetch('/api/feedback', { method: 'POST', body: formData });
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const success = Math.random() > 0.3 // 70% chance of success

    if (success) {
      toast.success("Feedback submitted successfully!")
      handleOpenChange(false) // Close and reset modal
    } else {
      toast.error("Failed to submit feedback. Please try again.")
    }
    setIsSubmitting(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* Added backdrop blur for nicer effect */}
      <DialogContent className="sm:max-w-[550px] p-0 backdrop-blur-sm">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>Submit Feedback</DialogTitle>
          <DialogDescription>
            Help us improve Trade Pulse. Your input is valuable.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-5 px-6 py-5 max-h-[calc(90vh-180px)] overflow-y-auto">
            {/* Subject Field */}
            <div className="grid gap-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="e.g., Issue with chart loading"
                {...form.register("subject")}
                className={cn(form.formState.errors.subject && "border-destructive focus-visible:ring-destructive")}
              />
              {form.formState.errors.subject && (
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
                className={cn("resize-none", form.formState.errors.message && "border-destructive focus-visible:ring-destructive")}
              />
              {form.formState.errors.message && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.message.message}
                </p>
              )}
            </div>

            {/* Attachment Field & Preview Area */}
            <div className="grid gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="attachment">Attachment (Optional)</Label>
                 {/* Hidden actual input, triggered by styled button/label */}
                 <Input
                    id="attachment"
                    type="file"
                    accept={ACCEPTED_MIME_TYPES.join(",")}
                    onChange={handleFileChange}
                    className="sr-only" // Hide the default input
                    ref={fileInputRef} // Assign ref
                    // {...form.register("attachment")} // Let onChange handle setValue
                  />
                 {/* Styled trigger button */} 
                 <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filePreview && "text-muted-foreground",
                      form.formState.errors.attachment && "border-destructive focus-visible:ring-destructive"
                    )}
                    onClick={() => fileInputRef.current?.click()} // Trigger hidden input
                  >
                    <Paperclip className="mr-2 size-4" />
                    {filePreview ? filePreview.name : "Choose file..."}
                  </Button>
                   {/* Zod errors for the attachment field */}
                   {form.formState.errors.attachment && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.attachment.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Max size: {formatBytes(MAX_FILE_SIZE)}. Types: {ACCEPTED_EXTENSIONS_STRING}.
                  </p>
              </div>

              {/* File Preview Display */}
              {filePreview && (
                <div className="relative flex items-center gap-3 rounded-md border bg-muted/40 p-2.5 pr-10">
                  <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-md bg-background">
                    {filePreview.previewUrl ? (
                      <Image
                        src={filePreview.previewUrl}
                        alt={filePreview.name}
                        width={48}
                        height={48}
                        className="size-full rounded-md object-cover"
                      />
                    ) : filePreview.type === "application/pdf" ? (
                      <FileText className="size-7 text-muted-foreground" />
                    ) : (
                      <Paperclip className="size-7 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium">{filePreview.name}</p>
                    <p className="text-xs text-muted-foreground">{formatBytes(filePreview.size)}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1.5 top-1.5 size-7 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    onClick={removeFile}
                  >
                    <X className="size-4" />
                    <span className="sr-only">Remove file</span>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Footer with buttons */}
          <DialogFooter className="px-6 py-4 border-t mt-auto">
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