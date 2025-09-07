import bcrypt from 'bcryptjs';

const password = process.argv[2] || 'admin';
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

console.log('Password:', password);
console.log('Hashed password:', hash);
console.log('\nSQL to update admin password:');
console.log(`UPDATE users SET password = '${hash}' WHERE role = 'admin';`);
