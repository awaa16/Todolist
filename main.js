import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

import {

  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAbLsq27KJU9tD9pHC8GrPUB7LgEPEQbPU",
  authDomain: "insan-cemerlang-92ee0.firebaseapp.com",
  projectId: "insan-cemerlang-92ee0",
  storageBucket: "insan-cemerlang-92ee0.appspot.com",
  messagingSenderId: "332441427242",
  appId: "1:332441427242:web:73c31309147ef1dab15253",
  measurementId: "G-JW04DZL85R"
};
// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function ambildaftartodolist() {
  const refDokumen = collection(db, "todolist");
  const kueri = query(refDokumen, orderBy("nama"));
  const cuplikanKueri = await getDocs(kueri);

  let hasil = [];
  cuplikanKueri.forEach((dok) => {
    hasil.push({
      id: dok.id,
      nama: dok.data().nama,
      prioritas: dok.data().prioritas,
      status: dok.data().status,
      tanggal: dok.data().tanggal,
    });
  });

  return hasil;
}

export async function tambahtodolist(nama, prioritas, tanggal, status = false) {
  try {
    const dokRef = await addDoc(collection(db, 'todolist'), {
      nama: nama,
      prioritas: prioritas,
      tanggal: tanggal,
      status: status // default ke false (Belum Dikerjakan)
    });
    console.log('Berhasil menambah todolist ' + dokRef.id);
  } catch (e) {
    console.log('Gagal menambah todolist ' + e);
  }
}

export async function hapustodolist(docid) {
  await deleteDoc(doc(db, "todolist", docid));
}

// Fungsi untuk memperbarui status saja
export async function updateStatus(docId, status) {
  try {
    await updateDoc(doc(db, "todolist", docId), {
      status: status
    });
    console.log(`Status berhasil diperbarui untuk docId: ${docId}`);
  } catch (error) {
    console.error(`Gagal memperbarui status: ${error}`);
  }
}

// Fungsi untuk memperbarui seluruh data
export async function ubahtodolist(docId, nama, prioritas, tanggal, status) {
  try {
    // Validasi status sebelum memperbarui
    const docRef = doc(db, "todolist", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const dataLama = docSnap.data();

      // Cegah perubahan langsung dari "Belum Dikerjakan" ke "Selesai"
      if (dataLama.status === "Belum Dikerjakan" && status === "Selesai") {
        console.error("Status tidak dapat langsung diubah ke 'Selesai' dari 'Belum Dikerjakan'.");
        return;
      }

      // Jika status tidak diubah, gunakan status lama
      if (status === "" || status === dataLama.status) {
        status = dataLama.status;
      }
    }

    // Perbarui dokumen
    await updateDoc(docRef, {
      nama: nama,
      prioritas: prioritas,
      tanggal: tanggal,
      status: status
    });

    console.log(`Data berhasil diperbarui untuk docId: ${docId}`);
  } catch (error) {
    console.error(`Gagal memperbarui data: ${error}`);
  }
}

export async function ambiltodolist(docId) {
  const docRef = doc(db, "todolist", docId);
  const docSnap = await getDoc(docRef);

  return docSnap.data();
}