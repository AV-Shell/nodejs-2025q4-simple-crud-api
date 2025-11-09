import dotenv from 'dotenv';

dotenv.config();

const config = {
  MULTIMODE: process.env.multimode === 'multi',
  PORT: +(process.env.PORT ?? 5000),
  DEBUG: !!process.env.debug,
};

export default config;
