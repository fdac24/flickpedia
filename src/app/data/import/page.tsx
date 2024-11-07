"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { DataImportForm, DataImportFormSchema } from "@/types/DataImportForm";

export default function InputForm() {
  const form = useForm<DataImportForm>({
    resolver: zodResolver(DataImportFormSchema),
    defaultValues: {
      show: undefined,
      showName: "",
      scripts: [],
    },
  });

  type Show = {
    _id: string;
    name: string;
    seasons: [];
  };

  const [shows, setShows] = useState<Show[]>([]);

  useEffect(() => {
    const fetchShows = async () => {
      const shows = await fetch("/api/show").then((res) => res.json());
      console.log(shows);
      setShows(shows);
    };

    fetchShows();
  }, []);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "scripts",
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      append({
        name: file.name,
        size: file.size,
        type: file.type as "text/plain",
        season: 0,
        episode_name: "",
        episode_number: 0,
      });
    });
  };

  const onSubmit = (data: DataImportForm) => {
    console.log(data);
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      {/* Title here later */}
      <h3 className="font-semibold text-gray-700 text-3xl">Data Import</h3>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[90vw] max-w-[800px] space-y-6"
        >
          {/* Select Show */}
          <FormField
            control={form.control}
            name="show"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-gray-700">Show</FormLabel>
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
                    <SelectItem value="-1">Add a New Show</SelectItem>
                    {shows.map((show) => (
                      <SelectItem key={show._id} value={show._id}>
                        {show.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* New Show Name */}
          {form.watch("show") === "-1" && (
            <FormField
              control={form.control}
              name="showName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-700">Show Name</FormLabel>
                  <FormControl>
                    <Input placeholder="The Office" {...field} />
                  </FormControl>
                  <FormDescription>
                    Make sure to format the show name properly.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Script Upload */}
          <FormField
            control={form.control}
            name="scripts"
            render={() => (
              <FormItem>
                <FormLabel className="font-semibold text-gray-700">Upload Scripts</FormLabel>
                <FormControl>
                  <div>
                    <Input type="file" multiple onChange={handleFileUpload} />
                    {form.watch("scripts").length > 0 && (
                      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 items-center mt-4 font-semibold text-gray-700">
                        <p className="col-span-1">File Name</p>
                        <p className="col-span-1">Season</p>
                        <p className="col-span-1">Episode Number</p>
                        <p className="col-span-1">Episode Name</p>
                      </div>
                    )}
                    {fields.map((field, index) => (
                      <div
                        className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 items-center mt-4" // 5 columns for file name, season, episode number, episode name, and delete button
                        key={field.id}
                      >
                        <p className="col-span-1">{field.name}</p>{" "}
                        {/* File name */}
                        <Input
                          type="number"
                          placeholder="Season"
                          {...form.register(`scripts.${index}.season`, {
                            valueAsNumber: true,
                          })}
                          className="col-span-1" // Season input field
                        />
                        <Input
                          type="number"
                          placeholder="Episode Number"
                          {...form.register(`scripts.${index}.episode_number`, {
                            valueAsNumber: true,
                          })}
                          className="col-span-1" // Episode number input field
                        />
                        <Input
                          placeholder="Episode Name"
                          {...form.register(`scripts.${index}.episode_name`)}
                          className="col-span-1" // Episode name input field
                        />
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="col-span-1 text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
