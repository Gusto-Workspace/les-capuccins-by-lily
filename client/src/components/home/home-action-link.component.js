import Link from "next/link";

export default function HomeActionLink({
  href,
  children,
  secondary = false,
}) {
  const classes = secondary
    ? "site-button site-button--secondary"
    : "site-button";

  if (href.startsWith("tel:")) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
