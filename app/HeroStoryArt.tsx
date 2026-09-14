type HeroStoryArtProps = {
  name:
    | "home"
    | "services"
    | "projects"
    | "about"
    | "how-we-work"
    | "start"
    | "service-finder"
    | "web-development"
    | "ecommerce-systems"
    | "brand-identity"
    | "cv-portfolio"
    | "faq"
    | "privacy"
    | "terms";
};

export default function HeroStoryArt({ name }: HeroStoryArtProps) {
  return (
    <div className={`hero-story-art hero-story-art-${name}`} aria-hidden="true">
      <img src={`/hero-art/${name}.svg`} alt="" draggable={false} />
    </div>
  );
}
