import { connect, Model, MongooseError, Query, Schema } from 'mongoose';

const url = process.env.DB_URL;

export enum DatabaseErrorCodes {
    DUPLICATE = '11000',
}

export class DuplicateRecordError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'DuplicateRecordError';
      Object.setPrototypeOf(this, DuplicateRecordError.prototype);
    }
}

export class DatabaseError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'DatabaseError';
      Object.setPrototypeOf(this, DatabaseError.prototype);
    }
}

export function dbConnect() {
    return new Promise((resolve, reject) => {
        if (!url) {
            reject('Database Connection URL not provided');
            return;
        }

        connect(url).then(() => {
            resolve('successfully connected to the database');
        }).catch(e => {
            reject(e);
        })
    })
}

export function isErrorOfType(err: Error, instanceClass: any) {
    try {
        const testInstance = new instanceClass();
        return err.name === testInstance.name;
    } catch (e) {
        return false;
    }
}

export class ErrorParser {
    static isDuplicate(error: MongooseError) {
        return error.message.toString().includes(DatabaseErrorCodes.DUPLICATE);
    }
}

export class BaseModel {

    protected model: Model<any>;

    protected hiddenProps: undefined | string[];
    
    constructor(model: Model<any>) {
        this.model = model;
    }

    cleanRecord(record: any) {
        if (this.hiddenProps) {
            try {
                const recordObject = record.toObject();

                this.hiddenProps.map(prop => {
                    delete recordObject[prop];
                })

                return recordObject;

            } catch (e) {
                throw new Error("Failed to remove hidden props from record: " + JSON.stringify({
                    record,
                    hiddenProps: this.hiddenProps
                }));
                
            }
        } else {
            return record;
        }
    }

    cleanRecords(records: any[]) {
        if (this.hiddenProps) {
            const cleanedRecords = records.map(item => {
                return this.cleanRecord(item);
            })

            return cleanedRecords;
        } else {
            return records;
        }
    }
}