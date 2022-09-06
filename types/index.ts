import express from 'express'

export type TConfigRouter = {
  main?: boolean
  baseUrl?: string
  routesPath?: string
  routesUrl?: string
  middleware?: express.Handler | string | (express.Handler | string)[]
  controller?: express.Handler | string
  apiDocs?: {
    title?: string
  }
}
