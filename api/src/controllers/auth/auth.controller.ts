import { Request, Response } from 'express';
import { Service } from 'typedi';
import { AuthService } from '@services/auth.service';
import { sendSuccessResponse, sendErrorResponse } from '@lib/env';

@Service()
export class AuthController {
  constructor(private authService: AuthService) {}

  // ---- POST /api/v1/auth/login ----
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      let { email, password } = req.body as { email: string; password: string };

      if (!email || !password) {
        sendErrorResponse(res, 400, 'Email and password are required');
        return;
      }

      let result = await this.authService.login(email, password);
      sendSuccessResponse(res, 200, 'Login successful', result);
    } catch (err) {
      let error = err as Error;
      sendErrorResponse(res, 401, error.message);
    }
  };

  // ---- POST /api/v1/auth/register ----
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      let { name, email, password, role, gender, phone } = req.body as {
        name: string;
        email: string;
        password: string;
        role: string;
        gender: string;
        phone: string;
      };

      let newUser = await this.authService.register({ name, email, password, role, gender, phone });
      sendSuccessResponse(res, 201, 'User registered', { id: newUser.id });
    } catch (err) {
      let error = err as Error;
      sendErrorResponse(res, 400, error.message);
    }
  };
}
