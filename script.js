const form = document.getElementById("form-pengaduan");
const lokasi = document.getElementById("lokasi");
const deskripsi = document.getElementById("deskripsi");
const penghitung = document.getElementById("penghitung");

const MINIMAL = 20;

const IKON_SUKSES = '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const IKON_ERROR  = '<svg viewBox="0 0 24 24"><path d="M12 6v7M12 17.5v.5"/></svg>';

// Buat popup otomatis kalau belum ada di HTML
let popup = document.getElementById("popup");
if (!popup) {
  popup = document.createElement("div");
  popup.id = "popup";
  popup.className = "popup-latar";
  popup.hidden = true;
  popup.innerHTML =
    '<div class="popup-kotak" role="dialog" aria-modal="true" aria-labelledby="popup-judul" aria-describedby="popup-pesan">' +
      '<div class="popup-ikon" id="popup-ikon" aria-hidden="true"></div>' +
      '<h3 id="popup-judul"></h3>' +
      '<p id="popup-pesan"></p>' +
      '<button type="button" class="tombol" id="popup-tutup">Oke</button>' +
    '</div>';
  document.body.appendChild(popup);
}

const popupKotak = popup.querySelector(".popup-kotak");
const popupIkon = popup.querySelector("#popup-ikon");
const popupJudul = popup.querySelector("#popup-judul");
const popupPesan = popup.querySelector("#popup-pesan");
const popupTutup = popup.querySelector("#popup-tutup");

let elemenSebelumnya = null;
let aksiSetelahTutup = null;
let timerOtomatis = null;

// tipe: "sukses" atau "error"
function tampilkanPopup(tipe, judul, pesan, aksiTutup) {
  elemenSebelumnya = document.activeElement;
  aksiSetelahTutup = aksiTutup || null;

  popupKotak.classList.toggle("error", tipe === "error");
  popupIkon.innerHTML = tipe === "error" ? IKON_ERROR : IKON_SUKSES;
  popupJudul.textContent = judul;
  popupPesan.textContent = pesan;

  popup.hidden = false;
  popupTutup.focus();

  clearTimeout(timerOtomatis);
  if (tipe === "sukses") {
    timerOtomatis = setTimeout(tutupPopup, 4000); // tutup otomatis 4 detik
  }
}

function tutupPopup() {
  if (popup.hidden) return;
  clearTimeout(timerOtomatis);
  popup.hidden = true;
  if (aksiSetelahTutup) aksiSetelahTutup();
  else if (elemenSebelumnya) elemenSebelumnya.focus();
}

popupTutup.addEventListener("click", tutupPopup);

popup.addEventListener("click", (e) => {
  if (e.target === popup) tutupPopup();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") tutupPopup();
});

function perbaruiPenghitung() {
  const jumlah = deskripsi.value.trim().length;
  penghitung.textContent = jumlah + " karakter · minimal " + MINIMAL;
  penghitung.classList.toggle("cukup", jumlah >= MINIMAL);
  penghitung.classList.toggle("kurang", jumlah < MINIMAL && jumlah > 0);
}

deskripsi.addEventListener("input", () => {
  deskripsi.classList.remove("salah");
  perbaruiPenghitung();
});

lokasi.addEventListener("input", () => lokasi.classList.remove("salah"));

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (lokasi.value.trim() === "") {
    lokasi.classList.add("salah");
    tampilkanPopup("error", "Lokasi belum diisi", "Isi lokasi kerusakan dulu ya.", () => lokasi.focus());
    return;
  }

  if (deskripsi.value.trim().length < MINIMAL) {
    deskripsi.classList.add("salah");
    tampilkanPopup(
      "error",
      "Deskripsi terlalu singkat",
      "Deskripsi minimal " + MINIMAL + " karakter ya.",
      () => deskripsi.focus()
    );
    return;
  }

  tampilkanPopup("sukses", "Laporan Diterima!", "Terima kasih, laporanmu sudah kami catat dan akan segera ditindaklanjuti.");
  form.reset();
  perbaruiPenghitung();
});

perbaruiPenghitung();
