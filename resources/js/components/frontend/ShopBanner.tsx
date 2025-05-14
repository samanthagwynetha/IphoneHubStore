// resources/js/components/Hero.tsx
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(titleRef.current, {
      y: -50,
      opacity: 0,
      duration: 1,
    })
    .from(subtitleRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.8,
    }, "-=0.5")
    .from(imageRef.current, {
      y: 40,
      opacity: 0,
      duration: 1,
    }, "-=0.6");
  }, []);

  return (
    <section className="py-20 text-center items-center justify-center flex flex-col overflow-hidden w-full h-[calc(100vh-60px)] relative ">
     <div className="h-5/6 w-full flex items-center justify-center flex-col">
        <h1 ref={titleRef} className="font-bold text-[50px]">iPhone 16 Pro</h1>
        <h3 ref={subtitleRef} className="text-[#86868b]">starting at ₱69,990</h3>
        <img ref={imageRef} src="/images/iPhone.png" alt="iPhone" className="mt-6 max-w-full h-auto" />
     </div>
    </section>
  );
}
