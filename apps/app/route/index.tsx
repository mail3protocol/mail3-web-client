import React from 'react'
import ErrorPage from 'next/error'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { routes } from './routes'

export const Routers: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="*" element={<ErrorPage statusCode={404} />} />
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
