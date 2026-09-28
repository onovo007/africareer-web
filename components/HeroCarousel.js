import Image from "next/image";
// A stable photograph keeps contrast predictable and avoids loading six slides.
export default function HeroCarousel({ fill = false }) {
 return <div className={fill ? "hero-photograph" : "relative aspect-[16/8] overflow-hidden rounded-3xl"} aria-hidden="true"><Image src="/hero1.jpg" alt="" fill priority sizes="100vw" className="object-cover object-center" /><div className="photograph-wash" /></div>;
}
