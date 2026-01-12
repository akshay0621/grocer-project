import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ItemsPage from '../ItemsPage';
import React from 'react';

// Mock the global fetch
global.fetch = jest.fn();
process.env.REACT_APP_API_BASE_URL = 'http://localhost:5000';

describe('ItemsPage - Simple CI Test', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test('successfully fetches and displays items', async () => {
        const mockItems = [
            { _id: 'i1', item_name: 'Item A', item_quantity: '1', added_by: 'U1', date_added: '2025-01-01' },
        ];

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ items: mockItems }),
        });

        await act(async () => {
            render(<ItemsPage />);
        });

        const itemElement = await screen.findByText('Item A');
        expect(itemElement).toBeInTheDocument();
        expect(screen.getByText(/Date Added/i)).toBeInTheDocument();
    });

    test('handles error state', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            json: async () => ({ error: 'Fail' }),
        });

        await act(async () => {
            render(<ItemsPage />);
        });

        const errorElement = await screen.findByText(/Error:/i);
        expect(errorElement).toBeInTheDocument();
    });
});
