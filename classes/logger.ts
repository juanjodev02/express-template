import chalk from 'chalk'

export class Logger {
  private readonly namespace: string
  constructor ({ namespace = 'DEFAULT' }: { namespace?: string }) {
    this.namespace = namespace
  }

  public info (message: string): void {
    console.log(chalk.bgBlue(`[${this.namespace}]`), chalk.gray(new Date().toISOString()), chalk.blue(message))
  }

  public error (message: string): void {
    console.log(chalk.bgRed(`[${this.namespace}]`), chalk.gray(new Date().toISOString()), chalk.red(message))
  }

  public warn (message: string): void {
    console.log(chalk.bgYellow(`[${this.namespace}]`), chalk.gray(new Date().toISOString()), chalk.yellow(message))
  }

  public debug (message: string): void {
    console.log(chalk.bgGreen(`[${this.namespace}]`), chalk.gray(new Date().toISOString()), chalk.green(message))
  }
}
