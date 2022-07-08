import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { routes } from './routes'

export const Routers: React.FC = () => (
  <BrowserRouter>
    <Suspense fallback={null}>
      <Routes>
        {routes.map((route) => (
          <Route
            {...route}
            key={route.key}
            path={`${route.path}${route.params ?? ''}`}
          />
        ))}
      </Routes>
    </Suspense>
  </BrowserRouter>
)
