import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Inventory from './Inventory';
import { describe, beforeEach, test, expect, vi } from 'vitest';
import axios from 'axios';

vi.mock('axios');

describe('Inventory Component', () => {
  const mockInventory = [
    { pk: 'Fruit', list: ['Apples'] },
    { pk: 'Toiletries', list: ['Shampoo Bottles'] },
    { pk: 'Electronics', list: ['Laptop Chargers'] },
  ];

  beforeEach(() => {
    // Mock axios.get to return fake inventory
    axios.get.mockResolvedValue({ data: mockInventory });

    // Optional: clear previous mocks between tests
    vi.clearAllMocks();
  });

  test('shows loading initially and then renders inventory categories and items', async () => {
    render(<Inventory />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Check some category headings and items
    expect(screen.getByRole('heading', { name: /fruit/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /toiletries/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /electronics/i })).toBeInTheDocument();

    expect(screen.getByText('Apples')).toBeInTheDocument();
    expect(screen.getByText('Shampoo Bottles')).toBeInTheDocument();
    expect(screen.getByText('Laptop Chargers')).toBeInTheDocument();
  });

  test('adds a new item and shows it in inventory', async () => {
    axios.post.mockResolvedValue({ data: {} });

    // When fetchInventory is called again after adding item, return updated list
    axios.get
      .mockResolvedValueOnce({ data: mockInventory }) // first load
      .mockResolvedValueOnce({
        data: [
          ...mockInventory.map((entry) =>
            entry.pk === 'Fruit'
              ? { ...entry, list: [...entry.list, 'Bananas'] }
              : entry
          ),
        ],
      }); // after adding item

    render(<Inventory />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Add new item in Fruit
    await userEvent.type(
      screen.getByPlaceholderText(/add new item to fruit/i),
      'Bananas'
    );
    await userEvent.click(
      screen.getAllByRole('button', { name: /add item/i })[0]
    );

    await waitFor(() =>
      expect(screen.getByText('Bananas')).toBeInTheDocument()
    );
  });

  test('deletes an item when delete is clicked and confirm returns true', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    axios.delete.mockResolvedValue({ data: {} });

    // When inventory is fetched after delete, return one item removed
    axios.get
      .mockResolvedValueOnce({ data: mockInventory }) // first load
      .mockResolvedValueOnce({
        data: [
          { pk: 'Fruit', list: [] },
          mockInventory[1],
          mockInventory[2],
        ],
      }); // after delete

    render(<Inventory />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await userEvent.click(deleteButtons[0]); // Delete "Apples"

    await waitFor(() =>
      expect(screen.queryByText('Apples')).not.toBeInTheDocument()
    );
  });
});