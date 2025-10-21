const marker = {
  show: {
    start: "<!-- docsgen-show-start --",
    end: "-- docsgen-show-end -->",
  },
  hide: {
    start: "<!-- docsgen-hide-start -->",
    end: "<!-- docsgen-hide-end -->",
  },
};

export function preprocessContent(s: string) {
  let k0 = s.length;
  let k1 = s.length;

  while (
    (k0 = s.lastIndexOf(marker.show.end, k1)) !== -1 &&
    (k1 = s.lastIndexOf(marker.show.start, k0)) !== -1
  )
    s = `${s.slice(0, k0)}${s.slice(k0 + marker.show.start.length, k1)}${s.slice(k1 + marker.show.end.length)}`;

  k0 = s.length;
  k1 = s.length;

  while (
    (k0 = s.lastIndexOf(marker.hide.end, k1)) !== -1 &&
    (k1 = s.lastIndexOf(marker.hide.start, k0)) !== -1
  )
    s = `${s.slice(0, k0 + marker.show.start.length - 1)}${s.slice(k0 + marker.show.start.length, k1)}${s.slice(k1 + marker.show.end.length + 2)}`;

  return s;
}
