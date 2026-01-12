const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const Item = require('../src/models/Item');

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
    await Item.deleteMany({});
});

describe('Items API - Edge Cases', () => {
    describe('POST /add_new_item', () => {
        test('should fail if required fields are missing', async () => {
            const response = await request(app)
                .post('/add_new_item')
                .send({ item_name: 'Missing Quantity' });

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toContain('Item name, quantity, and added by are required');
        });

        test('should handle extremely long descriptions', async () => {
            const longDesc = 'a'.repeat(2000);
            const response = await request(app)
                .post('/add_new_item')
                .send({
                    item_name: 'Big Item',
                    item_quantity: '1',
                    added_by: 'Tester',
                    item_description: longDesc
                });

            expect(response.statusCode).toBe(201);
            const item = await Item.findOne({ item_name: 'Big Item' });
            expect(item.item_description).toBe(longDesc);
        });

        test('should save scheduled items correctly (specific date)', async () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 5);

            const response = await request(app)
                .post('/add_new_item')
                .send({
                    item_name: 'Future Milk',
                    item_quantity: '1',
                    added_by: 'Tester',
                    schedule_type: 'specific',
                    specific_date: futureDate
                });

            expect(response.statusCode).toBe(201);
            const item = await Item.findOne({ item_name: 'Future Milk' });
            expect(new Date(item.specific_date).toISOString()).toBe(futureDate.toISOString());
        });
    });

    describe('PUT /mark_item_bought/:id', () => {
        test('should return 404 for non-existent item ID', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .put(`/mark_item_bought/${fakeId}`)
                .send({ is_purchased: true, purchased_by: 'nobody' });

            expect(response.statusCode).toBe(404);
        });

        test('should fail if is_purchased is missing', async () => {
            const item = await Item.create({ item_name: 'X', item_quantity: '1', added_by: 'Y' });
            const response = await request(app)
                .put(`/mark_item_bought/${item._id}`)
                .send({ purchased_by: 'me' });

            expect(response.statusCode).toBe(400);
        });
    });

    describe('DELETE /delete_item/:id', () => {
        test('should delete an item successfully', async () => {
            const item = await Item.create({ item_name: 'Delete Me', item_quantity: '1', added_by: 'Tester' });
            const response = await request(app).delete(`/delete_item/${item._id}`);

            expect(response.statusCode).toBe(200);
            const deletedItem = await Item.findById(item._id);
            expect(deletedItem).toBeNull();
        });

        test('should return 404 when deleting non-existent item', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app).delete(`/delete_item/${fakeId}`);
            expect(response.statusCode).toBe(404);
        });
    });
});
