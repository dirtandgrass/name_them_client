import bcrypt from 'bcryptjs'


export function randomHash(): string {
  const salt = bcrypt.genSaltSync(5);
  return bcrypt.hashSync(Math.random().toString(), salt);
}