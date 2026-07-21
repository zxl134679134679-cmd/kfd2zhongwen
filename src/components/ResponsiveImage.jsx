function optimizedSource(src, width) {
  const filename = src.split("/").pop();
  const basename = filename?.replace(/\.[^.]+$/, "");
  return `/assets/optimized/${basename}-${width}.webp`;
}

export function ResponsiveImage({
  src,
  mobileSrc = optimizedSource(src, 760),
  desktopSrc = optimizedSource(src, 1448),
  alt = "",
  sizes,
  loading,
  fetchPriority,
  ...imageProps
}) {
  const resolvedFetchPriority = fetchPriority ?? (loading === "lazy" ? "low" : undefined);

  return (
    <picture>
      <source media="(max-width: 760px)" srcSet={mobileSrc} type="image/webp" />
      <source srcSet={desktopSrc} type="image/webp" />
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        loading={loading}
        fetchPriority={resolvedFetchPriority}
        decoding="async"
        {...imageProps}
      />
    </picture>
  );
}
