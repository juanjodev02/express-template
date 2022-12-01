import express, { Router } from 'express'
import { IRouter } from './IRouter'

export class MainRouter implements IRouter {
  public readonly router: Router
  public readonly path = ''

  constructor () {
    this.router = express.Router()
    this._init()
  }

  private _init (): void {
    /**
     * @openapi
     * /health-check:
     *   get:
     *     tags:
     *      - Main Router
     *     description: api health check
     *     summary: Returns health check status
     *     schema:
     *      type: object
     *      properties:
     *        status:
     *          type: string
     */
    this.router.get('/health-check', (req, res, next) => {
      res.send({
        message: 'I am alive'
      })
    })
  }
}
