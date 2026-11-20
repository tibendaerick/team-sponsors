(function () {
  var C = window.INVITE;
  var $ = function (id) { return document.getElementById(id); };
  var fmt = function (n) { return "UGX " + Number(n).toLocaleString("en-UG"); };
  var when = new Date(C.dateISO);

  function toast(msg) {
    var t = $("toast"); t.textContent = msg; t.classList.add("show");
    setTimeout(function () { t.classList.remove("show"); }, 2400);
  }
  function wa(text) {
    return "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(text);
  }

  /* text from config */
  document.title = C.event + ": " + C.home;
  $("tagline").textContent = C.tagline;
  $("eventName").textContent = C.event;
  $("homeName").textContent = C.homeShort;
  $("awayName").textContent = C.away;
  $("dateLabel").textContent = C.dateLabel;
  $("timeLabel").textContent = C.timeLabel;
  $("venueLabel").textContent = C.venue;
  $("entryLabel").textContent = C.entry;
  $("accName").textContent = C.donate.accountName;
  $("accChannel").textContent = C.donate.channel;
  $("accNumber").textContent = C.donate.number;
  $("targetTxt").textContent = fmt(C.target);
  $("raisedTxt").textContent = fmt(C.raised);
  $("fill").style.width = Math.min(100, Math.round(C.raised / C.target * 100)) + "%";
  $("mail").textContent = C.email;

  /* lists */
  $("programme").innerHTML = C.programme.map(function (p) {
    return "<li><b>" + p.time + "</b>" + p.item + "</li>";
  }).join("");
  $("tiers").innerHTML = C.tiers.map(function (t) {
    return '<article class="tier' + (t.featured ? " featured" : "") + '"><h3>' + t.name +
      '</h3><p class="amt">' + t.amount + "</p><p>" + t.perks + "</p></article>";
  }).join("");
  $("uses").innerHTML = C.uses.map(function (u) { return "<li>" + u + "</li>"; }).join("");

  /* WhatsApp links */
  $("rsvp").href = wa("Hello, I will surely attend the " + C.event + " on " + C.dateLabel + ".");
  $("pledge").href = wa("Hello, I would like to support the " + C.event + ". My pledge: UGX ____ . My name: ____");
  $("wa").href = wa("Hello, I have a question about the " + C.event + ".");

  /* countdown */
  function tick() {
    var d = when - new Date();
    if (isNaN(d)) { return; }
    if (d <= 0) { $("count").innerHTML = "<p><b>It is match day. See you at the pitch.</b></p>"; return; }
    $("cd").textContent = Math.floor(d / 864e5);
    $("ch").textContent = Math.floor(d % 864e5 / 36e5);
    $("cm").textContent = Math.floor(d % 36e5 / 6e4);
    $("cs").textContent = Math.floor(d % 6e4 / 1e3);
  }
  tick(); setInterval(tick, 1000);

  /* copy account number */
  $("copyBtn").addEventListener("click", function () {
    var v = C.donate.number;
    var done = function () { toast("Account number copied"); };
    if (navigator.clipboard) { navigator.clipboard.writeText(v).then(done, function () { toast("Copy failed. Select the number and copy it."); }); }
    else { toast("Select the number and copy it."); }
  });

  /* share */
  $("shareBtn").addEventListener("click", function () {
    var data = { title: C.event, text: C.event + ": " + C.home + " vs " + C.away + ", " + C.dateLabel + ". " + C.entry, url: location.href };
    if (navigator.share) { navigator.share(data).catch(function () {}); }
    else if (navigator.clipboard) { navigator.clipboard.writeText(location.href).then(function () { toast("Link copied. Paste it anywhere."); }); }
  });

  /* add to calendar (.ics download) */
  $("calBtn").addEventListener("click", function () {
    var z = function (d) { return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"; };
    var end = new Date(when.getTime() + 2 * 36e5);
    var ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Tukazane//Unity Cup//EN", "BEGIN:VEVENT",
      "UID:" + z(when) + "@tukazane", "DTSTAMP:" + z(new Date()), "DTSTART:" + z(when), "DTEND:" + z(end),
      "SUMMARY:" + C.event + " (" + C.homeShort + " vs " + C.away + ")", "LOCATION:" + C.venue,
      "DESCRIPTION:" + C.tagline, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = "unity-cup.ics"; document.body.appendChild(a); a.click(); a.remove();
    toast("Calendar file downloaded");
  });
})();