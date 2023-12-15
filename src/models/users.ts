import mongoose, { Schema, Document } from 'mongoose';

// Location coordinates
interface ICoordinates {
  latitude: string;
  longitude: string;
}

// Location timezone
interface ITimezone {
  offset: string;
  description: string;
}

// Street Information
interface IStreet {
  number: number;
  name: string;
}

// Location Information
interface ILocation {
  street: IStreet;
  city: string;
  state: string;
  country: string;
  postcode: string;
  coordinates: ICoordinates;
  timezone: ITimezone;
}

// Name Of user
interface IName {
  title: string;
  first: string;
  last: string;
}

// Login Information
interface ILogin {
  uuid: string;
  username: string;
  password: string;
  salt: string;
  md5: string;
  sha1: string;
  sha256: string;
}

// Date of birth of user
interface IDob {
  date: string;
  age: number;
}

// Date of registration of user
interface IRegistered {
  date: string;
  age: number;
}

// Profile URL of user
interface IPicture {
  large: string;
  medium: string;
  thumbnail: string;
}

// User information
interface IUser {
  gender: string;
  name: IName;
  location: ILocation;
  email: string;
  login: ILogin;
  dob: IDob;
  registered: IRegistered;
  phone: string;
  cell: string;
  picture: IPicture;
  nat: string;
  createdAt: Date;
}

// Create user schema
const UserSchema = new Schema<IUser>({
  gender: String,
  name: {
    title: String,
    first: String,
    last: String,
  },
  location: {
    street: {
      number: Number,
      name: String,
    },
    city: String,
    state: String,
    country: String,
    postcode: String,
    coordinates: {
      latitude: String,
      longitude: String,
    },
    timezone: {
      offset: String,
      description: String,
    },
  },
  email: String,
  login: {
    uuid: {
      type: String,
      unique: true,
    },
    username: String,
    password: String,
    salt: String,
    md5: String,
    sha1: String,
    sha256: String,
  },
  dob: {
    date: String,
    age: Number,
  },
  registered: {
    date: String,
    age: Number,
  },
  phone: String,
  cell: String,
  picture: {
    large: String,
    medium: String,
    thumbnail: String,
  },
  nat: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
}
);

// Create user model
const UserModel = mongoose.model<IUser>('User', UserSchema);

export { IUser, UserModel };

