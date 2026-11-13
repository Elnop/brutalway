import { describe, expect, it } from '@jest/globals';
import { Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { PageShell } from '@/features/page-shell/PageShell.tsx';

describe('PageShell', () => {
  it('shows the title, the tagline, the actions and the content of the page', async () => {
    await render(
      <PageShell title="Todos" tagline="Get things done" actions={<Text>Switch</Text>}>
        <Text>Content</Text>
      </PageShell>,
    );
    expect(screen.getByRole('heading', { name: 'Todos' })).toBeOnTheScreen();
    expect(screen.getByText('Get things done')).toBeOnTheScreen();
    expect(screen.getByText('Switch')).toBeOnTheScreen();
    expect(screen.getByText('Content')).toBeOnTheScreen();
  });
});
