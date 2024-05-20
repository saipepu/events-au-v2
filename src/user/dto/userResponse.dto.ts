import { getSchemaPath } from "@nestjs/swagger"
import { User } from "../schema/user.schema"
import { Event } from "../../event/schema/event.schema"
import { Participant } from "../../participant/schema/participant.schema"
import { UnitMember } from "src/unit-member/schema/unit-member.schema"

export const resGetAllDto = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    message: {
      type: 'array',
      items: { // only for array type message
        $ref: getSchemaPath(User),
      }
    }
  }
}

export const resGetByIdDto = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    message: {
      type: 'string',
      $ref: getSchemaPath(User)
    }
  }
}

export const resGetByIdDtoNotFound = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: false },
    message: { type: 'string', example: 'User with this ID does not exist.' }
  }
}

export const resCreateEventSuccessDto = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    message: {
      type: 'string',
      $ref: getSchemaPath(Event)
    }
  }
}

export const resJoinEventDto = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    message: {
      type: 'object',
      $ref: getSchemaPath(Participant)
    }
  }
}

export const resJoinUnitDto = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    message: {
      type: 'object',
      $ref: getSchemaPath(UnitMember)
    }
  }
}