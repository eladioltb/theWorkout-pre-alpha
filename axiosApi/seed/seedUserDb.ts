import * as bcrypt from 'bcryptjs';

interface SeedUser {
  name    : string;
  email   : string;
  password: string;
  role    : 'admin' | 'user';
  isPro   : boolean;
  image   : string;
  massUnit: 'kg' | 'lbs';
  metricUnit: 'cm' | 'in';
  metrics: {
    height  : number;
    weight  : number[];
  }
}

export const initialUserData: SeedUser[] = [
  {
    name    : 'Alejandro Estarlich',
    email   : 'aestarlich@gymapp.com',
    password: bcrypt.hashSync('AlejandroGymApp2022'),
    role    : 'admin',
    isPro   : true,
    image: '',
    massUnit: 'kg',
    metricUnit: 'cm',
    metrics: {
      height  : 0,
      weight  : [0],
    }
  },
  {
    name    : 'Eladio Loriente',
    email   : 'eloriente@gymapp.com',
    password: bcrypt.hashSync('EladioGymApp2022'),
    role    : 'admin',
    isPro   : true,
    image: '',
    massUnit: 'kg',
    metricUnit: 'cm',
    metrics: {
      height  : 0,
      weight  : [0],
    }
  },
  {
    name    : 'Turbo Admin',
    email   : 'tadmin@gymapp.com',
    password: bcrypt.hashSync('TurboAdminGymApp2022'),
    role    : 'admin',
    isPro   : true,
    image: '',
    massUnit: 'kg',
    metricUnit: 'cm',
    metrics: {
      height  : 0,
      weight  : [0],
    }
  },
  {
    name    : 'Turbo Client',
    email   : 'tclient@gymapp.com',
    password: bcrypt.hashSync('TurboClientGymApp2022'),
    role    : 'user',
    isPro   : true,
    image: '',
    massUnit: 'kg',
    metricUnit: 'cm',
    metrics: {
      height  : 0,
      weight  : [0],
    }
  },
];