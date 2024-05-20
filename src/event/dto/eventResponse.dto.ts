import { getSchemaPath } from "@nestjs/swagger";
import { Event } from "../schema/event.schema";
import { User } from "src/user/schema/user.schema";

export const resGetAllDto = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    message: {
      type: 'array',
      items: {
        $ref: getSchemaPath(Event)
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