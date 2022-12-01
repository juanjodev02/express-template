import express, { Router } from 'express'
import { IRouter } from './IRouter'

export class IntegratorRouter implements IRouter {
  public readonly router: Router
  public readonly path = '/integrator'

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
     *     responses:
     *       200:
     *         description: Created
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     */
    this.router.get('/health-check', (req, res, next) => {
      res.send({
        message: 'I am alive'
      })
    })
  }
}
