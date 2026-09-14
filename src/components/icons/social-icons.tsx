export function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-7.8h2.6l.4-3h-3v-1.9c0-.87.24-1.46 1.49-1.46h1.6V4.14C15.9 4.06 15 4 13.94 4c-2.34 0-3.94 1.43-3.94 4.04V10.2H7.4v3h2.6V21h3.5Z" />
    </svg>
  );
}

export function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M21.6 7.5a2.7 2.7 0 0 0-1.9-1.9C18.1 5.1 12 5.1 12 5.1s-6.1 0-7.7.5A2.7 2.7 0 0 0 2.4 7.5 28 28 0 0 0 2 12a28 28 0 0 0 .4 4.5 2.7 2.7 0 0 0 1.9 1.9c1.6.5 7.7.5 7.7.5s6.1 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9A28 28 0 0 0 22 12a28 28 0 0 0-.4-4.5ZM10 15.3V8.7l5.7 3.3-5.7 3.3Z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: FacebookIcon,
    className: "bg-[#1877F2]",
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: InstagramIcon,
    className: "bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888]",
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: YoutubeIcon,
    className: "bg-[#FF0000]",
  },
];

export function SocialButtons({
  size = "h-9 w-9",
  iconSize = "h-5 w-5",
}: {
  size?: string;
  iconSize?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {SOCIAL_LINKS.map((social) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.name}
          className={`flex items-center justify-center rounded-md text-white transition hover:opacity-90 ${size} ${social.className}`}
        >
          <social.icon className={iconSize} />
        </a>
      ))}
    </div>
  );
}
