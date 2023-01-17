import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { SubscribeProfile } from '../csr_pages/subscribeProfile'
import { routes } from './routes'

export const Routers: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/:id" element={<SubscribeProfile />} />
      <Route path="/" element={<Layout />}>
        {routes.map((route) => (
          <Route
            {...route}
            key={route.key}
            path={`${route.path}${route.params ?? ''}`}
          />
        ))}
      </Route>
    </Routes>
  </BrowserRouter>
)
