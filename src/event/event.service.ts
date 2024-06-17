import { ParticipantService } from 'src/participant/participant.service';
import {
  BadRequestException,
  forwardRef,
  Inject,
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
import { AdminService } from 'src/admin/admin.service';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(
    @InjectModel(Event.name)
    private eventModel: mongoose.Model<Event>,
    @Inject(forwardRef(() => OrganizerService))
    private organizerService: OrganizerService,
    private eventUnitService: EventUnitService,
    private unitService: UnitService,
    private userService: UserService,
    private mailService: MailService,
    private unitAdminService: UnitAdminService,
    @Inject(forwardRef(() => ParticipantService))
    private participantService: ParticipantService,
    private adminService: AdminService
  ) {}

  // find all events
  async findAll(query: Query) {
    const events = await this.eventModel.find(query);

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
        if (success && message.length > 0) {
          const adminEmails = [];
          for (const obj of message) {
            const adminDetails = await this.userService.findById(obj.adminId.userId.toString());
            if (adminDetails.success) {
              adminEmails.push(adminDetails.message.email);
            }
          }

          await this.mailService.sendEventCreationNotification(
            adminEmails,
            body.name,
            u.message.firstName,
          );
          this.logger.debug(`Email sent to: ${adminEmails}`);
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

      const originalEvent = event.toObject();

      const updatedEvent  = await this.eventModel.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });

      const changes = this.getChanges(originalEvent, updatedEvent.toObject());
      // console.log('Changes:', changes);
      // How do i get all participants of an event
      // use get all partipants then check which one have the same event id
      const participants = await this.participantService.findAll({ eventId: id });
      const participantEmails = participants.message.map((participant) => participant.email);
      console.log(participantEmails);
      
      const units = await this.eventUnitService.findByEventId(id);
      // console.log(units);

      // Extract unit IDs from the units
      const unitIds = units.message.map(unit => unit._id.toString());

      // Retrieve all admins
      const allAdmins = await this.adminService.findAll({ unitId: { $in: unitIds } });
      // console.log(relevantAdmins);

      // Extract emails from populated userId field
      const adminEmails = allAdmins.message.map(admin => admin.userId.email);

      // Combine participantEmails and adminEmails
      const emailsList = [...new Set([...participantEmails, ...adminEmails])]; // Remove duplicates using Set
      console.log('Combined Emails List:', emailsList);

      // Send notification
      await this.mailService.sendEventUpdateNotification(emailsList, updatedEvent.name, changes);
      

      return { success: true, message: updatedEvent  };
    } catch (err) {
      throw new BadRequestException({ success: false, error: err });
    }
  }

  private getChanges(original: any, updated: any) {
    const changes = {};
    for (const key in updated) {
      if (original[key] !== updated[key]) {
        changes[key] = {
          original: original[key],
          updated: updated[key]
        };
      }
    }
    return changes;
  }
}
