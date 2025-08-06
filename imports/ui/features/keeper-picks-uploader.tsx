import React from 'react';
import {useMethodMutation} from '/imports/rpc/rpc-hooks'
import {Button} from '@/components/button'
import {Tiers} from '/imports/core/domain/entities/players'

import Papa from 'papaparse';
import {FranchisesSlugs} from "/imports/core/domain/entities/franchises";

export const KeeperUploaderFrom = () => {
  const updatePlayersCMVMutation = useMethodMutation("players.uploadKeepers");

  const handleFileUpload = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const fileInput = evt.currentTarget.elements.namedItem('playerData') as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (file) {
      Papa.parse(file, {
        header: true, // Assumes the first row is the header
        complete: (results) => {
          const playerData = results.data.map((row: any) => {
            return  ({
              name: row['Manager Name'],
              playerID: row['Profile ID'],
              pickRound: parseInt(row['Keeper']),
              franchise: FranchisesSlugs[row['Franchise']],
              cmv: parseInt(row['CMV'], 10),
              tier: row['Tier'].toLowerCase() as Tiers,
              role: row['Role']
            })
          });

          // Call the Meteor method with the parsed player data
          updatePlayersCMVMutation.mutate(playerData, {
            onSuccess: () => {
              console.log('Player data updated successfully');
            },
            onError: (error) => {
              console.error('Error updating player data:', error);
            },
          });
        },
        error: (error) => {
          console.error('Error parsing CSV file:', error);
        },
      });
    }
  };

  return <>
    <form className="flex justify-between items-center" onSubmit={handleFileUpload}>
      <input name="playerData" type="file" accept={".csv"}/>

      <Button type="submit">Submit Keeper Picks</Button>
    </form>
  </>
};
