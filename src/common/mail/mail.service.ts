import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(private readonly mailerService: MailerService) {}

  async sendRoleChangeNotification(email: string, name: string, newRole: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Role Change Notification',
      template: './role-change', // The name of the template file (role-change.hbs)
      context: {
        username: name, // Events.AU
        newRole: newRole,
      },
    });
  }

  async sendEventCreationNotification(adminEmail: string, eventName: string, organizerName: string) {
    this.logger.debug(`Preparing to send email to: ${adminEmail} for event: ${eventName}`);
    try {
      await this.mailerService.sendMail({
        to: adminEmail,
        subject: 'New Event Created',
        template: './new-event', // The name of the template file (new-event.hbs)
        context: {
          eventName: eventName,
          organizerName: organizerName,
        },
      });
      this.logger.debug(`Email sent to: ${adminEmail}`);
    } catch (err) {
      this.logger.error(`Failed to send email to: ${adminEmail}`, err.stack);
      throw err;
    }
  }

  async sendEventJoinNotification(organizerEmail: string, eventName: string, userEmail: string, organizerName: string) {
    this.logger.debug(`Preparing to send email to: ${organizerEmail} for event: ${eventName}`);
    try {
      await this.mailerService.sendMail({
        to: organizerEmail,
        subject: 'New User Joined Your Event',
        template: './event-join', // The name of the template file (event-join.hbs)
        context: {
          eventName: eventName,
          userEmail: userEmail,
          organizerName: organizerName,
        },
      });
      this.logger.debug(`Email sent to: ${organizerEmail}`);
    } catch (err) {
      this.logger.error(`Failed to send email to: ${organizerEmail}`, err.stack);
      throw err;
    }
  }
}
