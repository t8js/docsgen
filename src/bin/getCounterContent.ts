import { getConfig } from "./getConfig";

export async function getCounterContent() {
  let { ymid } = await getConfig();

  if (!ymid) return "";

  return `
<script>
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document, "script", "https://mc.yandex.com/metrika/tag.js", "ym");
ym(${ymid}, "init", {clickmap: true, trackLinks: true, accurateTrackBounce: true});
</script>
<noscript><div><img src="https://mc.yandex.com/watch/${ymid}" style="position:absolute;left:-9999px;" alt=""></div></noscript>
        `.trim();
}
