// See https://reactrouter.com/en/main/routers/create-browser-router
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import React from 'react'
import HomePage from '@/pages/home-page'
import StreamerPage from '@/pages/streamer-page'
import ShaunPage from '@/pages/shaun-page'
import Franchises from '@/pages/franchises'

export const Router = () => {
  return <BrowserRouter>
    <Routes>
      <Route path="/">
        <Route index element={<HomePage />} />

        <Route path={"streamer"} element={<StreamerPage />} />
        <Route path={"shaun"} element={<ShaunPage />} />
        <Route path={"franchises"} element={<Franchises />} />
        <Route path={"franchises/edit/:franchiseId"} element={<Franchises />} />
      </Route>
    </Routes>
  </BrowserRouter>
}
