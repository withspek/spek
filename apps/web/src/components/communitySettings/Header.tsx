import Link from "next/link";

interface HeaderProps {
  avatar?: string;
  subheading: { to: string; label: string; description: string };
  heading: string;
}

export const Header: React.FC<HeaderProps> = ({
  heading,
  subheading,
  avatar,
}) => {
  return (
    <div>
      <Link href={subheading.to}>
        <h3 className="text-primary-800">{subheading.label}</h3>
      </Link>
      <h2>{heading}</h2>
      <p className="text-primary-700">{subheading.description}</p>
    </div>
  );
};
