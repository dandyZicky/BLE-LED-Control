$(document).ready(function () {
    // Bluetooth connection
    let blueTooth = new p5ble();

    let connectToBle = document.getElementById('connect-ble');
    connectToBle.addEventListener("click", () => connectingBle());

    function connectingBle() {
        // Connect to a device by passing the service UUID
        blueTooth.connect(0xFFE0, gotCharacteristics);
    }

    function gotCharacteristics(error, characteristics) {
        if (error) {
            console.log('error: ', error);
        }
        console.log('characteristics: ', characteristics);
        blueToothCharacteristic = characteristics[0];

        blueTooth.startNotifications(blueToothCharacteristic, gotValue, 'string');


        isConnected = blueTooth.isConnected();
        // Add a event handler when the device is disconnected
        blueTooth.onDisconnected(onDisconnected);
    }
    // Control
    let brightnessListener = document.getElementById('rangeSlider');
    brightnessListener.addEventListener("input", () => brightnessCallback());

    let selectListener = document.getElementById('led-number');
    selectListener.addEventListener("change", () => selectCallback());

    let offButton = document.getElementById('led-off');
    offButton.addEventListener("click", () => allLedOff());

    var $input = $("input.pickr-field");
    var current_color = $(".pickr-field").val() || document.getElementById('val-color').innerText;

    const brightnesses = [];
    const colors = [];

    for (let index = 0; index < 11; index++) {
        brightnesses[index] = '0';
        colors[index] = '#000000';

    }
    console.log(selectListener.value)
    console.log(brightnesses)
    console.log(colors)

    //
    var pickr = new Pickr({
        el: $(".pickr")[0],
        theme: "classic",
        swatches: [
            'rgba(244, 67, 54, 1)',
            'rgba(233, 30, 99, 0.95)',
            'rgba(156, 39, 176, 0.9)',
            'rgba(103, 58, 183, 0.85)',
            'rgba(63, 81, 181, 0.8)',
            'rgba(33, 150, 243, 0.75)',
            'rgba(3, 169, 244, 0.7)',
            'rgba(0, 188, 212, 0.7)',
            'rgba(0, 150, 136, 0.75)',
            'rgba(76, 175, 80, 0.8)',
            'rgba(139, 195, 74, 0.85)',
            'rgba(205, 220, 57, 0.9)',
            'rgba(255, 235, 59, 0.95)',
            'rgba(255, 193, 7, 1)'
        ],
        defaultRepresentation: "HEXA",
        default: '#000000',
        comparison: false,
        components: {
            preview: true,
            opacity: true,
            hue: true,
            interaction: {
                hex: true,
                rgba: true,
                hsva: false,
                input: true,
                clear: true,
                cancel: true,
                save: true
            }
        }
    });
    //
    pickr
        .on("clear", function (instance) {
            //console.log("clear");
            $input.val("").trigger("change");
        })
        .on("cancel", function (instance) {
            current_color = instance
                .getSelectedColor()
                .toHEXA()
                .toString();
            //console.log("cancel", current_color);
            $input.val(current_color).trigger("change");
        })
        .on("change", function (color, instance) {
            current_color = color
                .toHEXA()
                .toString();
            document.getElementById('val-color').innerText = current_color;
            $input.val(current_color).trigger("change");
            let idx = selectListener.selectedIndex;
            if (idx == 0) {
                for (let index = 0; index < 11; index++) {
                    colors[index] = current_color
                    brightnesses[index] = brightnessListener.value
                }
                console.log(selectListener.value)
                console.log(colors);
                console.log(brightnesses)
            } else {
                colors[idx] = current_color
                brightnesses[idx] = brightnessListener.value
                console.log(selectListener.value)
                console.log(colors);
                console.log(brightnesses)
            }
        });
    //

    function brightnessCallback() {
        let idx = selectListener.selectedIndex;
        if (idx == 0) {
            for (let index = 0; index < 11; index++) {
                colors[index] = current_color;
                brightnesses[index] = brightnessListener.value;
            }
            console.log(selectListener.value);
            console.log(colors);
            console.log(brightnesses);
        } else {
            colors[idx] = current_color;
            brightnesses[idx] = brightnessListener.value;
            console.log(selectListener.value);
            console.log(colors);
            console.log(brightnesses);
        }
        // send data via bluetooth
    }
    let valueBrightness = document.getElementById('val-brightness');

    function selectCallback() {
        let idx = selectListener.selectedIndex;
        let deltaBr = -(brightnessListener.value - brightnesses[idx]);
        brightnessListener.stepUp(deltaBr);
        valueBrightness.innerText = thumbPos.value;
        pickr.setColor(colors[idx]);
        console.log(selectListener.value);
        console.log(colors);
        console.log(brightnesses);
    }

    function allLedOff() {
        for (let index = 0; index < 11; index++) {
            let idx = selectListener.selectedIndex;
            let deltaBr = -(brightnessListener.value - 0);
            pickr.setColor('#000000');
            brightnessListener.stepUp(deltaBr);
            valueBrightness.innerText = thumbPos.value;
        }
        console.log(selectListener.value);
        console.log(colors);
        console.log(brightnesses);
    }
    // function sendData() {

    // }
});