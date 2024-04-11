const LABEL_MAP = {
    1: { name: 'Plastic', color: 'red' },
    2: { name: 'Paper', color: 'yellow' },
    3: { name: 'Glass', color: 'lime' },
    4: { name: 'Metal', color: 'blue' },
    5: { name: 'Other', color: 'purple' },
}

// Define a drawing function
export const drawRect = (boxes, classes, scores, threshold, imgWidth, imgHeight, ctx, target) => {
    for (let i = 0; i <= Math.min(5, boxes.length); i++) {
        if (boxes[i] && classes[i] && scores[i] > threshold) {
            // Extract variables
            const [y, x, height, width] = boxes[i]
            const text = classes[i]

            console.log(`Detected Class: ${LABEL_MAP[text]['name']}. Prediction Score: ${scores[i]}`)

            // Set styling
            ctx.strokeStyle = LABEL_MAP[text]['color']
            ctx.lineWidth = 5
            ctx.fillStyle = 'white'
            ctx.font = '30px Poppins'

            // DRAW!!
            ctx.beginPath()
            ctx.fillText(LABEL_MAP[text]['name'] + ' - ' + Math.round(scores[i] * 100) / 100, x * imgWidth, y * imgHeight - 10)
            ctx.rect(x * imgWidth, y * imgHeight, width * imgWidth / 2, height * imgHeight / 1.5);
            ctx.stroke()

            console.log("Target: ", target, " Detected: ", LABEL_MAP[text]['name']);

            if (target && target.toUpperCase() === LABEL_MAP[text]['name'].toUpperCase()) {
                return true;
            };
        }
    }
    return false;
}