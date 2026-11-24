import { describe, expect, it, jest } from '@jest/globals';
import { render, screen, userEvent } from '@testing-library/react-native';
import { Button } from '@/shared/theme/Button.tsx';

describe('Button', () => {
  it('shows its label and reports a press', async () => {
    const onPress = jest.fn<() => void>();
    await render(<Button label="Add" tone="yellow" onPress={onPress} />);
    await userEvent.setup().press(screen.getByRole('button', { name: 'Add' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('can be selected or disabled', async () => {
    await render(
      <>
        <Button label="All" small aria-selected />
        <Button label="Clear" tone="pink" disabled />
      </>,
    );
    expect(screen.getByRole('button', { name: 'All' })).toBeSelected();
    expect(screen.getByRole('button', { name: 'Clear' })).toBeDisabled();
  });
});
