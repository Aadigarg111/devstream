import clsx from "clsx";

type AnimatedLogoProps = {
  compact?: boolean;
  className?: string;
  markClassName?: string;
};

export default function AnimatedLogo({ compact = false, className, markClassName }: AnimatedLogoProps) {
  return (
    <div className={clsx("inline-flex items-center gap-3", className)}>
      <div className={clsx("ds-logo-mark", markClassName)} aria-hidden>
        <span className="ds-logo-glow" />
        <span className="ds-logo-ring ds-logo-ring-outer" />
        <span className="ds-logo-ring ds-logo-ring-inner" />
        <span className="ds-logo-core">DS</span>
      </div>
      {!compact && (
        <span className="text-lg font-semibold tracking-[-0.03em] text-white">
          Dev<span className="text-sky-300">Stream</span>
        </span>
      )}
    </div>
  );
}
