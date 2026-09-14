import PageContent from "./PageContent";

export const metadata = {
  title: "Find Your Service",
  description: "Answer three focused questions and find the LINETECH service that best matches your project goal.",
};

const finderTransferScript = `
(() => {
  const storageKey = 'linetech-service-finder-v1';

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element
      ? event.target.closest('a[href*="/start?service="]')
      : null;

    if (!target) return;

    try {
      const href = target.getAttribute('href');
      if (!href) return;

      const url = new URL(href, window.location.origin);
      url.searchParams.set('source', 'finder');

      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw);
        const answerIds = saved && saved.answerIds ? saved.answerIds : {};

        ['outcome', 'priority', 'stage'].forEach((key) => {
          if (answerIds[key]) url.searchParams.set(key, String(answerIds[key]));
        });

        if (saved && saved.serviceParam && !url.searchParams.get('service')) {
          url.searchParams.set('service', String(saved.serviceParam));
        }
      }

      target.setAttribute('href', url.pathname + '?' + url.searchParams.toString());
    } catch (_) {}
  });
})();`;

export default function Page() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: finderTransferScript }} />
      <PageContent />
    </>
  );
}
