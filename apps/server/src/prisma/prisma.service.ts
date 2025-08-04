import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@message-app/schemas';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // [x: string]: any;
  async onModuleInit() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await this.$connect();
  }
}
