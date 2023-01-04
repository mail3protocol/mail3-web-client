import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { SubscribeProfile } from '../pages/subscribeProfile'
import { SubscriptionArticle } from '../pages/subscriptionArticle'
import { routes } from './routes'

export const Routers: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/p/:id" element={<SubscriptionArticle />} />
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
