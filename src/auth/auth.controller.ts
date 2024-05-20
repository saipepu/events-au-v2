import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService, SignUpResponse } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiExtraModels, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { RestrictedToken } from './schema/restrictedToken.schema';
import { SignOutDto } from './dto/signOut.dto';
import { User } from 'src/user/schema/user.schema';
import { Admin } from 'src/admin/schema/admin.schema';

@ApiTags('auth')
@ApiExtraModels(SignUpDto, SignInDto, RestrictedToken, SignOutDto)
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  @Post('/signup')
  @ApiResponse({ status: 201, description: 'User created successfully.', schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'object', properties: { user: { $ref: getSchemaPath(User) } } } } }})
  @ApiResponse({ status: 400, description: 'User already exist. Please login.', schema: { type: 'object', properties: { success: { type: 'boolean' }, error: { type: 'string' } } }})
  async signUp(
    @Body()
    body: SignUpDto
  ): Promise<SignUpResponse> {
    return this.authService.signUp({ isAdmin: false, body: body })
  }

  @Post('/admin/signup')
  @ApiResponse({ status: 201, description: 'User created successfully.', schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'object', properties: { user: { $ref: getSchemaPath(User) }, admin: { $ref: getSchemaPath(Admin) } } } } }})
  async adminSignUp(
    @Body()
    body: SignUpDto
  ) {
    return this.authService.signUp({ isAdmin: true, body: body })
  }

  @Post('/signin')
  @ApiResponse({ status: 200, description: 'User signed in successfully.', schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'object', properties: { token: { type: 'string' } } } } }})
  async signIn(
    @Body()
    body: SignInDto
  ) {
    return this.authService.signIn(body)
  }

  @Get('/protected')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('bearer-token')
  async protected(
    @Req() req
  ) {
    return req.user
  }

  @Get('/signout')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('bearer-token')
  @ApiResponse({ status: 200, description: 'User signed out successfully.', schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string', example: 'Signout complete.' } } }})
  async signOut(
    @Req() req
  ) {
    return this.authService.signOut(req)
  }
}
