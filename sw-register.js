// Rejestracja service workera: tylko na własnym adresie HTTPS (albo localhost do testów).
// Daje działanie offline po pierwszym otwarciu. Dane aplikacji zostają w localStorage telefonu.
(function () {
  if (!('serviceWorker' in navigator)) return;
  var h = location.hostname;
  var secure = location.protocol === 'https:' || h === 'localhost' || h === '127.0.0.1';
  if (!secure) return;
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('./sw.js').catch(function () { /* bez SW aplikacja działa online */ });
  });
  // Nowa wersja pobrana w tle (start z pamięci): komunikat z przyciskiem Odśwież; bez odświeżenia włączy się przy następnym uruchomieniu
  navigator.serviceWorker.addEventListener('message', function (e) {
    if (e.data && e.data.type === 'nowa-wersja' && typeof toast === 'function') toast('Jest nowa wersja Miary.', { act: 'odswiez', arg: '1', label: 'Odśwież', ms: 15000 });
  });
})();
