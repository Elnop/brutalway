type PickerProps = { picked: () => void; onClear: () => void };

export function Picker({ picked, onClear }: PickerProps) {
  return (
    <button type="button" className={'picker'} onClick={picked} onDoubleClick={onClear}>
      pick
    </button>
  );
}
