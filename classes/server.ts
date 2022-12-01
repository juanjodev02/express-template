import express, { Express } from 'express'
import cookieParser from 'cookie-parser'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import logger from 'morgan'
import { Logger } from './logger'
import { IRouter } from '../routes/IRouter'

export type ServerLoggerLevel = 'dev' | 'common' | 'combined' | 'tiny' | 'short'

export interface ServerConstructor {
  port: number
  routers: IRouter[]
  prefix?: string
  loggerLevel?: ServerLoggerLevel
  swaggerEnabled?: boolean
}

export class Server {
  private readonly _app: Express
  private readonly _port: number
  private readonly _logger = new Logger({ namespace: 'SERVER' })
  private readonly _loggerLevel: ServerLoggerLevel
  private readonly _swaggerEnabled: boolean
  private readonly _prefix: string
  private readonly _routes: IRouter[] = []

  constructor ({ port, routers, prefix = '', loggerLevel = 'dev', swaggerEnabled = false }: ServerConstructor) {
    this._app = express()
    this._port = port
    this._routes = routers
    this._prefix = prefix
    this._loggerLevel = loggerLevel
    this._swaggerEnabled = swaggerEnabled
    this._initServer()
    this._initRoutes()
    if (this._swaggerEnabled) {
      this.setupSwagger()
    }
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
      const path = `${this._prefix}${route.path}`
      this._app.use(path, route.router)
      this._logger.info(`Route ${path} registered`)
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

  public setupSwagger (): void {
    // TODO: migrate to tsoa: https://tsoa-community.github.io/docs/
    const swaggerSpec = swaggerJSDoc({
      failOnErrors: true,
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Dwolla Integrator API',
          version: '1.0.0'
        }
      },
      swaggerDefinition: {
        info: {
          title: 'Dwolla Integrator API',
          version: '1.0.0'
        },
        basePath: this._prefix
      },
      apis: ['routes/*.ts']
    })

    this._app.use(`${this._prefix}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  }
}
