import PageContent from "./PageContent";

export const metadata={title:"Start Your Line",description:"Start a project with LINETECH and turn your idea into a clear digital product brief."};

const finderRestoreScript = `
(() => {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('source') !== 'finder') return;

    const storageKey = 'linetech-service-finder-v1';
    const serviceParam = params.get('service') || '';
    const answerIds = {};

    ['outcome', 'priority', 'stage'].forEach((key) => {
      const value = params.get(key);
      if (value) answerIds[key] = value;
    });

    let existing = {};
    try {
      existing = JSON.parse(window.localStorage.getItem(storageKey) || '{}') || {};
    } catch (_) {}

    const mergedAnswers = Object.assign({}, existing.answerIds || {}, answerIds);
    const snapshot = Object.assign({}, existing, {
      answerIds: mergedAnswers,
      completed: true,
      index: 3,
      serviceParam: serviceParam || existing.serviceParam || '',
      savedAt: new Date().toISOString(),
    });

    window.localStorage.setItem(storageKey, JSON.stringify(snapshot));
  } catch (_) {}
})();`;

export default function Page() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: finderRestoreScript }} />
      <PageContent />
    </>
  );
}
