export function getIcon(baseColor = "gray") {
  return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <style>.b{fill:${baseColor};}.c0{fill:oklch(from ${baseColor} calc(100*(.78 - l)) 0 0 / .5);}.c1{fill:oklch(from ${baseColor} calc(100*(.78 - l)) 0 0 / .3);}.c2{fill:none;}</style>
        <g stroke="none">
            <path d="M0,15 L50,0 L100,15 L100,78 L50,100 L0,81z" stroke="none" class="b"/>
            <path d="M0,15 L50,30 L100,15 L50,0z" stroke="none" class="c1"/>
            <path d="M0,15 L50,30 L50,100 L0,81z" stroke="none" class="c0"/>
            <path d="M50,30 L100,15 L100,78 L50,100z" stroke="none" class="c2"/>
        </g>
        </svg>
    `
    .trim()
    .replace(/\s+/g, " ")
    .replace(/> </g, "><");
}
