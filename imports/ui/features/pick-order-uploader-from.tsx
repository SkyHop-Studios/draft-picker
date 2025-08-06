import React from 'react';
import {useMethodMutation} from '/imports/rpc/rpc-hooks'
import {Button} from '@/components/button'

import Papa from 'papaparse';
import {FranchiseSlugs, FranchisesSlugs} from "/imports/core/domain/entities/franchises";

export const PickOrderFrom = () => {
  const updatePickOrderMutation = useMethodMutation("draft.defineDraftOrder");

  const handleFileUpload = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const fileInput = evt.currentTarget.elements.namedItem('pickOrder') as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (file) {
      Papa.parse(file, {
        header: true, // Assumes the first row is the header
        complete: (results) => {
          // Initialize the structure for the pick order
          const pickOrder = {
            master: [] as FranchiseSlugs[],
            elite: [] as FranchiseSlugs[],
            rival: [] as FranchiseSlugs[],
            prospect: [] as FranchiseSlugs[],
          };

          // Iterate over the parsed data and populate the pickOrder structure
          results.data.forEach((row: any) => {
            const { Master, Elite, Rival, Prospect } = row;
            console.log(row, Master, Elite, Rival, Prospect);

            pickOrder.master.push(FranchisesSlugs[Master]);
            pickOrder.elite.push(FranchisesSlugs[Elite]);
            pickOrder.rival.push(FranchisesSlugs[Rival]);
            pickOrder.prospect.push(FranchisesSlugs[Prospect]);
          });

          // Call the Meteor method with the parsed pick order data
          updatePickOrderMutation.mutate(pickOrder, {
            onSuccess: () => {
              console.log('Pick Order data updated successfully');
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
      <input name="pickOrder" type="file" accept={".csv"}/>

      <Button type="submit">Submit Draft Pick Order</Button>
    </form>
  </>
};
