import * as z from "zod";

export const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Video prompt is required",
  }),
  videoSize: z.string().min(1),
});

export const sizeOptions = [
  {
    value: "landscape_16_9",
    label: "Landscape 16:9",
  },
  {
    value: "portrait_16_9",
    label: "Portrait 9:16",
  },
  {
    value: "square_hd",
    label: "Square",
  },
];
