import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SiteHeader from './SiteHeader';
import { describe, test, expect, beforeEach } from 'vitest';

describe('SiteHeader', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <SiteHeader />
      </MemoryRouter>
    );
  });

  test('renders brand link with correct text and href', () => {
    const brandLink = screen.getByRole('link', { name: /inventory tracker/i });
    expect(brandLink).toBeInTheDocument();
    expect(brandLink.getAttribute('href')).toBe('/');
  });

  test('renders navigation links with correct text and hrefs', () => {
    const links = [
      { name: /home/i, href: '/' },
      { name: 'About', href: '/aboutus' },
      { name: /contact us/i, href: '/contact' },
      { name: /view inventory/i, href: '/inventory' },
    ];

    links.forEach(({ name, href }) => {
      const link = screen.getByRole('link', { name });
      expect(link).toBeInTheDocument();
      expect(link.getAttribute('href')).toBe(href);
    });
  });

  test('has navbar toggler button', () => {
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('navbar-toggler');
  });
});