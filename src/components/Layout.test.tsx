import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/config';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import Layout from './Layout';

describe('Layout', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <AuthProvider>
            <BrowserRouter>
              <Layout />
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </I18nextProvider>
    );
    expect(container).toBeTruthy();
  });
});
