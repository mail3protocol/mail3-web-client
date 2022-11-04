import { RoutePath } from '../path'

export const unauthorizedRedirectTo = RoutePath.Index

export const allowWithoutAuthPathnameSet = new Set<string>([RoutePath.Index])
