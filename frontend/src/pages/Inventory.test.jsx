import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Inventory from './Inventory';
import { describe, beforeEach, test, expect, vi } from 'vitest';

// Mock the fake backend module's functions if needed, 
// but here we test as-is, so we can mock global prompts and confirms.

describe('Inventory Component', () => {
  beforeEach(() => {
    // Reset fakeBackend if you extracted it for test isolation,
    // or reload component fresh each test.
  });

  test('shows loading initially and then renders inventory categories and items', async () => {
    render(<Inventory />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for the inventory to load
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
    render(<Inventory />);

    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    );

    await userEvent.type(screen.getByPlaceholderText(/name/i), 'Bananas');
    await userEvent.type(screen.getByPlaceholderText(/quantity/i), '50');
    await userEvent.type(screen.getByPlaceholderText(/category/i), 'Fruit');
    await userEvent.click(screen.getByRole('button', { name: /add item/i }));

    await waitFor(() =>
      expect(screen.getByText('Bananas')).toBeInTheDocument()
    );

    expect(screen.getByText('50')).toBeInTheDocument();
  });

  test('deletes an item when delete is clicked and confirm returns true', async () => {
    render(<Inventory />);

    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());

    // Mock confirm to always return true
    const confirmMock = vi.spyOn(window, 'confirm').mockReturnValue(true);

    // Assume first Delete button corresponds to Apples
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    userEvent.click(deleteButtons[0]);

    // Wait for Apples to disappear
    await waitFor(() => {
      expect(screen.queryByText('Apples')).not.toBeInTheDocument();
    });

    confirmMock.mockRestore();
  });
});