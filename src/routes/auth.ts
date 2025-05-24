import { Router } from 'express';
import { User } from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

const router = Router();

router.post('/signin',
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
      const user = await User.findOne({ where: { email } });
      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
      res.json({ token });
    } catch (err: unknown) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Stateless JWT: signout is a no-op
router.post('/signout', (req, res) => {
  res.json({ message: 'Signed out (client should delete token)' });
});

export default router; 