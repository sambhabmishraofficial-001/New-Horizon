(() => {
  const form = document.getElementById("waitlist-form");
  const ok = document.getElementById("ok");
  if (!form || !ok) return;

  const joined = new URLSearchParams(window.location.search).get("joined") === "1";
  if (joined) {
    form.hidden = true;
    ok.classList.add("show");
    return;
  }

  const next = form.querySelector('input[name="_next"]');
  if (next) {
    const url = new URL(window.location.href);
    url.searchParams.set("joined", "1");
    next.value = url.toString();
  }
})();
