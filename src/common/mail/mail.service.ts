import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendRoleChangeNotification(email: string, name: string, newRole: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Role Change Notification',
      template: './role-change', // The name of the template file (role-change.hbs)
      context: {
        username: name,
        newRole: newRole,
      },
    });
  }
}
