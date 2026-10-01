function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="17" cy="7" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 21v-7.5h2.5l.5-3H14V8.5c0-.9.3-1.5 1.7-1.5H17V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.3H8.5v3H11V21" />
    </svg>
  );
}

function IconYoutube() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <rect x="3" y="6" width="18" height="12" rx="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export type RedesSociales = { instagram?: string | null; facebook?: string | null; youtube?: string | null };

export function SocialLinks({ redes, className = "" }: { redes?: RedesSociales; className?: string }) {
  const socials = [
    { name: "Instagram", href: redes?.instagram, Icon: IconInstagram },
    { name: "Facebook", href: redes?.facebook, Icon: IconFacebook },
    { name: "YouTube", href: redes?.youtube, Icon: IconYoutube },
  ].filter((s): s is { name: string; href: string; Icon: typeof IconInstagram } => !!s.href);

  if (socials.length === 0) return null;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {socials.map(({ name, href, Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={name}
          className="cursor-pointer text-current opacity-70 transition hover:opacity-100"
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}
