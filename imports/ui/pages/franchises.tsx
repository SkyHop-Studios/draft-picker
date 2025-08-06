import React from 'react';
import {useMethodQuery} from '/imports/rpc/rpc-hooks'
import _ from "lodash";
import {Pencil} from 'lucide-react'
import {Link} from 'react-router-dom'

const Franchises = () => {
  const { data: franchises } = useMethodQuery("draft.getFranchises");

  return <div className="px-6 py-6 background-image h-screen" style={{backgroundImage: "url(/RSC-SSA-1920x1080.jpg)"}}>
    <div className="mb-6 text-white">
      <h1 className="text-4xl font-bold">Franchises</h1>
    </div>

    <div className="grid grid-cols-3 gap-6">
      <div className="text-white">Franchise Name:</div>
      <div className="text-white">Franchise Owner:</div>
      <div className="text-white">Actions</div>
    </div>
    <div className="flex flex-col gap-6">
      {_.map(franchises, (franchise) => {
        return <div className="grid grid-cols-3 gap-6">
          <div className="text-white">{franchise.name}</div>

          <div>
            {franchise.logo}
          </div>

          <div>
            <Link to={`edit/${franchise._id}`}>
              <Pencil />
            </Link>
          </div>
        </div>
      })}
    </div>
  </div>
};

export default Franchises;
