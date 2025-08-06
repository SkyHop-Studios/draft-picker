import { useMethodMutation } from "/imports/rpc/rpc-hooks";
import React from "react";
import { Button } from "@/components/button";

export const PlayerStatsUploaderForm = () => {
  const uploadStatsMutation = useMethodMutation("players.uploadStats");

  const handleFileUpload = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const fileInput = evt.currentTarget.elements.namedItem('playerData') as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (!file) {
      console.error("No file selected");
      return;
    }

    try {
      const text = await file.text(); // Read file content as string
      const parsedData = JSON.parse(text); // Parse JSON

      if (!Array.isArray(parsedData)) {
        console.error("Invalid JSON format: expected an array");
        return;
      }

      console.log(parsedData);

      uploadStatsMutation.mutate(parsedData, {
        onSuccess: () => {
          console.log("Player stats uploaded successfully");
        },
        onError: (error) => {
          console.error("Error uploading player stats:", error);
        },
      });
    } catch (error) {
      console.error("Error reading or parsing JSON file:", error);
    }
  };

  return (
    <form className="flex justify-between items-center" onSubmit={handleFileUpload}>
      <input name="playerData" type="file" accept=".json" />

      <Button type="submit">Submit Player Stats</Button>
    </form>
  );
};
