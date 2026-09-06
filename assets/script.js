      (function () {
          const c = document.currentScript;
          const b = c && c.src ? c.src.replace(/[^/]*$/, "") : "/assets/";
          const s = document.createElement("script");
          s.src = b + "config.js";
          document.head.appendChild(s);
      })();

      function d(a) {
          return (a || []).map((x) => x.split("").reverse().join(""));
      }

      function l() {
          const w = window.__siteConfig;
          return w ? { a: d(w.a), b: d(w.b) } : null;
      }

      let plusOneAllowed = false;

      function handleRSVPChange() {
          const guestInfo = document.getElementById("guest_info");
          const plusOneInfo = document.getElementById("plus_one_info");
          const radioButtons = document.querySelectorAll(
              'input[type="radio"]',
          );

          if (document.getElementById("rsvp_0").checked) {
              // Attending - show guest info only
              guestInfo.hidden = false;
              plusOneInfo.hidden = true;
          } else if (document.getElementById("rsvp_1").checked) {
              guestInfo.hidden = false;
              plusOneInfo.hidden = false;
          } else if (document.getElementById("rsvp_2").checked) {
              guestInfo.hidden = true;
              plusOneInfo.hidden = true;
              radioButtons.forEach((radio) => {
                  if (radio.id == "rsvp_2") {
                      radio.checked = true;
                  } else {
                      radio.checked = false;
                  }
              });
          }
      }

      document
          .getElementById("rsvp_0")
          .addEventListener("change", handleRSVPChange);
      document
          .getElementById("rsvp_1")
          .addEventListener("change", handleRSVPChange);
      document
          .getElementById("rsvp_2")
          .addEventListener("change", handleRSVPChange);

      function syncDietaryOther(groupName, otherId, otherInputId) {
          const selected = document.querySelector(
              'input[name="' + groupName + '"]:checked',
          );
          const isOther = selected && selected.value === "Other";
          const container = document.getElementById(otherId);
          container.hidden = !isOther;
          const input = document.getElementById(otherInputId);
          if (isOther) {
              input.required = true;
          } else {
              input.required = false;
              input.value = "";
          }
      }

      document
          .querySelectorAll('input[name="dietary_preference"]')
          .forEach(function (radio) {
              radio.addEventListener("change", function () {
                  syncDietaryOther(
                      "dietary_preference",
                      "guest_dietary_other",
                      "dietary_preference_other",
                  );
              });
          });

      document
          .querySelectorAll("input[name=\"+1's_dietary_preference\"]")
          .forEach(function (radio) {
              radio.addEventListener("change", function () {
                  syncDietaryOther(
                      "+1's_dietary_preference",
                      "plus_one_dietary_other",
                      "_1_s_dietary_preference_other",
                  );
              });
          });

      function unlockRSVP() {
          const codeInput = document.getElementById("invite_code");
          const codeError = document.getElementById("code_error");
          const code = codeInput.value.trim().toUpperCase();
          const codes = l();

          if (!codes) {
              codeError.textContent =
                  "Invite codes are still loading. Please try again in a moment.";
              codeError.hidden = false;
              return;
          }

          if (codes.a.includes(code)) {
              plusOneAllowed = true;
          } else if (codes.b.includes(code)) {
              plusOneAllowed = false;
          } else {
              codeError.textContent =
                  "Sorry, that invite code isn't recognized. Please check your invitation and try again.";
              codeError.hidden = false;
              codeInput.focus();
              return;
          }

          codeError.textContent = "";
          codeError.hidden = true;
          document.getElementById("code_step").hidden = true;
          document.getElementById("plus_one_choice").hidden = !plusOneAllowed;
          if (!plusOneAllowed) {
              document.getElementById("rsvp_1").checked = false;
          }
          document.getElementById("rsvp_body").hidden = false;
          handleRSVPChange();
      }

      document
          .getElementById("code_submit")
          .addEventListener("click", unlockRSVP);

      document
          .getElementById("invite_code")
          .addEventListener("keydown", function (event) {
              if (event.key === "Enter") {
                  event.preventDefault();
                  unlockRSVP();
              }
          });

      document
          .getElementById("form")
          .addEventListener("submit", function (event) {
              // While the code step is still showing, only unlock the RSVP
              // form - never submit anything to web3forms yet.
              if (!document.getElementById("rsvp_body").hidden) {
                  return;
              }
              event.preventDefault();
              unlockRSVP();
          });

      document.addEventListener("DOMContentLoaded", function () {
          handleRSVPChange();
          syncDietaryOther(
              "dietary_preference",
              "guest_dietary_other",
              "dietary_preference_other",
          );
          syncDietaryOther(
              "+1's_dietary_preference",
              "plus_one_dietary_other",
              "_1_s_dietary_preference_other",
          );
      });
