import { Server } from './classes/server'
import { ConfigService } from './utils/config'
import { MainRouter } from './routes'

const main = async (): Promise<void> => {
  const configService = new ConfigService()

  const mainRouter = new MainRouter()

  const server = new Server({
    port: configService.getConfig().PORT,
    routers: [
      mainRouter
    ],
    loggerLevel: 'dev'
  })

  server.listen()
}

void (async () => {
  await main()
})()
