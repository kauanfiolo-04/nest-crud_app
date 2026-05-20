/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // servidor SMTP
      port: parseInt(process.env.EMAIL_PORT ?? '587'),
      secure: false, // User SSL ou TLS (para ambientes de produção, certifique-se de usar "true" se o SMTP suportar SSL)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendEmail(to: string, subject: string, content: string) {
    const mailOptions = {
      from: `"No Reply" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      text: content
    };

    await this.transporter.sendMail(mailOptions);
  }
}
