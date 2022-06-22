import { BaseLogProvider } from "./baseLogProvider";

class ConsoleLogProvider extends BaseLogProvider {
    
    log(message: string): void {
        console.log(message)
    }
}

export {
    ConsoleLogProvider
}