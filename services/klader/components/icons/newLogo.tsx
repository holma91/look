import Image from 'next/image'; // Import Next.js Image component if not already imported

export default function LogoIcon(props: React.ComponentProps<'img'>) {
  return (
    <Image
      src="/logo-white.svg" // Update with the path to your SVG file
      alt={`${process.env.SITE_NAME} logo`}
      width={32} // Set appropriate width
      height={28} // Set appropriate height
    />
  );
}
