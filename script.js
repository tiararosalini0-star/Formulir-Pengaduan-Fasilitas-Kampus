const form = document.getElementById("form-pengaduan");
const lokasi = document.getElementById("lokasi");
const deskripsi = document.getElementById("deskripsi");
const penghitung = document.getElementById("penghitung");

const MINIMAL = 20;

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
    lokasi.focus();
    alert("Lokasi wajib diisi.");
    return;
  }

  // Validasi panjang deskripsi dengan properti .length
  if (deskripsi.value.trim().length < MINIMAL) {
    deskripsi.classList.add("salah");
    deskripsi.focus();
    alert("Deskripsi minimal " + MINIMAL + " karakter.");
    return; // tolak submit
  }

  alert("Laporan telah diterima!");
  form.reset();
  perbaruiPenghitung();
});

perbaruiPenghitung();
