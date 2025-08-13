import { randomBytes } from 'crypto';

const secret = randomBytes(64).toString('hex');

console.log(
  '==== COPY BELOW STRING TO YOUR `apps/server/.env` FILE ====\n\n' + secret,
);
