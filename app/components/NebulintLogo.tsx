type NebulintLogoProps = {
  showTagline?: boolean;
};

export function NebulintLogo({ showTagline = false }: NebulintLogoProps) {
  return (
    <span
      className={`nebulint-logo${showTagline ? " nebulint-logo-full" : ""}`}
      aria-label="NEBULINT Intelligence. Engineered."
    >
      <img
        className="nebulint-logo-image nebulint-logo-dark"
        src="/logos/nebulint-logo-transparent-dark.png"
        alt=""
        aria-hidden="true"
      />
      <img
        className="nebulint-logo-image nebulint-logo-light"
        src="/logos/nebulint-logo-transparent-light.png"
        alt=""
        aria-hidden="true"
      />
    </span>
  );
}
