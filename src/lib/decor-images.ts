/** Local decorative basketball photography (public/brand/decor). */
export const DECOR_IMAGES = [
  "/brand/decor/decor-01.jpg",
  "/brand/decor/decor-02.jpg",
  "/brand/decor/decor-03.jpg",
  "/brand/decor/decor-04.jpg",
  "/brand/decor/decor-05.jpg",
  "/brand/decor/decor-06.jpg",
  "/brand/decor/decor-07.jpg",
  "/brand/decor/decor-08.jpg",
  "/brand/decor/decor-09.jpg",
  "/brand/decor/decor-10.jpg",
  "/brand/decor/decor-11.jpg",
  "/brand/decor/decor-12.jpg",
  "/brand/decor/decor-13.jpg",
  "/brand/decor/decor-14.jpg",
  "/brand/decor/decor-15.jpg",
  "/brand/decor/decor-16.jpg",
  "/brand/decor/decor-17.jpg",
  "/brand/decor/decor-18.jpg",
];

export function decorIndexForPath(pathname: string): number {
  const key = pathname || "/";
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return hash % DECOR_IMAGES.length;
}

export function decorImageAt(index: number): string {
  return DECOR_IMAGES[((index % DECOR_IMAGES.length) + DECOR_IMAGES.length) % DECOR_IMAGES.length];
}
