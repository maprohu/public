import * as dotenv from 'dotenv';
import { repositoryDispatch } from './main';
import env from './env';
dotenv.config();
dotenv.config({ path: `.env.${process.env.NODE_ENV ?? 'local'}`, override: true });

repositoryDispatch(env());
