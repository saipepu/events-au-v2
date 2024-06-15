import { getSchemaPath } from "@nestjs/swagger";
import { Admin } from "../schema/admin.schema";
import { Event } from "src/event/schema/event.schema";

export const resGetAllAdmin = {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: {
        type: 'array',
        items: {
          $ref: getSchemaPath(Admin)
        }
      }
    }
}

export const resGetAdminById = {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: {
        type: 'string',
        $ref: getSchemaPath(Admin)
      }
    }
}

export const resUpdateEventStatus = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { 
            type:  'string',
            $ref: getSchemaPath(Event)
        }
    }
}