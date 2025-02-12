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

export async function ambiltodolist () {
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

export function formatAngka(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export async function tambahtodolist(nama, prioritas, status, tanggal) {
  try {
    const dokRef = await addDoc(collection(db, 'todolist'), {

      nama: nama,
      prioritas: prioritas,
      status: status,
      tanggal: tanggal,
      
    });
    console.log('Berhasil menambah todolist' + dokRef.id);
  } catch (e) {
    console.log('Gagal menambah todolist ' + e);
  }
}


export async function hapustodolist(docid) {
  await deleteDoc(doc(db, "todolist", docid));
}
export async function ubahtodolist(docId, nama, alamat, nohp) {
  await updateDoc(doc(db, "member", docId), {
    nama: nama,
    alamat:alamat,
    nohp: nohp,
  });
}

export async function ambiltodolist(docId) {
  const docRef = await doc(db, "todolist", docId);
  const docSnap = await getDoc(docRef);

  return await docSnap.data();
}
document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
    let taskInput = document.getElementById("taskInput");
    let priority = document.getElementById("priority").value;
    let dateInput = document.getElementById("dateInput").value;
    
    let taskText = taskInput.value.trim();
    if (taskText === "") {
        alert("Tugas tidak boleh kosong!");
        return;
    }

    let tasks = getTasksFromStorage();
    tasks.push({ text: taskText, priority: priority, date: dateInput, completed: false });
    saveTasksToStorage(tasks);

    taskInput.value = "todolist";
    loadTasks();
}

function loadTasks() {
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "todolist";

    let tasks = getTasksFromStorage();

    tasks.forEach((task, index) => {
        let li = document.createElement("li");

        let span = document.createElement("span");
        span.textContent = `${task.text} (${task.priority}) - ${task.date}`;
        if (task.completed) span.classList.add("completed");
        span.onclick = () => toggleTask(index);

        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Hapus";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.onclick = () => deleteTask(index);

        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

function toggleTask(index) {
    let tasks = getTasksFromStorage();
    tasks[index].completed = !tasks[index].completed;
    saveTasksToStorage(tasks);
    loadTasks();
}

function deleteTask(index) {
    let tasks = getTasksFromStorage();
    tasks.splice(index, 1);
    saveTasksToStorage(tasks);
    loadTasks();
}

function getTasksFromStorage() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasksToStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}