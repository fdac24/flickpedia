import { z } from "zod";

const FileSchema = z.object({
  name: z.string(),
  size: z
    .number()
    .max(10 * 1024 * 1024, { message: "File size must be less than 10MB." }),
  type: z.enum(["text/plain"], { message: "File type must be plain text." }),
});

export const DataImportFormSchema = z
  .object({
    show: z.string().min(1, "Show is required."),
    showName: z
      .string()
      .min(2, { message: "Show name is required." })
      .optional(),
    scripts: z
      .array(
        FileSchema.extend({
          season: z
            .number()
            .positive({ message: "Season number must be positive." }),
          episode_name: z
            .string()
            .min(1, { message: "Episode name is required." }),
          episode_number: z
            .number()
            .positive({ message: "Episode number must be positive." }),
        })
      )
      .nonempty({ message: "At least one script is required." }),
  })
  .refine((data) => (data.show === "-1" ? !!data.showName : true), {
    message: "Show name is required.",
    path: ["showName"],
  });

export type DataImportForm = z.infer<typeof DataImportFormSchema>;
