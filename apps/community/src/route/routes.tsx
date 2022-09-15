import { RouteProps } from 'react-router-dom'
import { RoutePath } from './path'
import { Index } from '../pages'
import { Dashboard } from '../pages/dashboard'
import { NewMessage } from '../pages/message/new'

interface ExpandedRouterProps extends RouteProps {
  key: string
  params?: string
  path: string
}

export const routes: ExpandedRouterProps[] = [
  {
    path: RoutePath.Index,
    key: 'index',
    element: <Index />,
  },
  {
    path: RoutePath.Dashboard,
    key: 'dashboard',
    element: <Dashboard />,
  },
  {
    path: RoutePath.NewMessage,
    key: 'new_message',
    element: <NewMessage />,
  },
]
