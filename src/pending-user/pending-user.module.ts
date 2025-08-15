import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PendingUserController } from './pending-user.controller';
import { PendingUserService } from './pending-user.service';
import { PendingUserSchema } from './schema/entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'PendingUser', schema: PendingUserSchema }]),
  ],
  controllers: [PendingUserController],
  providers: [PendingUserService],
  exports: [PendingUserService],
})
export class PendingUserModule {}
