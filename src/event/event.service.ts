import { ParticipantService } from 'src/participant/participant.service';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event } from './schema/event.schema';
import mongoose from 'mongoose';
import { Query } from 'express-serve-static-core';
import { Organizer } from 'src/organizer/schema/organizer.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { User } from 'src/user/schema/user.schema';
import { UpdateEventDto } from './dto/update-event.dto';
import { OrganizerService } from 'src/organizer/organizer.service';
import { EventUnitService } from 'src/event-unit/event-unit.service';
import { UnitService } from 'src/unit/unit.service';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/common/mail/mail.service';
import { UnitAdminService } from 'src/unit-admin/unit-admin.service';

@Injectable()
export class EventService {

  private readonly logger = new Logger(EventService.name);

  constructor(
    @InjectModel(Event.name)
    private eventModel: mongoose.Model<Event>,
    private organizerService: OrganizerService,
    private eventUnitService: EventUnitService,
    private unitService: UnitService,
    private userService: UserService,
    private mailService: MailService,
    private unitAdminService: UnitAdminService,
  ) {}

  // find all events
  async findAll(query: Query) {
    const events = await this.eventModel.find(query);

    let result: any = events;
    for (let i = 0; i < result.length; i++) {
      const { success, message }: { success: boolean; message: any } =
        await this.eventUnitService.findByEventId(result[i]._id.toString());

      let unitNames = [];
      for (let j = 0; j < message.length; j++) {
        unitNames.push(message[j].name);
      }

      result[i] = { ...result[i].toObject(), units: unitNames };
    }

    return { success: true, message: events };
  }

  // find event by id
  async findById(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new NotAcceptableException('Event Id is invalid.');
    }

    const event = await this.eventModel.findById(id);

    if (!event) {
      throw new NotFoundException('Event not found.');
    }

    return event;
  }

  // create new event
  async create(body: CreateEventDto, user: User) {
    try {
      // check if user id is valid
      const u = await this.userService.findById(user._id);
      // check if unit id is valid
      const unit = await this.unitService.findById(body.unitId);

      if (u.success && unit.success) {
        // create new event
        let event = await this.eventModel.create(body);

        // create new organizer
        let orgDto = {
          userId: u.message._id,
          eventId: event._id,
          status: 'organizing',
        };
        const org = await this.organizerService.create(orgDto);

        // create event unit
        let eventUnitDto = {
          eventId: event._id,
          unitId: unit.message._id.toString(),
        };
        const eventUnit = await this.eventUnitService.create(eventUnitDto);

        // Get unit's admin details
        const { success, message } = await this.unitAdminService.findByUnitId(
          unit.message._id.toString(),
        );
        this.logger.debug(`Admin details fetched: ${JSON.stringify(message)}`);

        if (success && message.length > 0) {
          for (const admin of message) {
            const adminDetails = await this.userService.findById(admin.userId);
            this.logger.debug(`Admin details: ${JSON.stringify(adminDetails)}`);

            if (adminDetails.success) {
              const adminEmail = adminDetails.message.email;
              this.logger.debug(`Sending email to: ${adminEmail}`);

              // Send email to admin
              await this.mailService.sendEventCreationNotification(
                adminEmail,
                body.name,
                u.message.firstName
              );
              this.logger.debug(`Email sent to: ${adminEmail}`);
            }
          }
        }

        return { success: true, message: event };
      } else {
        return {
          success: false,
          error: 'There is an error in unit id or user id',
        };
      }
    } catch (err) {
      throw new BadRequestException({ success: false, error: err });
    }
  }

  // update event detail and status use the same service
  // the dto is managed at the controller level
  async update(id: string, body) {
    //=======================================//
    // TASK                                  //
    // CHECK if the adminId in the body is   //
    // valid                                 //
    //=======================================//
    if (!mongoose.isValidObjectId(id)) {
      throw new NotAcceptableException('Event Id is invalid.');
    }
    const event = await this.eventModel.findById(id);
    if (!event) {
      throw new NotFoundException({
        success: false,
        error: 'Event not found.',
      });
    }

    try {
      const res = await this.eventModel.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });

      // this.mailService.sendRoleChangeNotification(
      //   "saipepu.mdy257@gmail.com",
      //   "TestMail",
      //   "event status changed"
      // )

      return { success: true, message: res };
    } catch (err) {
      throw new BadRequestException({ success: false, error: err });
    }
  }
}
