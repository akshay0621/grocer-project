import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddItemModal from '../components/AddItemModal';

// Mock global fetch
global.fetch = jest.fn();
global.alert = jest.fn();

// Mock twrnc
jest.mock('twrnc', () => {
    const tw = (strings) => ({});
    tw.color = jest.fn(() => '#000');
    return tw;
});

describe('AddItemModal Component - Edge Cases', () => {
    const mockOnAddItem = jest.fn();
    const mockOnClose = jest.fn();
    const mockOnRefresh = jest.fn();

    beforeEach(() => {
        fetch.mockClear();
        jest.clearAllMocks();
    });

    test('shows error when submitting empty form', async () => {
        const { getByText } = render(
            <AddItemModal
                isVisible={true}
                onClose={mockOnClose}
                onAddItem={mockOnAddItem}
                onRefreshItems={mockOnRefresh}
                loggedInUserName="Tester"
            />
        );

        fireEvent.press(getByText('Save Item'));

        await waitFor(() => {
            expect(getByText(/Please enter item name and quantity/i)).toBeTruthy();
        });
    });

    test('shows error when selecting Regular schedule but no days', async () => {
        const { getByText, getByPlaceholderText } = render(
            <AddItemModal
                isVisible={true}
                onClose={mockOnClose}
                onAddItem={mockOnAddItem}
                onRefreshItems={mockOnRefresh}
                loggedInUserName="Tester"
            />
        );

        fireEvent.changeText(getByPlaceholderText(/Item Name/i), 'Milk');
        fireEvent.changeText(getByPlaceholderText(/Quantity/i), '1L');
        fireEvent.press(getByText('Regular'));
        fireEvent.press(getByText('Save Item'));

        await waitFor(() => {
            expect(getByText(/Please select at least one day/i)).toBeTruthy();
        });
    });

    test('successfully submits item with schedule', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ message: 'Success' })
        });

        const { getByText, getByPlaceholderText } = render(
            <AddItemModal
                isVisible={true}
                onClose={mockOnClose}
                onAddItem={mockOnAddItem}
                onRefreshItems={mockOnRefresh}
                loggedInUserName="Tester"
            />
        );

        fireEvent.changeText(getByPlaceholderText(/Item Name/i), 'Apples');
        fireEvent.changeText(getByPlaceholderText(/Quantity/i), '5');
        fireEvent.press(getByText('Save Item'));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('/add_new_item'),
                expect.objectContaining({
                    method: 'POST',
                    body: expect.stringContaining('"item_name":"Apples"')
                })
            );
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    test('handles API failure correctly', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: 'API Error' })
        });

        const { getByText, getByPlaceholderText } = render(
            <AddItemModal
                isVisible={true}
                onClose={mockOnClose}
                onAddItem={mockOnAddItem}
                onRefreshItems={mockOnRefresh}
                loggedInUserName="Tester"
            />
        );

        fireEvent.changeText(getByPlaceholderText(/Item Name/i), 'Error Item');
        fireEvent.changeText(getByPlaceholderText(/Quantity/i), '1');
        fireEvent.press(getByText('Save Item'));

        await waitFor(() => {
            expect(getByText(/API Error/i)).toBeTruthy();
        });
    });
});
