import { Server } from './classes/server'
import { ConfigService } from './utils/config'
import { MainRouter } from './routes/mainRouter'

const main = async (): Promise<void> => {
  const configService = new ConfigService()

  const mainRouter = new MainRouter()

  const server = new Server({
    port: configService.getConfig().PORT,
    routers: [
      mainRouter
    ],
    loggerLevel: 'dev',
    prefix: '/api/dwolla-integrator',
    swaggerEnabled: true
  })

  server.listen()
}

void (async () => {
  await main()
})()
