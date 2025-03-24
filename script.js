import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAmGSWnVBKRwALcrmOOhZjgeAgqEESDQOQ",
    authDomain: " lista de tareas-9a521.firebaseapp.com" ,
    projectId: "lista-de-tareas-9a521",
    storageBucket: "lista-de-tareas-9a521.firebasestorage.app",
    messagingSenderId: "750168165362 ",
    appId: "1:750168165362:web:6a71ffea75ae66b6d6b96b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const taskCollection = collection(db, "tareas");

document.getElementById("addTask").addEventListener("click", async () => {
    const taskInput = document.getElementById("taskInput");
    if (taskInput.value.trim() !== "") {
        await addDoc(taskCollection, { titulo: taskInput.value, completada: false });
        taskInput.value = "";
    }
});

function renderTasks(snapshot) {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    snapshot.forEach(docSnap => {
        const task = docSnap.data();
        const li = document.createElement("li");
        li.innerHTML = `
            <span class="${task.completada ? 'completed' : ''}">${task.titulo}</span>
            <button class="complete" data-id="${docSnap.id}">✔</button>
            <button class="delete" data-id="${docSnap.id}">✖</button>
        `;
        taskList.appendChild(li);
    });
}

onSnapshot(taskCollection, renderTasks);

document.getElementById("taskList").addEventListener("click", async (event) => {
    if (event.target.classList.contains("delete")) {
        await deleteDoc(doc(db, "tareas", event.target.dataset.id));
    } else if (event.target.classList.contains("complete")) {
        const taskRef = doc(db, "tareas", event.target.dataset.id);
        await updateDoc(taskRef, { completada: true });
    }
});