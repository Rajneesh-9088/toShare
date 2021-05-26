const dropZone = document.querySelector(".drop-zone");
const browseBtn = document.querySelector(".browseBtn");
const fileInput = document.querySelector("#fileInput");

const progressContainer = document.querySelector(".progress-container");
const bgProgress = document.querySelector(".bg-progress");
const progressBar = document.querySelector("progress-bar");
const percentDiv = document.querySelector("#percent");

const sharingContainer = document.querySelector(".sharing-container");
const fileUrlInput = document.querySelector("#fileUrl");
const copyBtn = document.querySelector("#copyBtn");

const emailForm = document.querySelector("#emailForm");
const toast = document.querySelector(".toast");

const host = "https://innshare.herokuapp.com";
const uploadUrl = `${host}/api/files`;
const emailUrl = `${host}/api/files/send`;

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  if (!dropZone.classList.contains("dragged")) {
    dropZone.classList.add("dragged");
  }
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragged");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragged");
  const files = e.dataTransfer.files;
  console.table(files);
  if (files.length) {
    fileInput.files = files;
    uploadFile();
  }
});

fileInput.addEventListener("change", () => {
  uploadFile();
});

browseBtn.addEventListener("click", (e) => {
  fileInput.click();
});

copyBtn.addEventListener("click", () => {
  fileUrlInput.select();
  document.execCommand("copy");
  showToast("Linkd copied");
});

const uploadFile = () => {
  progressContainer.style.display = "block";

  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("myfile", file);

  const xhr = new XMLHttpRequest();

  //
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      console.log(xhr.response);
      onUploadSuccess(JSON.parse(xhr.response));
    }
  };
  xhr.upload.onprogress = updatedProgress;
  xhr.upload.onerror = () => {
    fileInput.value = "";
    showToast(`Error in upload ${xhr.statusText}`);
  };

  xhr.upload.onprogress = xhr.open("POST", uploadUrl);
  xhr.send(formData);
};

const updatedProgress = (e) => {
  const percent = Math.round((e.loaded / e.total) * 100);
  console.log(percent);
  bgProgress.style.width = `${percent}%`;
  percent.innerText = percent;
  progressBar.style.transform = `scaleX(${percent / 100})`;
};

const onUploadSuccess = ({ file: url }) => {
  console.log(url);
  fileInput.value = "";
  emailForm[2].removeAttribute("disabled");
  progressContainer.style.display = "none";
  sharingContainer.style.display = "block";
  fileUrlInput.value = url;
};

emailForm.addEventListener("submit", (e) => {
  e.preventDefault();

  console.log("submit clicked ");

  const url = fileUrlInput.value;
  const formData = {
    uuid: url.split("/").splice(-1, 1)[0],
    emailTo: emailForm.elements["to-email"].value,
    emailFrom: emailForm.elements["from-email"].value,
  };

  emailForm[2].setAttribute("disabled", "true");
  console.table(formData);

  fetch(emailUrl, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .then(({ success }) => {
      if (success) {
        sharingContainer.style.display = "none";
        showToast("Email Sent");
      }
    });
});

let toastTimer;
const showToast = (msg) => {
  toast.innerText = msg;
  toast.style.transform = "translate(-50%,0)";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.style.transform = "translate(-50%,60px)";
  }, 2000);
};
