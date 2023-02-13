import { RouteProps } from 'react-router-dom'
import { RoutePath } from './path'
import { Index } from '../pages'
import { Dashboard } from '../pages/dashboard'
import { NewMessage } from '../pages/message/new'
import { SendRecords } from '../pages/message/send-records'
import { EarnNft } from '../pages/subscribe/earn-nft'
import { Information } from '../pages/information'
import { NotFoundPage } from '../pages/_404'
import { CoAuthors } from '../pages/co-authors'

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
  {
    path: RoutePath.SendRecords,
    key: 'send-records',
    element: <SendRecords />,
  },
  {
    path: RoutePath.EarnNft,
    key: 'earn-nft',
    element: <EarnNft />,
  },
  {
    path: RoutePath.Information,
    key: 'information',
    element: <Information />,
  },
  {
    path: RoutePath.CoAuthors,
    key: 'members',
    element: <CoAuthors />,
  },
  {
    path: '*',
    key: 'not-found',
    element: <NotFoundPage />,
  },
]
