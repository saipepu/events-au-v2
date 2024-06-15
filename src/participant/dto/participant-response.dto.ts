import { getSchemaPath } from "@nestjs/swagger";
import { Participant } from "../schema/participant.schema";

export const resGetAllParticipantDto = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: {
            type: 'array',
            items: {
            $ref: getSchemaPath(Participant)
            }
        }
    }
}

export const resGetParticipantByIdDto = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: {
            type: 'object',
            $ref: getSchemaPath(Participant)
        }
    }
}