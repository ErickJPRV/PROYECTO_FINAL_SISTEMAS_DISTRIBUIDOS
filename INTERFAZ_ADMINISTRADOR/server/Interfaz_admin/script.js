const sidebar = document.querySelector(".sidebar");
const sidebarOpenBtn = document.querySelector("#sidebar-open");
const sidebarCloseBtn = document.querySelector("#sidebar-close");
const sidebarLockBtn = document.querySelector("#lock-icon");

const toggleLock = () => {
  sidebar.classList.toggle("locked");
  if (!sidebar.classList.contains("locked")) {
    sidebar.classList.add("hoverable");
    sidebarLockBtn.classList.replace("bx-lock-alt", "bx-lock-open-alt");
  } else {
    sidebar.classList.remove("hoverable");
    sidebarLockBtn.classList.replace("bx-lock-open-alt", "bx-lock-alt");
  }
};

const hideSidebar = () => {
  if (sidebar.classList.contains("hoverable")) {
    sidebar.classList.add("close");
  }
};
const showSidebar = () => {
  if (sidebar.classList.contains("hoverable")) {
    sidebar.classList.remove("close");
  }
};

const toggleSidebar = () => {
  sidebar.classList.toggle("close");
};

if (window.innerWidth < 800) {
  sidebar.classList.add("close");
  sidebar.classList.remove("locked");
  sidebar.classList.remove("hoverable");
}

sidebarLockBtn.addEventListener("click", toggleLock);
sidebar.addEventListener("mouseleave", hideSidebar);
sidebar.addEventListener("mouseenter", showSidebar);
sidebarOpenBtn.addEventListener("click", toggleSidebar);
sidebarCloseBtn.addEventListener("click", toggleSidebar);

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDcR3EvHymzKMqtKLgH2gioGRfqjPEpvpo",
  authDomain: "sistemas-distribuidos-86ecf.firebaseapp.com",
  projectId: "sistemas-distribuidos-86ecf",
  storageBucket: "sistemas-distribuidos-86ecf.appspot.com",
  messagingSenderId: "926923279386",
  appId: "1:926923279386:web:4244499687080723cfd5a3"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage();
const firestore = getFirestore();
const imageList = document.getElementById('imageList');

// Obtén una referencia a la colección "fotos" en Firestore
const fotosCollection = collection(firestore, 'fotos');

document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('fileInput');
    const tituloInput = document.getElementById('tituloInput');
    const uploadButton = document.getElementById('uploadButton');

    if (uploadButton) {
        uploadButton.addEventListener('click', subirImagen);
    }

    // Escucha cambios en la colección 'fotos' en tiempo real
    onSnapshot(fotosCollection, (snapshot) => {
        // Obtén los documentos de la colección 'fotos'
        const fotos = snapshot.docs.map(doc => doc.data());
        // Muestra todas las imágenes en la lista
        mostrarImagenesEnLista(fotos);
    });
});

async function subirImagen() {
    const fileInput = document.getElementById('fileInput');
    const tituloInput = document.getElementById('tituloInput');

    if (fileInput && fileInput.files.length > 0) {
        try {
            const file = fileInput.files[0];
            const fileName = file.name;
            const storageRef = ref(storage, `fotos/${fileName}`);
            await uploadBytes(storageRef, file);

            const downloadURL = await getDownloadURL(storageRef);

            await addDoc(fotosCollection, {
                url: downloadURL,
                titulo: tituloInput.value,
            });

            // Limpiar los campos después de la carga
            fileInput.value = '';
            tituloInput.value = '';
        } catch (error) {
            console.error('Error al subir la imagen:', error);
            alert('Error al subir la imagen');
        }
    } else {
        alert('Por favor, selecciona una imagen');
    }
}

function mostrarImagenesEnLista(fotos) {
    const imageList = document.getElementById('imageList');

    if (imageList) {
        // Limpiar la lista antes de mostrar nuevas imágenes
        imageList.innerHTML = '';

        // Iterar sobre las imágenes y crear elementos de imagen, título y descripción
        fotos.forEach((foto) => {
            // Contenedor para cada elemento
            const container = document.createElement('div');
            container.classList.add('image-container');

            // Imagen
            const imgElement = document.createElement('img');
            imgElement.src = foto.url;
            imgElement.classList.add('uploaded-image');
            container.appendChild(imgElement);

            // Título
            const tituloElement = document.createElement('p');
            tituloElement.textContent = `Título: ${foto.titulo}`;
            tituloElement.classList.add('image-title');
            container.appendChild(tituloElement);

            // Agregar el contenedor al imageList
            imageList.appendChild(container);
        });
    }
}
