window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("ojtForm") as HTMLFormElement | null;
  const logSummary = document.getElementById("logSummary") as HTMLElement | null;
  const foodInput = document.getElementById("food") as HTMLInputElement | null;
  const freeFoodCheckbox = document.getElementById("freeFood") as HTMLInputElement | null;

  if (!form || !logSummary || !foodInput || !freeFoodCheckbox) {
    alert("Error: Missing elements in the HTML. Please check element IDs.");
    return;
  }

  freeFoodCheckbox.addEventListener("change", () => {
    foodInput.disabled = freeFoodCheckbox.checked;
    if (freeFoodCheckbox.checked) {
      foodInput.value = "";
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const date = (document.getElementById("date") as HTMLInputElement).value;
    const timeIn = (document.getElementById("timeIn") as HTMLInputElement).value;
    const timeOut = (document.getElementById("timeOut") as HTMLInputElement).value;
    const description = (document.getElementById("description") as HTMLTextAreaElement).value.trim();
    const transport = (document.getElementById("transport") as HTMLInputElement).value;
    const food = freeFoodCheckbox.checked ? "Free" : (foodInput.value || "₱0");

    const entryHTML = `
      <div class="entry">
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time In:</strong> ${timeIn}</p>
        <p><strong>Time Out:</strong> ${timeOut}</p>
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Transport Cost:</strong> ₱${transport || "0.00"}</p>
        <p><strong>Food Cost:</strong> ${food}</p>
      </div>
    `;

    // Insert HTML output for Log Summary
    logSummary.insertAdjacentHTML("afterbegin", entryHTML);

    // Reset form and re-enable food input
    form.reset();
    foodInput.disabled = false;
  });
});
