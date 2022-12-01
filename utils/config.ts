import { config } from 'dotenv'
import joi from 'joi'
import { Logger } from '../classes/logger'

export interface TConfig {
  PORT: number
  NODE_ENV: 'development' | 'production' | 'test'
}

export class ConfigService {
  private readonly config: TConfig
  private readonly configSchema: joi.ObjectSchema<TConfig>
  private readonly logger = new Logger({
    namespace: 'ConfigService'
  })

  constructor () {
    this.logger.info('Initializing config service...')
    this.init()
    this.configSchema = this.getConfigSchema()
    this.config = {
      PORT: Number((process as any).env.PORT),
      NODE_ENV: (process as any).env.NODE_ENV
    }
    this.validateSchema()
  }

  private init (): void {
    config()
  }

  private getConfigSchema (): joi.ObjectSchema<TConfig> {
    return joi.object().keys({
      PORT: joi.number().required(),
      NODE_ENV: joi.string().valid('development', 'production', 'test').required()
    })
  }

  private validateSchema (): void {
    this.logger.info('Validating config schema...')
    const { error } = this.configSchema.validate(this.config)
    if (error !== undefined) {
      this.logger.error('Config schema validation failed: ' + JSON.stringify(error.message))
      process.exit(1)
      return
    }
    this.logger.info('Config schema validation passed')
  }

  public getConfig (): TConfig {
    return this.config
  }
}
