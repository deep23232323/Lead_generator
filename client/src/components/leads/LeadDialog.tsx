import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { leadService } from "../../services/lead.service";
import type { Lead } from "../../types/lead";
import { Loader2, AlertCircle } from "lucide-react";

const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  status: z.enum(["new", "contacted", "qualified", "lost"]),
  source: z.enum(["website", "instagram", "referral"]),
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface LeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Lead | null;
  onSuccess: () => void;
}

export const LeadDialog = ({ open, onOpenChange, lead, onSuccess }: LeadDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!lead;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      status: "new",
      source: "website",
    },
  });

  const status = watch("status");
  const source = watch("source");

  useEffect(() => {
    setError(null);
    if (lead && open) {
      reset({
        name: lead.name,
        email: lead.email,
        status: lead.status.toLowerCase() as any,
        source: lead.source.toLowerCase() as any,
      });
    } else if (!open) {
      reset({ status: "new", source: "website" });
    }
  }, [lead, open, reset]);

  const onSubmit = async (data: LeadFormValues) => {
    try {
      setIsLoading(true);
      setError(null);
      if (isEditing && lead) {
        await leadService.updateLead(lead._id, data);
      } else {
        await leadService.createLead(data);
      }
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      console.error("Failed to save lead", err);
      setError(err.response?.data?.message || "Failed to save lead. Please check your permissions and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Lead" : "Add New Lead"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {error && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-md flex items-center text-sm">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...register("name")} className={errors.name ? "border-destructive" : ""} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} className={errors.email ? "border-destructive" : ""} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(val: any) => setValue("status", val, { shouldValidate: true })}>
              <SelectTrigger className="capitalize">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new" className="capitalize">New</SelectItem>
                <SelectItem value="contacted" className="capitalize">Contacted</SelectItem>
                <SelectItem value="qualified" className="capitalize">Qualified</SelectItem>
                <SelectItem value="lost" className="capitalize">Lost</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Select value={source} onValueChange={(val: any) => setValue("source", val, { shouldValidate: true })}>
              <SelectTrigger className="capitalize">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="website" className="capitalize">Website</SelectItem>
                <SelectItem value="instagram" className="capitalize">Instagram</SelectItem>
                <SelectItem value="referral" className="capitalize">Referral</SelectItem>
              </SelectContent>
            </Select>
            {errors.source && <p className="text-sm text-destructive">{errors.source.message}</p>}
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Create Lead"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
