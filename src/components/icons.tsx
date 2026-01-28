import Image from 'next/image';

export const ChronoBoardLogo = ({ className }: { className?: string }) => {
  return (
    <div className={`relative ${className}`}>
      <Image
        src="https://i.ibb.co/dKq4Xf5/chronoboard-logo.png"
        alt="ChronoBoard Logo"
        fill
        className="object-contain"
      />
    </div>
  );
};
