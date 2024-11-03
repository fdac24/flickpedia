"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getShows } from "@/db/actions/show";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

const FormSchema = z.object({
  show: z.string().min(2, { message: "Show is required." }),
  season: z.number().min(1, { message: "Season is required." }),
  episode_name: z.string().min(2, { message: "Episode name is required." }),
  episode_number: z.number().min(1, { message: "Episode number is required." }),
  script: z.instanceof(File),
});

export default function InputForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      show: "",
      season: 0,
      episode_name: "",
      episode_number: 0,
      script: undefined,
    },
  });

  const [shows, setShows] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    async function fetchShows() {
      await getShows().then((shows) => setShows(shows));
    }
    fetchShows();
  }, []);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[90vw] max-w-[500px] space-y-6"
        >
          <h3 className="text-4xl font-bold">Data Import</h3>

          {/* Shows */}
          <FormField
            control={form.control}
            name="show"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Show</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a show" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {shows.map((show) => (
                      <SelectItem value={show._id}>{show.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Season */}
          <FormField
            control={form.control}
            name="season"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Season</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row space-x-2 w-full">
            <FormField
              control={form.control}
              name="episode_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Episode Name</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="episode_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Episode Number</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="script"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Script</FormLabel>
                <FormControl>
                  <Input
                    placeholder="shadcn"
                    type="file"
                    onChange={(e) => {
                      field.onChange(e.target.files);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
