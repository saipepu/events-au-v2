import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSchema } from './schema/admin.schema';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { EventModule } from 'src/event/event.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnitAdminModule } from 'src/unit-admin/unit-admin.module';
import { UserModule } from 'src/user/user.module';
import { UnitAdminService } from 'src/unit-admin/unit-admin.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Admin', schema: AdminSchema},
      { name: 'UnitAdmin', schema: AdminSchema }
    ]),
    forwardRef(() => EventModule),
    UnitAdminModule,
    forwardRef(() => UserModule),
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
    })
  ],
  controllers: [AdminController],
  providers: [AdminService, UnitAdminService],
  exports: [AdminService]
})
export class AdminModule {}
