import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ApiTokenCheckMiddleware } from './common/api-token-check.middleware';
import { RestrictedTokenSchema } from './auth/schema/restrictedToken.schema';
import { EventModule } from './event/event.module';
import { OrganizerModule } from './organizer/organizer.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ParticipantModule } from './participant/participant.module';
import { UnitModule } from './unit/unit.module';
import { EventUnitModule } from './event-unit/event-unit.module';
import { UnitMemberModule } from './unit-member/unit-member.module';
import { AdminModule } from './admin/admin.module';
import { UnitAdminModule } from './unit-admin/unit-admin.module';
import { isOrganizer } from './common/isOrganizer.middleware';
import { OrganizerSchema } from './organizer/schema/organizer.schema';
import { isAdmin } from './common/isAdmin.middleware';
import { AdminSchema } from './admin/schema/admin.schema';
import { EventUnitSchema } from './event-unit/schema/event-unit.schema';
import { UnitSchema } from './unit/schema/unit.schema';
import { UnitAdminSchema } from './unit-admin/schema/unit-admin.schema';
import { EventSchema } from './event/schema/event.schema';
import { UserSchema } from './user/schema/user.schema';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MailModule } from './common/mail/mail.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    MongooseModule.forFeature([
      { name: 'RestrictedToken', schema: RestrictedTokenSchema },
      { name: 'Organizer', schema: OrganizerSchema },
      { name: 'Admin', schema: AdminSchema },
      { name: 'EventUnit', schema: EventUnitSchema },
      { name: 'Unit', schema: UnitSchema },
      { name: 'UnitAdmin', schema: UnitAdminSchema},
      { name: 'Event', schema: EventSchema}
    ]),
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
    UserModule,
    AuthModule,
    EventModule,
    OrganizerModule,
    ParticipantModule,
    UnitModule,
    EventUnitModule,
    UnitMemberModule,
    AdminModule,
    UnitAdminModule,
    MailModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'u6410381@au.edu',
          pass: 'otlz jfui llbs dkih',
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@example.com>',
      },
      template: {
        dir: join(__dirname, '..', 'src', 'templates'), // <-- Update the path
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*']
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(ApiTokenCheckMiddleware)
        .forRoutes({ path: '/orgg/*', method: RequestMethod.ALL })
      consumer
        .apply(isOrganizer)
        .forRoutes({ path: '/org/event/:eventId/*', method: RequestMethod.ALL})
      consumer
        .apply(isAdmin)
        .forRoutes({ path: '/admin/event/:eventId/*', method: RequestMethod.ALL })
  }
}
