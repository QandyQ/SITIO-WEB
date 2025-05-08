const URL = "./my_model/";

let model, webcam, labelContainer, maxPredictions;

// Cargar el modelo y configurar la webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Cargar el modelo
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Configurar la webcam
    const flip = true;
    webcam = new tmImage.Webcam(600, 600, flip);
    await webcam.setup();
    await webcam.play();
    
    // Agregar el canvas de la webcam al contenedor
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    
    // Configurar contenedor de etiquetas
    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = "";

    // Crear elementos para cada clase de predicción
    for (let i = 0; i < maxPredictions; i++) {
        const wrapper = document.createElement("div");
        wrapper.className = `prediccion color-${i % 5}`;
    
        const bar = document.createElement("div");
        bar.className = "barra";
    
        const label = document.createElement("div");
        label.className = "label";
        label.innerText = "Esperando...";
    
        wrapper.appendChild(bar);
        wrapper.appendChild(label);
        labelContainer.appendChild(wrapper);
    }

    // Iniciar el bucle de predicción
    window.requestAnimationFrame(loop);
}

// Función de predicción principal
async function predict() {
    const prediction = await model.predict(webcam.canvas);
    
    for (let i = 0; i < maxPredictions; i++) {
        const predBox = labelContainer.children[i];
        const bar = predBox.querySelector(".barra");
        const label = predBox.querySelector(".label");

        const prob = prediction[i].probability;
        const percent = (prob * 100).toFixed(0);

        // Actualizar texto y ancho de la barra
        label.innerText = `${prediction[i].className}: ${percent}%`;
        bar.style.width = `${percent}%`;
    }
}

// Bucle principal de animación
async function loop() {
    webcam.update(); // Actualizar el frame de la webcam
    await predict(); // Realizar predicción
    window.requestAnimationFrame(loop); // Continuar el bucle
}

// Mostrar/ocultar mensaje modal
function mostrarMensaje() {
    document.getElementById('mensaje').style.display = 'flex';
}
    
function ocultarMensaje() {
    document.getElementById('mensaje').style.display = 'none';
}

// Event listeners
document.getElementById("start-button").addEventListener("click", function() {
    const estado = document.getElementById("estado-sistema");
    estado.style.display = "block";
    estado.classList.add("fade-in");
});