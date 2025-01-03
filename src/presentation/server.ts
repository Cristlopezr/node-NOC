import { CronService } from './cron/cron-service';
import { CheckService } from '../domain/use-cases/checks/check-service.use-case';
import { LogRepositoryImpl } from '../infrastructure/repositories/log.repository.impl';
import { FileSystemDatasource } from '../infrastructure/datasources/file-system.datasource';
import { EmailService } from './email/email.service';
import { SendEmailLogs } from '../domain/use-cases/email/send-logs.use-case';

const fileSystemLogRepository = new LogRepositoryImpl(new FileSystemDatasource());
const emailService = new EmailService();

export class Server {
    public static start() {
        console.log('Server started');

        /* new SendEmailLogs(emailService, fileSystemLogRepository).execute(['']); */
        CronService.createJob('*/5 * * * * *', () => {
            const url = 'https://google.com';
            /* const url = 'http://localhost:3000'; */
            new CheckService(
                fileSystemLogRepository,
                () => console.log(`${url} is ok`),
                error => console.log(error)
            ).execute(url);
        });
    }
}
