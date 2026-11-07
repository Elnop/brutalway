type GalleryProps = {
  title: string;
  photos: string[];
  price: number;
  onOpen: (photo: string) => void;
  onClose: () => void;
  onShare: () => void;
  onDelete: () => void;
};

export function Gallery({ title, photos, price, onOpen }: GalleryProps) {
  return (
    <section>
      <h2>{title}</h2>
      <p>{price.toFixed(2)}</p>
      <ul>
        {photos
          .filter((photo) => photo !== '')
          .map((photo, index) => (
            <li key={index}>
              <button type="button" onClick={() => onOpen(photo)}>
                {photo}
              </button>
            </li>
          ))}
      </ul>
    </section>
  );
}
