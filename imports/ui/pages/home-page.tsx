import React from 'react';
import {ContentPanel} from '@/components/content-panel'
import {Link} from 'react-router-dom'
import {Button} from '@/components/button'

const HomePage = () => {
  return <div className="container py-20">
    <div className="flex justify-between">
      <div className="mb-8">
        <span className="text-2xl font-semibold">Welcome to the Draft Controller!</span>
      </div>
    </div>

    <div>
      If you're seeing this it means you're running the application locally and you might want to view one of the below
      routes. If this is what you're seeing in OBS then you have added the general route and will instead want: localhost:3000/streamer
    </div>

    <div className="grid grid-cols-2 gap-6">
      <ContentPanel className={"max-w-[640px] w-full mx-auto mt-4"}>
        <Link to={"streamer"}>
          <Button>Streamer Page</Button>
        </Link>
      </ContentPanel>

      <ContentPanel className={"max-w-[640px] w-full mx-auto mt-4"}>
        <Link to={"shaun"}>
          <Button>Controller Page</Button>
        </Link>
      </ContentPanel>
    </div>
  </div>
};

export default HomePage;
