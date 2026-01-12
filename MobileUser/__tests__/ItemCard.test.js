import React from 'react';
import { render } from '@testing-library/react-native';
import ItemCard from '../components/ItemCard';

// Mock twrnc
jest.mock('twrnc', () => ({
    color: jest.fn(),
    default: {
        color: jest.fn(),
    },
}));
// Helper for tailwind mock
const tw = (strings) => ({});
tw.color = jest.fn();
jest.mock('twrnc', () => tw);

describe('ItemCard Component', () => {
    const mockItem = {
        _id: '123',
        item_name: 'Eggs',
        item_quantity: '12 pack',
        added_by: 'John',
        item_description: 'Large brown eggs',
        date_added: '2025-01-10T08:00:00.000Z',
        schedule_type: 'none',
    };

    test('renders item details correctly', () => {
        const { getByText } = render(
            <ItemCard
                item={mockItem}
                onBought={() => { }}
                onDelete={() => { }}
                loggedInUserName="John"
            />
        );

        expect(getByText(/Eggs/)).toBeTruthy();
        expect(getByText(/(12 pack)/)).toBeTruthy();
        expect(getByText(/Description: Large brown eggs/)).toBeTruthy();
    });

    test('displays the Date Added', () => {
        const { getByText } = render(
            <ItemCard
                item={mockItem}
                onBought={() => { }}
                onDelete={() => { }}
                loggedInUserName="John"
            />
        );

        // Check for the label, the actual date format can vary
        expect(getByText(/Date Added:/)).toBeTruthy();
    });

    test('shows "Added by: You" if the logged in user is the owner', () => {
        const { getByText } = render(
            <ItemCard
                item={mockItem}
                onBought={() => { }}
                onDelete={() => { }}
                loggedInUserName="John"
            />
        );

        expect(getByText(/Added by: You/)).toBeTruthy();
    });

    test('shows owner name if the logged in user is NOT the owner', () => {
        const { getByText } = render(
            <ItemCard
                item={mockItem}
                onBought={() => { }}
                onDelete={() => { }}
                loggedInUserName="Alice"
            />
        );

        expect(getByText(/Added by: John/)).toBeTruthy();
    });
});
