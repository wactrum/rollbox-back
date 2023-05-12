import { Module } from '@nestjs/common';
import { GreensmsService } from './greensms.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [GreensmsService],
  exports: [GreensmsService],
})
export class GreensmsModule {}
