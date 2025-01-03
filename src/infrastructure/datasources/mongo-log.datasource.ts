import { LogModel } from '../../data/mongo/models/log.model';
import { LogDataSource } from '../../domain/datasources/log.datasource';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';

export class MongoLogDatasource implements LogDataSource {
    async saveLog(log: LogEntity): Promise<void> {
        try {
            const newLog = await LogModel.create(log);
            console.log('Mongo Log created:', newLog);
        } catch (error) {
            throw new Error(`Error saving log: ${error}`);
        }
    }

    async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
        try {
            const logs = await LogModel.find({
                level: severityLevel,
            });

            const logsEntity = logs.map(mongoLog => LogEntity.fromObject(mongoLog));

            return logsEntity;
        } catch (error) {
            throw new Error(`Error getting logs: ${error}`);
        }
    }
}
