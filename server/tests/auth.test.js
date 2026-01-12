const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../src/models/User');
const Admin = require('../src/models/Admin');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await User.deleteMany({});
    await Admin.deleteMany({});
});

describe('Authentication API', () => {
    describe('User Registration', () => {
        test('should register a new user successfully', async () => {
            const response = await request(app)
                .post('/user_register')
                .send({ user_name: 'alice', user_password: 'password123' });

            expect(response.statusCode).toBe(201);
            expect(response.body.message).toBe('User registered successfully.');
        });

        test('should fail if user already exists', async () => {
            await User.create({ user_name: 'alice', user_password: 'password123' });

            const response = await request(app)
                .post('/user_register')
                .send({ user_name: 'alice', user_password: 'password456' });

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('User already exists.');
        });

        test('should fail if name or password missing', async () => {
            const response = await request(app)
                .post('/user_register')
                .send({ user_name: 'alice' });

            expect(response.statusCode).toBe(400);
        });
    });

    describe('User Login', () => {
        test('should login successfully with correct credentials', async () => {
            await User.create({ user_name: 'bob', user_password: 'password123' });

            const response = await request(app)
                .post('/user_login')
                .send({ user_name: 'bob', user_password: 'password123' });

            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('User logged in successfully.');
        });

        test('should fail with incorrect password', async () => {
            await User.create({ user_name: 'bob', user_password: 'password123' });

            const response = await request(app)
                .post('/user_login')
                .send({ user_name: 'bob', user_password: 'wrongpassword' });

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('Invalid password.');
        });

        test('should fail if user does not exist', async () => {
            const response = await request(app)
                .post('/user_login')
                .send({ user_name: 'ghost', user_password: 'password123' });

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('User does not exist.');
        });
    });

    describe('Admin Authentication', () => {
        test('should register a new admin successfully', async () => {
            const response = await request(app)
                .post('/admin_register')
                .send({ admin_name: 'admin1', admin_password: 'adminpassword' });

            expect(response.statusCode).toBe(201);
            expect(response.body.message).toBe('Admin User registered successfully.');
        });

        test('should login admin successfully', async () => {
            await Admin.create({ admin_name: 'admin1', admin_password: 'adminpassword' });

            const response = await request(app)
                .post('/admin_login')
                .send({ admin_name: 'admin1', admin_password: 'adminpassword' });

            expect(response.statusCode).toBe(200);
        });
    });
});
