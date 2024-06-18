import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly sendEmail = false;
  constructor(private readonly mailerService: MailerService) {}

  async sendRoleChangeNotification(email: string, name: string, newRole: string) {
    this.logger.debug(`Preparing to send email to: ${email} for role change.`);
    console.log(this.sendEmail)
    if(this.sendEmail) {
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
  }

  async sendEventCreationNotification(adminEmail: string[], eventName: string, organizerName: string) {
    this.logger.debug(`Preparing to send email to: ${adminEmail} for event: ${eventName}`);
    if(this.sendEmail) {
      try {
        await this.mailerService.sendMail({
          to: adminEmail.join(', '),
          subject: 'New Event Created',
          template: './new-event', // The name of the template file (new-event.hbs)
          context: {
            eventName: eventName,
            organizerName: organizerName,
          },
        });
      } catch (err) {
        this.logger.error(`Failed to send email to: ${adminEmail}`, err.stack);
        throw err;
      }
    }
  }

  async sendEventJoinNotification(organizerEmail: string[], userEmail: string, organizerName: string) {
    this.logger.debug(`Preparing to send email to: ${organizerEmail}.`);
    if(this.sendEmail) {
      try {
        await this.mailerService.sendMail({
          to: organizerEmail.join(', '),
          subject: 'New User Joined Your Event',
          template: './event-join', // The name of the template file (event-join.hbs)
          context: {
            // eventName: eventName,
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
  async sendLeaveEventNotification(organizerEmail: string[], userEmail: string, organizerName: string) {
    // this.logger.debug(`Preparing to send email to: ${organizerEmail} for event: ${eventName}`);
    if(this.sendEmail) {
      try {
        console.log(organizerEmail);
        await this.mailerService.sendMail({
          to: organizerEmail.join(', '),
          subject: 'User have left Your Event',
          template: './event-leave', // The name of the template file (event-join.hbs)
          context: {
            // eventName: eventName,
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

  async sendEventUpdateNotification(emails: string[], eventName: string, changes: any) {
    this.logger.debug(`Preparing to send email to: ${emails} for event: ${eventName}`);
    if(this.sendEmail) {
      try {
        await this.mailerService.sendMail({
          to: emails.join(', '),
          subject: 'Event Update Notification',
          template: './event-update', // The name of the template file (event-update.hbs)
          context: {
            eventName: eventName,
            changes: changes
          },
        });
        this.logger.debug(`Email sent to: ${emails}`);
      } catch (err) {
        this.logger.error(`Failed to send email to: ${emails}`, err.stack);
        throw err;
      }
    }
  }
  async sendParitcipantUpdateStatus(participantEmails: string[], status: string) {
    this.logger.debug(`Preparing to send email to: ${participantEmails} for status update: ${status}`);
    if(this.sendEmail) {
      try {
        await this.mailerService.sendMail({
          to: participantEmails.join(', '),
          subject: 'Event Status Update',
          template: './participant-update-status', // The name of the template file (event-update.hbs)
          context: {
            status: status,
          },
        });
        this.logger.debug(`Email sent to: ${participantEmails}`);
      } catch (err) {
        this.logger.error(`Failed to send email to: ${participantEmails}`, err.stack);
        throw err;
      }
    }
  }

  async sendEventUnitUpdateNotification(email: string, action: string, unit: string, eventId: string) {
    this.logger.debug(`Preparing to send email to: ${email} for action: ${action} on unit: ${unit} in event: ${eventId}`);
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Event Unit Update Notification',
        template: './event-unit-update', // The name of the template file (event-unit-update.hbs)
        context: {
          action: action,
          unit: unit,
          eventId: eventId,
        },
      });
      this.logger.debug(`Email sent to: ${email}`);
    } catch (err) {
      this.logger.error(`Failed to send email to: ${email}`, err.stack);
      throw err;
    }
  }
}
