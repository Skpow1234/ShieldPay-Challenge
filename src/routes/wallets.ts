import { Router, Request, Response, NextFunction } from 'express';
import { Wallet } from '../models/wallet';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

type AuthRequest = Request & { userId?: string };

const router = Router();

function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const auth = req.headers['authorization'] as string | undefined;
  if (!auth) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
}

router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const wallets = await Wallet.findAll({ where: { user_id: req.userId } });
  res.json(wallets);
});

router.post('/',
  body('chain').isString().notEmpty(),
  body('address').isString().notEmpty(),
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const { tag, chain, address } = req.body as { tag?: string; chain: string; address: string };
    try {
      const wallet = await Wallet.create({ user_id: req.userId, tag, chain, address } as any);
      res.status(201).json(wallet);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(400).json({ error: 'Could not create wallet', details: err.message });
      } else {
        res.status(400).json({ error: 'Could not create wallet', details: 'Unknown error' });
      }
    }
  }
);

router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const wallet = await Wallet.findOne({ where: { id: req.params.id, user_id: req.userId } });
  if (!wallet) {
    res.status(404).json({ error: 'Wallet not found' });
    return;
  }
  res.json(wallet);
});

router.put('/:id',
  body('chain').isString().notEmpty(),
  body('address').isString().notEmpty(),
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const { tag, chain, address } = req.body as { tag?: string; chain: string; address: string };
    const wallet = await Wallet.findOne({ where: { id: req.params.id, user_id: req.userId } });
    if (!wallet) {
      res.status(404).json({ error: 'Wallet not found' });
      return;
    }
    try {
      wallet.tag = tag;
      wallet.chain = chain;
      wallet.address = address;
      await wallet.save();
      res.json(wallet);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(400).json({ error: 'Could not update wallet', details: err.message });
      } else {
        res.status(400).json({ error: 'Could not update wallet', details: 'Unknown error' });
      }
    }
  }
);

router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const wallet = await Wallet.findOne({ where: { id: req.params.id, user_id: req.userId } });
  if (!wallet) {
    res.status(404).json({ error: 'Wallet not found' });
    return;
  }
  await wallet.destroy();
  res.json({ message: 'Wallet deleted' });
});

export default router; 