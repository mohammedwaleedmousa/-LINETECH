/** Decorative geometry derived from the copy on each page, with no external assets. */
export default function ContentHeroArt({ motif }: { motif: string }) {
  return (
    <div className="content-hero-art" aria-hidden="true">
      <img src={`/hero-content/${motif}.svg`} alt="" width="800" height="800" decoding="async" draggable={false} />
    </div>
  );
}
