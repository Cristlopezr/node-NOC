import { CronService } from './cron/cron-service';
import { CheckService } from '../domain/use-cases/checks/check-service.use-case';
import { LogRepositoryImpl } from '../infrastructure/repositories/log.repository.impl';
import { FileSystemDatasource } from '../infrastructure/datasources/file-system.datasource';
import { EmailService } from './email/email.service';
import { SendEmailLogs } from '../domain/use-cases/email/send-logs.use-case';
import { PostgresLogDatasource } from '../infrastructure/datasources/postgres-log.datasource';
import { CheckServiceMultiple } from '../domain/use-cases/checks/check-service-multiple.use-case';
import { MongoLogDatasource } from '../infrastructure/datasources/mongo-log.datasource';

const fileSystemLogRepository = new LogRepositoryImpl(new FileSystemDatasource());
const mongoLogRepository = new LogRepositoryImpl(new MongoLogDatasource());
const postgresLogRepository = new LogRepositoryImpl(new PostgresLogDatasource());
const emailService = new EmailService();

//crontTime =*/5 * * * * *
export class Server {
    public static start() {
        console.log('Server started');

        /* new SendEmailLogs(emailService, fileSystemLogRepository).execute(['']); */
        CronService.createJob('*/5 * * * * *', () => {
            /* const url = 'https://google.com'; */
            const url = 'http://localhost:3000';
            new CheckServiceMultiple(
                [fileSystemLogRepository, mongoLogRepository, postgresLogRepository],
                () => console.log(`${url} is ok`),
                error => console.log(error)
            ).execute(url);
        });
    }
}
