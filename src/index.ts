// Entry point for the ShieldPay API server
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { sequelize } from './models';
import dotenv from 'dotenv';
import usersRouter from './routes/users';
import authRouter from './routes/auth';
import walletsRouter from './routes/wallets';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Swagger setup
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'ShieldPay API',
    version: '1.0.0',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string' },
        },
      },
      Wallet: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          user_id: { type: 'string', format: 'uuid' },
          tag: { type: 'string' },
          chain: { type: 'string' },
          address: { type: 'string' },
        },
      },
      Auth: {
        type: 'object',
        properties: {
          token: { type: 'string' },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/users': {
      post: {
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } }, required: ['email', 'password'] },
            },
          },
        },
        responses: {
          '201': { description: 'User created', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
          '400': { description: 'Invalid input' },
        },
      },
    },
    '/signin': {
      post: {
        summary: 'Sign in',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } }, required: ['email', 'password'] },
            },
          },
        },
        responses: {
          '200': { description: 'JWT token', content: { 'application/json': { schema: { $ref: '#/components/schemas/Auth' } } } },
          '401': { description: 'Invalid credentials' },
        },
      },
    },
    '/signout': {
      post: {
        summary: 'Sign out',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Signed out' },
        },
      },
    },
    '/wallets': {
      get: {
        summary: 'Get all wallets for the authenticated user',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'List of wallets', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Wallet' } } } } },
          '401': { description: 'Unauthorized' },
        },
      },
      post: {
        summary: 'Create a new wallet',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object', properties: { tag: { type: 'string' }, chain: { type: 'string' }, address: { type: 'string' } }, required: ['chain', 'address'] },
            },
          },
        },
        responses: {
          '201': { description: 'Wallet created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Wallet' } } } },
          '400': { description: 'Invalid input' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/wallets/{id}': {
      get: {
        summary: 'Get wallet by id',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          '200': { description: 'Wallet details', content: { 'application/json': { schema: { $ref: '#/components/schemas/Wallet' } } } },
          '404': { description: 'Wallet not found' },
          '401': { description: 'Unauthorized' },
        },
      },
      put: {
        summary: 'Update wallet by id',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object', properties: { tag: { type: 'string' }, chain: { type: 'string' }, address: { type: 'string' } }, required: ['chain', 'address'] },
            },
          },
        },
        responses: {
          '200': { description: 'Wallet updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Wallet' } } } },
          '400': { description: 'Invalid input' },
          '404': { description: 'Wallet not found' },
          '401': { description: 'Unauthorized' },
        },
      },
      delete: {
        summary: 'Delete wallet by id',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          '200': { description: 'Wallet deleted' },
          '404': { description: 'Wallet not found' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
  },
};

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('ShieldPay API is running!');
});

// Sequelize DB connection and sync
sequelize.authenticate()
  .then(() => {
    console.log('Connected to PostgreSQL via Sequelize');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Database synced');
  })
  .catch((err: any) => {
    console.error('Sequelize connection error:', err);
  });

app.use(express.json());
app.use('/users', usersRouter);
app.use('/', authRouter);
app.use('/wallets', walletsRouter);

if (!process.env.JWT_SECRET) process.env.JWT_SECRET = 'dev_secret';

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 