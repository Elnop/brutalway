import type { Piece } from '#src/features/split/SplitTypes.ts';

export function pieceAt(pieces: Piece[], offset: number): Piece | undefined {
  return pieces.find((piece) => offset >= piece.start && offset < piece.end);
}
