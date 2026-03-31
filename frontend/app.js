  const commonFields = [
    'email', 'firstname', 'lastname', 'phone', 'company', 'jobtitle',
    'website', 'address', 'city', 'state', 'zip', 'country',
    'lifecyclestage', 'hs_lead_status', 'hs_analytics_source',
    'hs_language', 'twitterhandle'
  ];
  const commonCompanyFields = [
    'name', 'domain', 'phone', 'industry', 'address', 'city', 'state', 'zip',
    'country', 'website', 'type', 'lifecyclestage', 'numberofemployees', 'annualrevenue'
  ];
  let currentMode = "contact";
// GET CONTACT FIELDS
async function getContactFields() {
  const btn = event.currentTarget;
  setButtonState(btn, { disabled: true, text: "Loading..." });
  setOtherButtonsDisabled(btn, true);
  document.getElementById('response').classList.add('d-none')
  const token = document.getElementById('token').value;

  if (!token) {
    alert("Please Enter access token");
    setButtonState(btn, { disabled: false });
    setOtherButtonsDisabled(btn, false);
    return;
  }
 try {
  
    const res = await fetch("http://localhost:3000/api/get-contact-required-fields", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        access_token: token
      })
    });

    const data = await res.json();
    const output = document.getElementById('output');
    output.innerHTML = "";

    if (data.status) {
      renderFields(data.data.results);
      currentMode = "contact";
      document.querySelector('.modal-title').textContent = 'Create Contact';
      document.getElementById("submitBtn").textContent = "Create Contact";

      const modal = new bootstrap.Modal(document.getElementById('fieldsModal'));
      modal.show();
    } else {
      output.textContent = JSON.stringify(data, null, 2);
      document.getElementById('response').classList.remove('d-none')
    }
 } catch (error) {
   const output = document.getElementById('output');
   output.innerHTML = "";
   output.textContent = JSON.stringify({ error: error.message }, null, 2);
   document.getElementById('response').classList.remove('d-none')
  } finally {
    setButtonState(btn, { disabled: false });
    setOtherButtonsDisabled(btn, false);
  }
  
}
function toggleOtherFields() {
  const container = document.getElementById("otherFieldsContainer");
  const btn = document.getElementById("toggleOtherBtn");

  container.classList.toggle("d-none");

  btn.textContent = container.classList.contains("d-none") ? "Show Other Fields" : "Hide Other Fields";
}


// CREATE CONTACT
async function createContact() {
  const btn = event.currentTarget;
  setButtonState(btn, { disabled: true, text: "Creating..." });
  const token = document.getElementById('token').value;

  if (!token) {
    alert("Please Enter access token");
    setButtonState(btn, { disabled: false });
    return;
  }

  // STEP 1: collect all inputs + selects
  const inputs = document.querySelectorAll(
    "#commonFieldsContainer input, #commonFieldsContainer select"
  );

  let allData = [];

  // add token first
  allData.push({
    name: "access_token",
    value: token
  });

  inputs.forEach(input => {
    if (input.value && input.value.trim() !== "") {
      allData.push({
        name: input.name,
        value: input.value
      });
    }
  });

  try {
    const res = await fetch("http://localhost:3000/api/create-contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ allData })
    });

    const data = await res.json();

    // STEP 2: show response inside modal
    const responseBox = document.getElementById("createContactResponse");
    responseBox.classList.remove("d-none");

    responseBox.innerHTML = `
      <div class="alert ${data.status ? 'alert-success' : 'alert-danger'}">
        <strong>${data.message}</strong>
        <pre class="mt-2">${JSON.stringify(data, null, 2)}</pre>
      </div>
    `;
    responseBox.scrollIntoView({ behavior: "smooth", block: "center" });

  } catch (error) {
    const responseBox = document.getElementById("createContactResponse");
    responseBox.classList.remove("d-none");

    responseBox.innerHTML = `
      <div class="alert alert-danger">
        Error: ${error.message}
      </div>
    `;
    responseBox.scrollIntoView({ behavior: "smooth", block: "center" });
  } finally {
    setButtonState(btn, { disabled: false });
  }
}

function renderFields(fields) {
  const commonContainer = document.getElementById("commonFieldsContainer");
  const otherContainer = document.getElementById("otherFieldsContainer");

  commonContainer.innerHTML = "";
  otherContainer.innerHTML = "";

  fields.forEach(field => {
    if (commonFields.includes(field.name)) {
      const div = document.createElement("div");
      div.className = "col-md-6";

      div.innerHTML = getFieldHTML(field);

      commonContainer.appendChild(div);
    } else {
      const div = document.createElement("div");
      div.className = "col-md-4";

      div.innerHTML = `
        <div class="form-check">
          <input class="form-check-input" type="checkbox"
            id="other_${field.name}"
            data-field='${JSON.stringify(field)}'
            onchange="addOtherField(this)">
          <label class="form-check-label">
            ${field.label}
          </label>
        </div>
      `;

      otherContainer.appendChild(div);
    }
  });
}

