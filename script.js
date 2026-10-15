const form = document.getElementById("form-pengaduan");
const lokasi = document.getElementById("lokasi");
const deskripsi = document.getElementById("deskripsi");
const penghitung = document.getElementById("penghitung");

const popup = document.getElementById("popup");
const popupKotak = popup.querySelector(".popup-kotak");
const popupIkon = document.getElementById("popup-ikon");
const popupJudul = document.getElementById("popup-judul");
const popupPesan = document.getElementById("popup-pesan");
const popupTutup = document.getElementById("popup-tutup");

const MINIMAL = 20;

const IKON_SUKSES = '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const IKON_ERROR  = '<svg viewBox="0 0 24 24"><path d="M12 6v7M12 17.5v.5"/></svg>';

let elemenSebelumnya = null;
let aksiSetelahTutup = null;
let timerOtomatis = null;

// Tampilkan popup. tipe: "sukses" atau "error"
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

// Klik area gelap di luar kotak untuk menutup
popup.addEventListener("click", (e) => {
  if (e.target === popup) tutupPopup();
});

// Tekan Esc untuk menutup
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

  // Validasi panjang deskripsi dengan properti .length
  if (deskripsi.value.trim().length < MINIMAL) {
    deskripsi.classList.add("salah");
    tampilkanPopup(
      "error",
      "Deskripsi terlalu singkat",
      "Deskripsi minimal " + MINIMAL + " karakter ya.",
      () => deskripsi.focus()
    );
    return; // tolak submit
  }

  tampilkanPopup("sukses", "Laporan Diterima!", "Terima kasih, laporanmu sudah kami catat dan akan segera ditindaklanjuti.");
  form.reset();
  perbaruiPenghitung();
});

perbaruiPenghitung();
