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
  let k0 = -1;
  let k1 = -1;

  while (
    (k0 = s.indexOf(marker.show.start, k1)) !== -1 &&
    (k1 = s.indexOf(marker.show.end, k0)) !== -1
  )
    s = `${s.slice(0, k0)}${s.slice(k0 + marker.show.start.length, k1)}${s.slice(k1 + marker.show.end.length)}`;

  k0 = -1;
  k1 = -1;

  while (
    (k0 = s.indexOf(marker.hide.start, k1)) !== -1 &&
    (k1 = s.indexOf(marker.hide.end, k0)) !== -1
  )
    s = `${s.slice(0, k0 + marker.show.start.length - 1)}${s.slice(k0 + marker.show.start.length, k1)}${s.slice(k1 + marker.show.end.length + 2)}`;

  return s;
}
