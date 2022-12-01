import express, { Router } from 'express'
import { IRouter } from './IRouter'

export class MainRouter implements IRouter {
  public readonly router: Router
  public readonly path = '/'

  constructor () {
    this.router = express.Router()
    this._init()
  }

  private _init (): void {
    this.router.get('/', (req, res, next) => {
      res.send({
        message: 'I am alive'
      })
    })
  }
}
