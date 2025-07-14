let totalHours = 0;

window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("ojtForm");
  const logSummary = document.getElementById("logSummary");
  const foodInput = document.getElementById("food");
  const freeFoodCheckbox = document.getElementById("freeFood");
  const progressBar = document.getElementById("progressBar");
  const hoursDisplay = document.getElementById("hoursDisplay");
  const moodSelect = document.getElementById("mood");
  const copyLogs = document.getElementById("copyLogs");
  const downloadLogs = document.getElementById("downloadLogs");

  if (!form || !logSummary || !foodInput || !freeFoodCheckbox) return;

  const entries = [];

  freeFoodCheckbox.addEventListener("change", () => {
    foodInput.disabled = freeFoodCheckbox.checked;
    if (freeFoodCheckbox.checked) foodInput.value = "";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const date = document.getElementById("date").value;
    const timeIn = document.getElementById("timeIn").value;
    const timeOut = document.getElementById("timeOut").value;
    const description = document.getElementById("description").value.trim();
    const transport = document.getElementById("transport").value;
    const food = freeFoodCheckbox.checked ? "Free" : (foodInput.value || "₱0");
    const mood = moodSelect.value;

    const [hIn, mIn] = timeIn.split(":" ).map(Number);
    const [hOut, mOut] = timeOut.split(":" ).map(Number);
    const inMinutes = hIn * 60 + mIn;
    const outMinutes = hOut * 60 + mOut;

    let durationMinutes = outMinutes - inMinutes;

    // ✅ Always minus 1 hour for lunch
    durationMinutes -= 60;

    let duration = Math.max(durationMinutes / 60, 0);
    totalHours += duration;

    const hoursRounded = totalHours.toFixed(2);
    const progressPercent = Math.min((totalHours / 300) * 100, 100);

    hoursDisplay.textContent = `Total Hours: ${hoursRounded} / 300`;
    progressBar.style.width = `${progressPercent}%`;

    const entry = `
      Date: ${date}
      Time In: ${timeIn}
      Time Out: ${timeOut}
      Duration: ${duration.toFixed(2)} hours (lunch deducted)
      Description: ${description}
      Transport Cost: ₱${transport || "0.00"}
      Food Cost: ${food}
      Mood: ${mood}
    `.trim();

    entries.push(entry);

    const html = `
      <div class="entry">
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time In:</strong> ${timeIn}</p>
        <p><strong>Time Out:</strong> ${timeOut}</p>
        <p><strong>Duration:</strong> ${duration.toFixed(2)} hours (lunch deducted)</p>
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Transport Cost:</strong> ₱${transport || "0.00"}</p>
        <p><strong>Food Cost:</strong> ${food}</p>
        <p><strong>Mood:</strong> ${mood}</p>
      </div>
    `;

    logSummary.insertAdjacentHTML("afterbegin", html);
    form.reset();
    foodInput.disabled = false;
  });

  copyLogs.addEventListener("click", () => {
    const allLogs = entries.join("\n\n");
    navigator.clipboard.writeText(allLogs).then(() => {
      alert("Logs copied! Paste them here or in ChatGPT to generate a report.");
    });
  });

  downloadLogs.addEventListener("click", () => {
    const blob = new Blob([entries.join("\n\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ojt-logs.txt";
    a.click();
    URL.revokeObjectURL(url);
  });
});
