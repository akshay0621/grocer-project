import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import HistoryPage from '../components/HistoryPage';

// Mock global fetch
global.fetch = jest.fn();
global.alert = jest.fn();

// Mock twrnc
jest.mock('twrnc', () => {
    const tw = (strings) => ({});
    tw.color = jest.fn(() => '#000');
    return tw;
});

// Mock navigation/route
const mockNavigation = { goBack: jest.fn() };
const mockRoute = { params: { loggedInUserName: 'Alice' } };

describe('HistoryPage Component', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test('renders empty state when no history found', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ items: [] })
        });

        const { getByText } = render(<HistoryPage navigation={mockNavigation} route={mockRoute} />);

        await waitFor(() => {
            expect(getByText(/No history found/i)).toBeTruthy();
        });
    });

    test('renders history items and allows re-adding', async () => {
        const mockItems = [
            {
                _id: 'item1',
                item_name: 'Stale Milk',
                item_quantity: '1',
                is_purchased: true,
                purchased_by: 'Alice',
                updatedAt: '2025-01-01T10:00:00Z',
                date_bought: '2025-01-01T10:00:00Z'
            }
        ];

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ items: mockItems })
        });

        // Mock for re-add
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ message: 'Added' })
        });

        const { getByText } = render(<HistoryPage navigation={mockNavigation} route={mockRoute} />);

        await waitFor(() => {
            expect(getByText('Stale Milk')).toBeTruthy();
            expect(getByText(/Date Bought:/)).toBeTruthy();
        });

        fireEvent.press(getByText('+ Add Again'));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('/add_new_item'),
                expect.anything()
            );
        });
    });

    test('handles fetch error with retry button', async () => {
        fetch.mockRejectedValueOnce(new Error('Network error'));

        const { getByText } = render(<HistoryPage navigation={mockNavigation} route={mockRoute} />);

        await waitFor(() => {
            expect(getByText(/Network error/i)).toBeTruthy();
            expect(getByText('Retry')).toBeTruthy();
        });

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ items: [] })
        });

        fireEvent.press(getByText('Retry'));

        await waitFor(() => {
            expect(getByText(/No history found/i)).toBeTruthy();
        });
    });
});
