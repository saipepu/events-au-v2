import { Module } from '@nestjs/common';
import { UnitController } from './unit.controller';
import { UnitService } from './unit.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UnitSchema } from './schema/unit.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnitMemberModule } from 'src/unit-member/unit-member.module';
import { EventUnitModule } from 'src/event-unit/event-unit.module';
import { UnitAdminModule } from 'src/unit-admin/unit-admin.module';
import { UnitAdminService } from 'src/unit-admin/unit-admin.service';
import { UnitAdminSchema } from 'src/unit-admin/schema/unit-admin.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Unit', schema: UnitSchema },
      { name: 'UnitAdmin', schema: UnitAdminSchema }
    ]),
    UnitMemberModule,
    EventUnitModule,
    UnitAdminModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>("JWT_SECRET"),
          signOptions: {
            expiresIn: config.get<string | number>("JWT_EXPIRES"),
          }
        }
      }
    }),
  ],
  controllers: [UnitController],
  providers: [UnitService, UnitAdminService],
  exports: [UnitService]
})
export class UnitModule {}
