import { Router } from 'express';
import { User } from '../models/user';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';

const router = Router();

router.post('/',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const { email, password } = req.body;
    try {
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ email, password: hash } as any);
      res.status(201).json({ id: user.id, email: user.email });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(400).json({ error: 'Could not create user', details: err.message });
      } else {
        res.status(400).json({ error: 'Could not create user', details: 'Unknown error' });
      }
    }
  }
);

export default router; 