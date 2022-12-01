import express, { Express } from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import { Logger } from './logger'
import { IRouter } from '../routes/IRouter'

export type ServerLoggerLevel = 'dev' | 'common' | 'combined' | 'tiny' | 'short'

export interface ServerConstructor {
  port: number
  routers: IRouter[]
  loggerLevel?: ServerLoggerLevel
}

export class Server {
  private readonly _app: Express
  private readonly _port: number
  private readonly _logger = new Logger({ namespace: 'SERVER' })
  private readonly _loggerLevel: ServerLoggerLevel
  private readonly _routes: IRouter[] = []

  constructor ({ port, routers, loggerLevel }: ServerConstructor) {
    this._app = express()
    this._port = port
    this._routes = routers
    this._loggerLevel = loggerLevel ?? 'dev'
    this._initServer()
    this._initRoutes()
  }

  private _initServer (): void {
    this._app.use(logger(this._loggerLevel))
    this._app.use(express.json())
    this._app.use(express.urlencoded({ extended: false }))
    this._app.use(cookieParser())
  }

  private _initRoutes (): void {
    if (!this._hasRoutes()) {
      throw new Error('No routes provided to server, at least one route is required')
    }

    this._routes.forEach(route => {
      this._app.use(route.path, route.router)
    })
  }

  private _hasRoutes (): boolean {
    return !!this._routes.length
  }

  private _isValidPort (): boolean {
    return !isNaN(this._port)
  }

  public listen (): void {
    if (!this._isValidPort()) {
      throw new Error(`Invalid port provided to server: ${this._port}`)
    }
    this._app.listen(this._port, () => {
      this._logger.info(`Server started on port ${this._port}`)
    })
  }

  public get app (): Express {
    return this._app
  }
}
