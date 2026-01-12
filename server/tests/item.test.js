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

describe('Grocery Items API', () => {
    test('should add a new item and set date_added', async () => {
        const newItem = {
            item_name: 'Organic Milk',
            item_quantity: '1 Liter',
            added_by: 'TestUser',
            item_description: 'Fresh milk from the farm'
        };

        const response = await request(app)
            .post('/add_new_item')
            .send(newItem);

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Item added successfully.');

        const item = await Item.findOne({ item_name: 'Organic Milk' });
        expect(item).not.toBeNull();
        expect(item.date_added).toBeDefined();
        expect(new Date(item.date_added)).toBeInstanceOf(Date);
    });

    test('should list all items', async () => {
        await Item.create({
            item_name: 'Apples',
            item_quantity: '5 pcs',
            added_by: 'Admin'
        });

        const response = await request(app).get('/get_all_items');
        expect(response.statusCode).toBe(200);
        expect(response.body.items.length).toBe(1);
        expect(response.body.items[0].item_name).toBe('Apples');
    });

    test('should mark an item as bought and set date_bought', async () => {
        const item = await Item.create({
            item_name: 'Butter',
            item_quantity: '200g',
            added_by: 'TestUser'
        });

        const response = await request(app)
            .put(`/mark_item_bought/${item._id}`)
            .send({
                is_purchased: true,
                purchased_by: 'BuyerUser'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.item.is_purchased).toBe(true);
        expect(response.body.item.purchased_by).toBe('BuyerUser');
        expect(response.body.item.date_bought).toBeDefined();
        expect(new Date(response.body.item.date_bought)).toBeInstanceOf(Date);
    });
});