// Add or remove selected other field dynamically
function addOtherField(checkbox) {
  const commonContainer = document.getElementById("commonFieldsContainer");

  if (checkbox.checked) {
    const field = JSON.parse(checkbox.dataset.field);

    const div = document.createElement("div");
    div.className = "col-md-6 added-other-field";
    div.dataset.name = checkbox.id;

    div.innerHTML = getFieldHTML(field);

    commonContainer.appendChild(div);
  } else {
    const fieldDiv = commonContainer.querySelector(
      `.added-other-field[data-name='${checkbox.id}']`
    );
    if (fieldDiv) fieldDiv.remove();
  }
}
function getFieldHTML(field) {
  // AGAR options hain → SELECT
  if (field.options && field.options.length > 0) {
    let optionsHTML = '<option value="">Select</option>';

    field.options.forEach(opt => {
      optionsHTML += `<option value="${opt.value}">${opt.label}</option>`;
    });

    return `
      <label class="form-label">${field.label}</label>
      <select class="form-control" name="${field.name}">
        ${optionsHTML}
      </select>
    `;
  }

  // warna normal input
  return `
    <label class="form-label">${field.label}</label>
    <input type="text" class="form-control" name="${field.name}">
  `;
}

function setButtonState(button, { disabled = true, text = "Loading..." } = {}) {
  button.disabled = disabled;
  button.dataset.originalText = button.dataset.originalText || button.textContent;
  button.textContent = disabled ? text : button.dataset.originalText;
}

async function getCompanyFields() {
  const btn = event.currentTarget;
  setButtonState(btn, { disabled: true, text: "Loading..." });
  setOtherButtonsDisabled(btn, true);

  document.getElementById('response').classList.add('d-none');
  const token = document.getElementById('token').value;

  if (!token) {
    alert("Please Enter access token");
    setButtonState(btn, { disabled: false });
    setOtherButtonsDisabled(btn, false);
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/get-company-required-fields", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: token })
    });

    const data = await res.json();
    const output = document.getElementById('output');
    output.innerHTML = "";

    if (data.status) {
      renderCompanyFields(data.data.results);
      currentMode = "company";
      document.querySelector('.modal-title').textContent = 'Create Company';
      document.getElementById("submitBtn").textContent = "Create Company";

      const modal = new bootstrap.Modal(document.getElementById('fieldsModal'));
      modal.show();
    } else {
      output.textContent = JSON.stringify(data, null, 2);
      document.getElementById('response').classList.remove('d-none');
    }
  } catch (error) {
    const output = document.getElementById('output');
    output.innerHTML = JSON.stringify({ error: error.message }, null, 2);
    document.getElementById('response').classList.remove('d-none');
  } finally {
    setButtonState(btn, { disabled: false });
    setOtherButtonsDisabled(btn, false);
  }
}
function renderCompanyFields(fields) {
  const commonContainer = document.getElementById("commonFieldsContainer");
  const otherContainer = document.getElementById("otherFieldsContainer");

  commonContainer.innerHTML = "";
  otherContainer.innerHTML = "";

  fields.forEach(field => {
    if (commonCompanyFields.includes(field.name)) {
      const div = document.createElement("div");
      div.className = "col-md-6";
      div.innerHTML = getFieldHTML(field);
      commonContainer.appendChild(div);
    } else {
      const div = document.createElement("div");
      div.className = "col-md-4";
      div.innerHTML = `
        <div class="form-check">
          <input class="form-check-input" type="checkbox"
            id="other_${field.name}"
            data-field='${JSON.stringify(field)}'
            onchange="addOtherField(this)">
          <label class="form-check-label">
            ${field.label}
          </label>
        </div>
      `;
      otherContainer.appendChild(div);
    }
  });
}
async function createCompany() {
  const btn = event.currentTarget;
  setButtonState(btn, { disabled: true, text: "Creating..." });

  const token = document.getElementById('token').value;
  if (!token) {
    alert("Please Enter access token");
    setButtonState(btn, { disabled: false });
    return;
  }

  const inputs = document.querySelectorAll("#commonFieldsContainer input, #commonFieldsContainer select");
  let allData = [{ name: "access_token", value: token }];

  inputs.forEach(input => {
    if (input.value && input.value.trim() !== "") {
      allData.push({ name: input.name, value: input.value });
    }
  });

  try {
    const res = await fetch("http://localhost:3000/api/create-company", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ allData })
    });

    const data = await res.json();
    const responseBox = document.getElementById("createContactResponse");
    responseBox.classList.remove("d-none");

    responseBox.innerHTML = `
      <div class="alert ${data.status ? 'alert-success' : 'alert-danger'}">
        <strong>${data.message}</strong>
        <pre class="mt-2">${JSON.stringify(data, null, 2)}</pre>
      </div>
    `;
    responseBox.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (error) {
    const responseBox = document.getElementById("createContactResponse");
    responseBox.classList.remove("d-none");
    responseBox.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
    responseBox.scrollIntoView({ behavior: "smooth", block: "center" });
  } finally {
    setButtonState(btn, { disabled: false });
  }
}

const fieldsModal = document.getElementById('fieldsModal');

fieldsModal.addEventListener('hidden.bs.modal', () => {
  document.querySelector('.modal-title').textContent = 'Create Contact';

  document.getElementById('commonFieldsContainer').innerHTML = '';
  document.getElementById('otherFieldsContainer').innerHTML = '';
  const responseBox = document.getElementById('createContactResponse');
  responseBox.classList.add('d-none');
  responseBox.innerHTML = '';
  currentMode = "contact";
  document.getElementById("submitBtn").textContent = "Create Contact";
  document.getElementById("token").value='';
});
function handleSubmit() {
  if (currentMode === "contact") {
    createContact();
  } else {
    createCompany();
  }
}
function setOtherButtonsDisabled(activeBtn, disabled = true) {
  const buttons = document.querySelectorAll(".action-btn");

  buttons.forEach(btn => {
    if (btn !== activeBtn) {
      btn.disabled = disabled;
    }
  });
}