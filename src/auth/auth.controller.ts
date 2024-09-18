import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService, SignUpResponse } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
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

  // Create a new user
  @Post('/signup')
  @ApiOperation({ summary: 'Create a new user.' })
  @ApiResponse({ status: 201, description: 'User created successfully.', schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'object', properties: { user: { $ref: getSchemaPath(User) } } } } }})
  @ApiResponse({ status: 400, description: 'User already exist. Please login.', schema: { type: 'object', properties: { success: { type: 'boolean' }, error: { type: 'string' } } }})
  async signUp(
    @Body()
    body: SignUpDto
  ): Promise<SignUpResponse> {
    return this.authService.signUp({ isAdmin: false, body: body })
  }

  // Create a new admin
  @Post('/admin/signup')
  @ApiOperation({ summary: 'Create a new admin.' })
  @ApiResponse({ status: 201, description: 'User created successfully.', schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'object', properties: { user: { $ref: getSchemaPath(User) }, admin: { $ref: getSchemaPath(Admin) } } } } }})
  async adminSignUp(
    @Body()
    body: SignUpDto
  ) {
    return this.authService.signUp({ isAdmin: true, body: body })
  }

  // Sign in user
  @Post('/signin')
  @ApiOperation({ summary: 'Sign in user.' })
  @ApiResponse({ status: 200, description: 'User signed in successfully.', schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'object', properties: { token: { type: 'string' }, user: { $ref: getSchemaPath(User) } } } } }})
  async signIn(
    @Body()
    body: SignInDto
  ) {
    return this.authService.signIn(body)
  }

  // Protected route
  @Get('/protected')
  @ApiOperation({ summary: 'Protected route (Test if your token is valid or if you have signin or not).' })
  @UseGuards(AuthGuard())
  @ApiBearerAuth('bearer-token')
  async protected(
    @Req() req
  ) {
    return req.user
  }

  // Sign out user
  @Get('/signout')
  @ApiOperation({ summary: 'Sign out user.' })
  @UseGuards(AuthGuard())
  @ApiBearerAuth('bearer-token')
  @ApiResponse({ status: 200, description: 'User signed out successfully.', schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string', example: 'Signout complete.' } } }})
  async signOut(
    @Req() req
  ) {
    return this.authService.signOut(req)
  }
}
